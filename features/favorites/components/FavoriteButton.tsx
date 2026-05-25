"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToggleFavorite } from "../hooks";

interface FavoriteButtonProps {
  offerId: string;
  isFavorite: boolean;
  className?: string;
}

export function FavoriteButton({ offerId, isFavorite, className }: FavoriteButtonProps) {
  const { toggle, isPending } = useToggleFavorite();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(offerId, isFavorite);
      }}
      disabled={isPending}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
        isFavorite
          ? "bg-red-50 text-red-500"
          : "bg-surface-container text-on-surface-variant hover:text-red-500",
        className
      )}
    >
      <Heart className={cn("h-4 w-4", isFavorite && "fill-red-500")} />
    </button>
  );
}
