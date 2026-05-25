"use client";

import { TopBar } from "@/components/layout/TopBar";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import { useNotifications, useMarkAllAsRead } from "@/features/notifications/hooks";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const { data, isPending, isError } = useNotifications();
  const { mutate: markAll, isPending: marking } = useMarkAllAsRead();

  const hasUnread = data?.items.some((n) => !n.is_read);

  return (
    <>
      <TopBar
        title="Notifications"
        showBack={false}
        action={
          hasUnread ? (
            <Button variant="ghost" size="sm" onClick={() => markAll()} disabled={marking}>
              Mark all read
            </Button>
          ) : undefined
        }
      />
      <div className="pt-14 px-4 py-4 space-y-3">
        {isPending && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl border border-outline-variant bg-surface-container" />
            ))}
          </div>
        )}

        {isError && (
          <p className="py-10 text-center text-body-sm text-on-surface-variant">
            Failed to load notifications.
          </p>
        )}

        {data && data.items.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-headline-sm font-semibold text-on-surface">All caught up!</p>
            <p className="mt-1 text-body-sm text-on-surface-variant">No notifications yet.</p>
          </div>
        )}

        {data?.items.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </div>
    </>
  );
}
