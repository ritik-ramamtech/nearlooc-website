import apiClient from "@/lib/api-client";
import type { ApiResponse, Notification, PaginationMeta } from "@/types";

export interface NotificationsResponse extends ApiResponse<Notification[]> {
  meta: PaginationMeta;
}

export async function getNotifications(page = 1, limit = 20): Promise<NotificationsResponse> {
  const res = await apiClient.get<NotificationsResponse>("/notifications", {
    params: { page, limit },
  });

  return res.data;
}

export async function getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
  const res = await apiClient.get<ApiResponse<{ count: number }>>("/notifications/unread-count");
  return res.data;
}

export async function markAsRead(id: string): Promise<void> {
  await apiClient.put(`/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await apiClient.put("/notifications/read-all");
}
