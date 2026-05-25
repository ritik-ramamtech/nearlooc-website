"use client";

import { cn } from "@/lib/utils";
import { useMarkAsRead } from "../hooks";
import type { Notification } from "@/types";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { mutate: markRead } = useMarkAsRead();

  return (
    <button
      onClick={() => { if (!notification.is_read) markRead(notification.id); }}
      className={cn(
        "w-full text-left rounded-xl border px-4 py-3 transition-colors",
        notification.is_read
          ? "border-outline-variant bg-surface-container-lowest"
          : "border-stitch-primary/20 bg-stitch-primary/5"
      )}
    >
      <div className="flex items-start gap-3">
        {!notification.is_read && (
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-stitch-primary" />
        )}
        <div className={cn("flex-1", notification.is_read && "pl-5")}>
          <p className="text-body-sm font-semibold text-on-surface">{notification.title}</p>
          {notification.body && (
            <p className="mt-0.5 text-label-sm text-on-surface-variant leading-relaxed">
              {notification.body}
            </p>
          )}
          <p className="mt-1 text-label-sm text-on-surface-variant">
            {new Date(notification.created_at).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </button>
  );
}
