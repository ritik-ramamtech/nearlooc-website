"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  showBack?: boolean;
  className?: string;
  action?: React.ReactNode;
}

export function TopBar({ title, showBack = true, className, action }: TopBarProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "fixed top-0 z-40 w-full border-b border-outline-variant bg-surface-container-lowest",
        className
      )}
    >
      <div className="flex h-14 items-center gap-3 px-4">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="flex-1 text-headline-sm font-semibold text-on-surface">{title}</h1>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
}
