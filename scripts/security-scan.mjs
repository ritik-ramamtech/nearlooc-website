#!/usr/bin/env node
// Repo security scanner. Blocks the malware patterns this project has already been hit with:
// payloads hidden behind whitespace, remote-code loaders, fake font files, VS Code tasks that run
// on folder open, committed .env files, .gitignore tampering and code injected into merge commits.
// Zero dependencies. Reads content straight from git objects and never executes repo code.
//
// Usage:
//   node scripts/security-scan.mjs                      scan the HEAD commit
//   node scripts/security-scan.mjs --worktree           scan working tree (tracked + untracked, not ignored)
//   node scripts/security-scan.mjs --ref origin/main    scan a fetched ref without checking it out
//   node scripts/security-scan.mjs --range base..head   also inspect merge commits in that range
//   --repo <dir>   --config <file>   (default: <repo>/security-scan.config.json)

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const BINARY_EXTENSIONS = new Set([
  '.woff', '.woff2', '.ttf', '.otf', '.eot', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico',
  '.bmp', '.tif', '.tiff', '.mp3', '.mp4', '.webm', '.wav', '.ogg', '.pdf', '.zip', '.gz', '.tgz', '.7z',
  '.exe', '.dll', '.node', '.wasm',
]);
const CODE_EXTENSIONS = new Set([
  '.js', '.cjs', '.mjs', '.jsx', '.ts', '.cts', '.mts', '.tsx', '.html', '.htm', '.vue', '.svelte',
  '.json', '.jsonc', '.yml', '.yaml', '.toml', '.css', '.scss', '.prisma', '.sql', '.sh', '.bat', '.cmd',
  '.ps1', '.env',
]);
const LOCKFILES = new Set(['package-lock.json', 'npm-shrinkwrap.json']);
const SKIP_CONTENT = /(^|\/)(yarn\.lock|pnpm-lock\.yaml)$|\.min\.(js|css)$|\.map$/;

