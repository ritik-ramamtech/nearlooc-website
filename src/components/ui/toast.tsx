"use client";

import * as RToast from "@radix-ui/react-toast";
import { create } from "zustand";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastStore {
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id">) => void;
  dismiss: (id: number) => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (t) =>
    set((s) => ({ toasts: [...s.toasts, { ...t, id: Date.now() + Math.random() }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

/** Fire a toast from anywhere — components, handlers, async callbacks. */
export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, variant: "success" }),
  error: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, variant: "error" }),
  info: (title: string, description?: string) =>
    useToastStore.getState().push({ title, description, variant: "info" }),
};

const VARIANTS: Record<ToastVariant, { Icon: typeof CheckCircle; iconCls: string; ring: string }> = {
  success: { Icon: CheckCircle, iconCls: "text-green-600", ring: "ring-green-100" },
  error: { Icon: AlertCircle, iconCls: "text-red-500", ring: "ring-red-100" },
  info: { Icon: Info, iconCls: "text-blue-500", ring: "ring-blue-100" },
};

/** Mount once near the app root. Renders all active toasts. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <RToast.Provider swipeDirection="right" duration={4000}>
      {toasts.map((t) => {
        const { Icon, iconCls, ring } = VARIANTS[t.variant];
        return (
          <RToast.Root
            key={t.id}
            onOpenChange={(open) => {
              if (!open) dismiss(t.id);
            }}
            className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-lg ring-1 ring-black/5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full data-[swipe=end]:animate-out data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform"
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50 ring-4 ${ring}`}>
              <Icon className={`h-4 w-4 ${iconCls}`} />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <RToast.Title className="text-sm font-semibold text-gray-900">{t.title}</RToast.Title>
              {t.description && (
                <RToast.Description className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                  {t.description}
                </RToast.Description>
              )}
            </div>
            <RToast.Close
              aria-label="Dismiss"
              className="shrink-0 rounded-md p-1 text-gray-300 transition-colors hover:bg-gray-50 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </RToast.Close>
          </RToast.Root>
        );
      })}
      <RToast.Viewport className="fixed bottom-0 right-0 z-[100] m-4 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none" />
    </RToast.Provider>
  );
}
