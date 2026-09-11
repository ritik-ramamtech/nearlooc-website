#!/usr/bin/env node
// Safe replacement for `git pull`: fetches, scans the incoming commits with the local (already
// trusted) scanner straight from git objects, and only updates the branch when the scan is clean.
// Nothing from upstream reaches the working tree, or gets a chance to run, before it is scanned.
//
// Usage: node scripts/safe-pull.mjs [--merge]   (--merge allows a merge commit if branches diverged)

import { execFileSync, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = process.cwd();
const scanner = path.join(path.dirname(fileURLToPath(import.meta.url)), 'security-scan.mjs');
const allowMerge = process.argv.includes('--merge');

const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
const gitSucceeds = (...args) => spawnSync('git', ['-C', repo, ...args], { stdio: 'ignore' }).status === 0;

function fail(message) {
  console.error(message);
  process.exit(1);
}

const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
if (branch === 'HEAD') fail('Detached HEAD: check out a branch first.');

const upstream = gitSucceeds('rev-parse', '--abbrev-ref', '@{u}') ? git('rev-parse', '--abbrev-ref', '@{u}') : `origin/${branch}`;
const remote = upstream.split('/')[0];

console.log(`Fetching ${remote}...`);
git('fetch', '--prune', remote);
if (!gitSucceeds('rev-parse', '--verify', '--quiet', `${upstream}^{commit}`)) fail(`${upstream} does not exist on the remote.`);

const head = git('rev-parse', 'HEAD');
const incoming = git('rev-parse', upstream);
if (gitSucceeds('merge-base', '--is-ancestor', incoming, head)) {
  console.log('Already up to date.');
  process.exit(0);
}

const base = git('merge-base', head, incoming);
console.log(`Scanning ${upstream} (${git('rev-list', '--count', `${base}..${incoming}`)} new commit(s)) before touching the working tree...`);
const scan = spawnSync(
  process.execPath,
  [scanner, '--repo', repo, '--ref', incoming, '--range', `${base}..${incoming}`, '--config', path.join(repo, 'security-scan.config.json')],
  { stdio: 'inherit' },
);
if (scan.status !== 0) {
  fail(`\nPull BLOCKED: ${upstream} failed the security scan. Nothing was merged. Do not check out, open or run that branch; report it.`);
}

if (gitSucceeds('merge-base', '--is-ancestor', head, incoming)) {
  execFileSync('git', ['-C', repo, 'merge', '--ff-only', incoming], { stdio: 'inherit' });
} else if (allowMerge) {
  execFileSync('git', ['-C', repo, 'merge', '--no-edit', incoming], { stdio: 'inherit' });
} else {
  fail(`${branch} and ${upstream} have diverged. The incoming code scanned clean; re-run with --merge or rebase manually.`);
}
console.log(`Up to date with ${upstream}.`);
