import apiClient from "@/lib/api-client";
import type { ApiResponse, Notification } from "@/types";

export interface NotificationsListResponse {
  items: Notification[];
  meta: { page: number; limit: number; total: number; has_more: boolean };
}

export async function getNotifications(page = 1, limit = 20): Promise<ApiResponse<NotificationsListResponse>> {
  const res = await apiClient.get<ApiResponse<NotificationsListResponse>>("/notifications", {
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
