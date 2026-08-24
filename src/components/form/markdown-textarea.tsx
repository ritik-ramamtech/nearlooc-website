"use client";

import { useRef } from "react";
import { Bold, Italic, Heading2, List } from "lucide-react";

interface MarkdownTextareaProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export function MarkdownTextarea({
  value,
  onChange,
  rows = 3,
  placeholder,
  className = "",
}: MarkdownTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (before: string, after: string = before) => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = value.slice(start, end);
    const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(newValue);

    const cursorStart = start + before.length;
    const cursorEnd = cursorStart + selected.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const applyLinePrefix = (prefix: string) => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const lineEndSearchFrom = Math.max(end - 1, lineStart);
    let lineEnd = value.indexOf("\n", lineEndSearchFrom);
    if (lineEnd === -1) lineEnd = value.length;

    const block = value.slice(lineStart, lineEnd);
    const newBlock = block
      .split("\n")
      .map((line) => (line.length ? `${prefix}${line}` : line))
      .join("\n");
    const newValue = value.slice(0, lineStart) + newBlock + value.slice(lineEnd);
    onChange(newValue);

    const delta = newBlock.length - block.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + delta);
    });
  };

  const buttonCls =
    "flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900";

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500/30">
      <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-1.5 py-1">
        <button
          type="button"
          onClick={() => wrapSelection("**")}
          className={buttonCls}
          title="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("*")}
          className={buttonCls}
          title="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => applyLinePrefix("## ")}
          className={buttonCls}
          title="Heading"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => applyLinePrefix("- ")}
          className={buttonCls}
          title="Bullet list"
        >
          <List className="h-3.5 w-3.5" />
        </button>
      </div>
      <textarea
        ref={ref}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full resize-none border-0 px-3 py-2 text-sm focus:outline-none focus:ring-0 ${className}`}
      />
    </div>
  );
}
