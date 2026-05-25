"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, addFavorite, removeFavorite } from "./api";

export function useFavorites(page = 1) {
  return useQuery({
    queryKey: ["favorites", "list", page],
    queryFn: () => getFavorites(page),
    select: (res) => res.data,
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();

  const add = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const remove = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const toggle = (offerId: string, isFavorite: boolean) => {
    if (isFavorite) remove.mutate(offerId);
    else add.mutate(offerId);
  };

  return { toggle, isPending: add.isPending || remove.isPending };
}
