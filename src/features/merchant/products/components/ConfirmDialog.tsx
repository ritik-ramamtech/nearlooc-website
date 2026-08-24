// components/common/ConfirmDialog.tsx

"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Loader2, TriangleAlert } from "lucide-react";
import { ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: string;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;

  onConfirm: () => void;

  children?: ReactNode;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        {/* Overlay */}
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0" />

        {/* Content */}
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 fade-in-0">
          {/* Header */}
          <div className="border-b border-gray-100 px-8 pt-4 pb-2">
            {/* <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            </div> */}

            <AlertDialog.Title className="text-center text-lg flex justify-center items-center gap-3 font-bold text-gray-900">
              <div className=" h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
                <TriangleAlert className="h-5 w-5 text-red-500" />
              </div>
              {title}
            </AlertDialog.Title>

            <AlertDialog.Description className="mt-1 text-center text-sm leading-6 text-gray-500">
              {description}
            </AlertDialog.Description>
          </div>

          {/* Extra content */}
          {children && (
            <div className="border-b border-gray-100 bg-amber-50/60 px-6 py-2">
              {children}
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 px-10 py-4">
            <AlertDialog.Cancel asChild>
              <button
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-200 px-4 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelText}
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  onConfirm();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}

                {loading ? "Please wait..." : confirmText}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
