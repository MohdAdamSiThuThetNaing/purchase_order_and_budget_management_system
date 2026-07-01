import { apiClient } from "./apiClient";

export type NotificationType =
  | "PO_SUBMITTED"
  | "PO_APPROVED"
  | "PO_REJECTED"
  | "BUDGET_EXCEEDED";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export const getNotifications = async (
  page = 0,
  size = 10
): Promise<PageResponse<Notification>> => {
  const { data } = await apiClient.get<PageResponse<Notification>>(
    `/notifications?page=${page}&size=${size}`
  );

  return data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await apiClient.patch(`/notifications/${id}/read`);
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const { data } = await apiClient.get<number>("/notifications/unread-count");

  return data;
};
