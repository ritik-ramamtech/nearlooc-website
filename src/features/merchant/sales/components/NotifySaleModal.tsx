"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, X, Bell } from "lucide-react";
import { useState } from "react";
import { useNotifyOffer } from "../hooks";
import { toast } from "@/components/ui/toast";

interface NotifySaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offerId: string;
  offerTitle: string;
}

export function NotifySaleModal({
  open,
  onOpenChange,
  offerId,
  offerTitle,
}: NotifySaleModalProps) {
  const [message, setMessage] = useState("");
  const notify = useNotifyOffer();

  const handleClose = (next: boolean) => {
    if (!next) setMessage("");
    onOpenChange(next);
  };

  const handleSend = () => {
    notify.mutate(
      { id: offerId, custom_message: message.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(
            "Notification sent",
            `Customers have been notified about "${offerTitle}".`
          );
          handleClose(false);
        },
        onError: () => {
          toast.error("Failed to send notification", "Please try again.");
        },
      }
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />

        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 z-50
            w-[420px] max-w-[calc(100vw-2rem)]
            -translate-x-1/2 -translate-y-1/2
            overflow-hidden rounded-2xl bg-white shadow-2xl
            focus:outline-none
          "
        >
          <div className="relative border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50">
                <Bell className="h-4 w-4 text-brand-500" />
              </div>
              <Dialog.Title className="font-semibold text-gray-900">
                Notify Customers
              </Dialog.Title>
            </div>
            <Dialog.Description className="mt-1 line-clamp-1 text-xs text-gray-500">
              Send a push notification about &ldquo;{offerTitle}&rdquo; to interested customers.
            </Dialog.Description>

            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="absolute right-5 top-5 rounded-md p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="px-6 py-4">
            <label className="text-xs font-semibold text-gray-600">
              Custom message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Flat 30% off ends tonight — don't miss out!"
              rows={4}
              maxLength={200}
              className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <p className="mt-1 text-right text-[10px] text-gray-400">
              {message.length}/200
            </p>
          </div>

          <div className="flex gap-3 border-t bg-gray-50 px-6 py-4">
            <Dialog.Close asChild>
              <button
                disabled={notify.isPending}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSend}
              disabled={notify.isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {notify.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {notify.isPending ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