const MAX_LINE_LENGTH = 2000;
const MAX_FINDINGS_PER_FILE_RULE = 10;
const HIDDEN_AFTER_WHITESPACE = /\S[ \t]{80,}\S/;
const LEADING_WHITESPACE_PADDING = /^[ \t]{150,}\S/;
const OBFUSCATED_IDENTIFIER = /\b_0x[0-9a-f]{4,}\b/g;
const BASE64_LITERAL = /['"`]([A-Za-z0-9+/_-]{16,}={0,2})['"`]|=\s*([A-Za-z0-9+/_-]{16,}={0,2})\s*$/gm;
const CHILD_PROCESS_IMPORT = /(?:require\s*\(\s*|from\s+|import\s*\(\s*|import\s+)['"`](?:node:)?child_process['"`]/g;

const DYNAMIC_CODE_PATTERNS = [
  [/(?<![\w$])eval\s*\(/g, 'Calling eval executes arbitrary strings as code.'],
  [/\bnew\s+Function\s*\(/g, 'The Function constructor executes arbitrary strings as code.'],
  [/\bvm\s*\.\s*(?:runInThisContext|runInNewContext|runInContext|compileFunction)\s*\(/g, 'node:vm executes arbitrary strings as code.'],
];
const IOC_PATTERNS = [
  [/(?:files|litter)\.catbox\.moe/gi, 'Anonymous file host used to serve this repo\'s previous malware payload.'],
  [/pastebin\.com\/raw|paste\.ee\/r\/|hastebin\.com\/raw|transfer\.sh\//gi, 'Raw paste / anonymous upload host — common payload source.'],
  [/\.ngrok(?:-free)?\.(?:io|app)|trycloudflare\.com/gi, 'Tunnel host — common command-and-control endpoint.'],
  [/api\.telegram\.org\/bot|discord(?:app)?\.com\/api\/webhooks/gi, 'Chat webhook — common data exfiltration channel.'],
  [/\bglobal\s*\.\s*i\s*=\s*['"]/g, 'Marker of the obfuscated config-file loader previously injected into postcss.config.js.'],
  [/-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g, 'Private key committed to the repo.'],
];
const VSCODE_AUTORUN_PATTERNS = [
  [/"runOn"\s*:\s*"folderOpen"/g, 'Task runs automatically when the folder is opened in VS Code / Cursor / Antigravity.'],
  [/"task\.allowAutomaticTasks"\s*:\s*(?:true|"on")/g, 'Enables automatic tasks without prompting.'],
];
const SVG_ACTIVE_CONTENT = /<script\b|<foreignObject\b|\son[a-z]+\s*=|javascript:/i;
const SECRET_FILE = /^\.env(?:\..+)?$|\.pem$|^id_(?:rsa|dsa|ecdsa|ed25519)$|\.p12$|\.pfx$/i;
const SECRET_FILE_TEMPLATE = /\.(?:example|sample|template|dist)$/i;
const LIFECYCLE_SCRIPT = /^(?:pre|post)|^(?:install|prepare|prepublish|prepublishOnly|prepack|postpack|dependencies)$/;
const RISKY_SCRIPT_COMMAND = /\bcurl\b|\bwget\b|https?:\/\/|\bbase64\b|\bnode\s+(?:-e|--eval|-p|--print)\b|\bpowershell\b|\bpwsh\b|Invoke-WebRequest|\biex\b|\b(?:ba)?sh\s+-c\b|\.(?:woff2?|ttf|eot|png|jpe?g)\b/i;
// Entries the malware added to .gitignore to hide its own helper files (or .gitignore edits).
const MALWARE_IGNORE_ENTRIES = new Set(['.gitignore', 'config.bat', 'temp_auto_push.bat', 'temp_interactive_push.bat', 'branch_structure.json']);

const args = parseArgs(process.argv.slice(2));
const repo = path.resolve(args.repo ?? '.');
const config = loadConfig(args.config ?? path.join(repo, 'security-scan.config.json'));

const findings = [];
const seen = new Set();
const shownPerFileRule = new Map();
let hiddenFindings = 0;
let allowlistedFindings = 0;

function main() {
  const files = args.worktree ? readWorktree() : readRef(args.ref ?? 'HEAD');
  for (const file of files) scanFile(file);
  checkGitignore(files);
  if (args.range) checkMergeCommits(args.range);
  report(files.length);
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--worktree') parsed.worktree = true;
    else if (['--ref', '--range', '--repo', '--config'].includes(arg) && argv[i + 1]) parsed[arg.slice(2)] = argv[++i];
    else {
      console.error(`Unknown or incomplete argument: ${arg}`);
      process.exit(2);
    }
  }
  return parsed;
}

function loadConfig(file) {
  const defaults = {
    requiredGitignore: ['.env'],
    allowedScripts: {},
    allowedRegistries: ['https://registry.npmjs.org/'],
    allowedMergeCommits: [],
    allow: [],
  };
  if (!existsSync(file)) return defaults;
  return { ...defaults, ...JSON.parse(readFileSync(file, 'utf8')) };
}

function git(argv, input) {
  return execFileSync('git', ['-C', repo, ...argv], { input, maxBuffer: 1024 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'] });
}

function readRef(ref) {
  const entries = git(['ls-tree', '-r', '-z', '--full-tree', ref])
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .map((line) => {
      const tab = line.indexOf('\t');
      const [, type, sha] = line.slice(0, tab).split(' ');
      return { type, sha, path: line.slice(tab + 1) };
    })
    .filter((entry) => entry.type === 'blob');
  const blobs = readBlobs(entries.map((entry) => entry.sha));
  return entries.map((entry) => ({ path: entry.path, content: blobs.get(entry.sha) ?? Buffer.alloc(0) }));
}

function readBlobs(shas) {
  const blobs = new Map();
  const unique = [...new Set(shas)];
  if (unique.length === 0) return blobs;
  const out = git(['cat-file', '--batch'], `${unique.join('\n')}\n`);
  let pos = 0;
  while (pos < out.length) {
    const headerEnd = out.indexOf(10, pos);
    const [sha, type, size] = out.subarray(pos, headerEnd).toString('utf8').split(' ');
    if (type === 'missing') {
      pos = headerEnd + 1;
      continue;
    }
    const start = headerEnd + 1;
    blobs.set(sha, out.subarray(start, start + Number(size)));
    pos = start + Number(size) + 1;
  }
  return blobs;
}

function readWorktree() {
  return git(['ls-files', '-z', '--cached', '--others', '--exclude-standard'])
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .filter((file) => {
      const full = path.join(repo, file);
      return existsSync(full) && statSync(full).isFile();
    })
    .map((file) => ({ path: file, content: readFileSync(path.join(repo, file)) }));
}

function scanFile({ path: file, content }) {
  const ext = path.posix.extname(file).toLowerCase();
  const base = path.posix.basename(file);

  if (SECRET_FILE.test(base) && !SECRET_FILE_TEMPLATE.test(base)) {
    add('secret-file-committed', file, 1, `${base} must never be committed. Remove it from git (git rm --cached) and rotate every secret in it.`);
  }

  if (BINARY_EXTENSIONS.has(ext)) {
    if (looksLikeText(content)) add('fake-binary', file, 1, `This ${ext} file is actually text/code. Malware disguises payloads as fonts/images and runs them with node.`);
    return;
  }
  if (isBinary(content)) return;

  const text = content.toString('utf8');
  if (ext === '.svg') return scanSvg(file, text);
  if (file.split('/').includes('.vscode')) scanVscode(file, text);
  if (base === 'package.json') scanPackageJson(file, text);
  if (LOCKFILES.has(base)) return scanLockfile(file, text);
  if (SKIP_CONTENT.test(file)) return;
  if (CODE_EXTENSIONS.has(ext) || ext === '') scanCode(file, text);
}

function scanCode(file, text) {
  text.split(/\r?\n/).forEach((line, index) => {
    if (HIDDEN_AFTER_WHITESPACE.test(line) || LEADING_WHITESPACE_PADDING.test(line)) {
      add('hidden-code', file, index + 1, 'Code pushed far to the right behind a run of spaces, a trick to hide a payload from editors and diffs.');
    } else if (line.length > MAX_LINE_LENGTH) {
      add('long-line', file, index + 1, `Line is ${line.length} characters long; minified/obfuscated code does not belong in source files.`);
    }
  });
  for (const [pattern, message] of DYNAMIC_CODE_PATTERNS) addMatches('dynamic-code', file, text, pattern, message);
  addMatches('process-spawn', file, text, CHILD_PROCESS_IMPORT, 'Imports child_process, which can run arbitrary system commands.');
  for (const [pattern, message] of IOC_PATTERNS) addMatches('known-ioc', file, text, pattern, message);

  for (const match of text.matchAll(BASE64_LITERAL)) {
    const value = match[1] ?? match[2];
    const decoded = Buffer.from(value, /[-_]/.test(value) ? 'base64url' : 'base64').toString('utf8');
    if (/https?:\/\//i.test(decoded)) {
      add('encoded-url', file, lineOf(text, match.index), `Base64 string decodes to a URL (${decoded.slice(0, 80)}), a classic way to hide a payload download.`);
    }
  }

  const obfuscated = text.match(OBFUSCATED_IDENTIFIER);
  if (obfuscated && obfuscated.length >= 10) {
    add('obfuscated-code', file, lineOf(text, text.search(OBFUSCATED_IDENTIFIER)), `${obfuscated.length} obfuscator-style identifiers (_0x...) found.`);
  }
}

function scanSvg(file, text) {
  const match = SVG_ACTIVE_CONTENT.exec(text);
  if (match) add('svg-script', file, lineOf(text, match.index), 'SVG contains script or event handlers and can run code when opened in a browser.');
}

function scanVscode(file, text) {
  for (const [pattern, message] of VSCODE_AUTORUN_PATTERNS) addMatches('editor-autorun', file, text, pattern, message);
}

function scanPackageJson(file, text) {
  let scripts;
  try {
    scripts = JSON.parse(text).scripts ?? {};
  } catch {
    add('package-json', file, 1, 'package.json is not valid JSON.');
    return;
  }
  const allowed = config.allowedScripts[file] ?? {};
  for (const [name, command] of Object.entries(scripts)) {
    if (allowed[name] === command) continue;
    const line = lineOf(text, text.indexOf(JSON.stringify(name)));
    if (LIFECYCLE_SCRIPT.test(name)) {
      add('lifecycle-script', file, line, `"${name}" runs automatically around npm install/run and is not in allowedScripts: ${command}`);
    } else if (RISKY_SCRIPT_COMMAND.test(command)) {
      add('risky-script', file, line, `"${name}" downloads or evaluates code: ${command}`);
    }
  }
}

function scanLockfile(file, text) {
  for (const match of text.matchAll(/"resolved"\s*:\s*"([^"]+)"/g)) {
    if (!config.allowedRegistries.some((registry) => match[1].startsWith(registry))) {
      add('untrusted-registry', file, lineOf(text, match.index), `Dependency resolved from outside the allowed registries: ${match[1]}`);
    }
  }
}

function checkGitignore(files) {
  const gitignore = files.find((file) => file.path === '.gitignore');
  const patterns = (gitignore ? gitignore.content.toString('utf8') : '')
    .split(/\r?\n/)
    .map((raw, index) => ({ raw: raw.trim(), line: index + 1 }))
    .filter((entry) => entry.raw && !entry.raw.startsWith('#'));

  for (const required of config.requiredGitignore) {
    if (!isIgnored(required, patterns)) {
      add('gitignore-env', '.gitignore', 1, `${required} is not ignored, so secrets get committed on the next "git add .".`);
    }
  }
  for (const entry of patterns) {
    if (MALWARE_IGNORE_ENTRIES.has(entry.raw.replace(/^\//, ''))) {
      add('gitignore-tampering', '.gitignore', entry.line, `Ignoring "${entry.raw}" hides files dropped by the malware (or hides .gitignore edits).`);
    }
  }
}

function isIgnored(file, patterns) {
  let ignored = false;
  for (const { raw } of patterns) {
    const negated = raw.startsWith('!');
    const pattern = negated ? raw.slice(1) : raw;
    if (pattern.endsWith('/')) continue;
    const anchored = pattern.includes('/');
    const regex = new RegExp(`^${globToRegex(pattern.replace(/^\//, ''))}$`);
    if (regex.test(anchored ? file : path.posix.basename(file))) ignored = !negated;
  }
  return ignored;
}

function globToRegex(glob) {
  return glob
    .split('**/')
    .map((part) => part.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]'))
    .join('(?:.*/)?');
}

function checkMergeCommits(range) {
  let merges;
  try {
    merges = git(['rev-list', '--merges', range]).toString('utf8').split('\n').filter(Boolean);
  } catch (err) {
    add('scan-error', '.', 1, `Could not list commits in ${range}: ${String(err.stderr ?? err.message).trim()}`);
    return;
  }
  for (const sha of merges) {
    if (config.allowedMergeCommits.includes(sha)) continue;
    const changed = git(['diff-tree', '--cc', '--name-only', '-r', '--no-commit-id', sha])
      .toString('utf8')
      .split('\n')
      .filter((line) => line && line !== sha);
    if (changed.length) {
      add('injected-merge', changed[0], 1, `Merge commit ${sha} contains changes that exist in neither parent (${changed.join(', ')}). This is how malware was slipped into main before. Only add the SHA to allowedMergeCommits after reviewing it.`);
    }
  }
}

function addMatches(rule, file, text, pattern, message) {
  for (const match of text.matchAll(pattern)) add(rule, file, lineOf(text, match.index), message);
}

function add(rule, file, line, message) {
  const id = `${rule}|${file}|${line}`;
  if (seen.has(id)) return;
  seen.add(id);
  if (config.allow.some((entry) => entry.rule === rule && entry.file === file)) {
    allowlistedFindings++;
    return;
  }
  const key = `${rule}|${file}`;
  const shown = shownPerFileRule.get(key) ?? 0;
  shownPerFileRule.set(key, shown + 1);
  if (shown >= MAX_FINDINGS_PER_FILE_RULE) {
    hiddenFindings++;
    return;
  }
  findings.push({ rule, file, line, message });
}

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

function isBinary(content) {
  return content.subarray(0, 8000).includes(0);
}

function looksLikeText(content) {
  const sample = content.subarray(0, 4096);
  if (sample.length === 0) return false;
  let printable = 0;
  for (const byte of sample) if (byte === 9 || byte === 10 || byte === 13 || (byte >= 32 && byte < 127)) printable++;
  return printable / sample.length > 0.9;
}

function report(fileCount) {
  const inGithubActions = process.env.GITHUB_ACTIONS === 'true';
  for (const finding of findings) {
    console.log(`BLOCK [${finding.rule}] ${finding.file}:${finding.line}  ${finding.message}`);
    if (inGithubActions) {
      const message = finding.message.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
      console.log(`::error file=${finding.file},line=${finding.line},title=security-scan/${finding.rule}::${message}`);
    }
  }
  const blocking = findings.length + hiddenFindings;
  if (hiddenFindings) console.log(`...and ${hiddenFindings} more finding(s) not shown.`);
  console.log(`\nsecurity-scan: ${fileCount} files scanned, ${blocking} blocking finding(s), ${allowlistedFindings} allowlisted.`);
  if (blocking > 0) {
    console.log('Blocked. Remove the flagged code, or, only after a real review, allowlist it in security-scan.config.json.');
    process.exit(1);
  }
}

main();
