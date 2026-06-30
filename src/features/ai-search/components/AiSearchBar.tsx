"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";

export function AiSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl px-4 py-3">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm ring-1 ring-transparent transition-all focus-within:border-emerald-400 focus-within:ring-emerald-100">
        <Sparkles className="h-4 w-4 shrink-0 text-emerald-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try "pizza under $10" or "spa deals near me"'
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white transition-colors hover:bg-emerald-600 disabled:opacity-40"
          aria-label="Search"
        >
          <Search className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  );
}
