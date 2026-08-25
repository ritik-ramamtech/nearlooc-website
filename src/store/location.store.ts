import { PreferredLocation } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationState {
  location: PreferredLocation | null;
  setLocation: (location: PreferredLocation | null) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: null,

      setLocation: (location) => set({ location }),

      clearLocation: () => set({ location: null }),
    }),
    { name: "nearlooc-location" },
  ),
);
