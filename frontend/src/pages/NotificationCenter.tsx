import { useEffect, useState } from "react";
import "../layouts/NotificationCenter.css";

import {
  getNotifications,
  markNotificationAsRead,
} from "../api/notificationApi";

type NotificationType =
  | "PO_SUBMITTED"
  | "PO_APPROVED"
  | "PO_REJECTED"
  | "BUDGET_EXCEEDED";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getNotifications(page, 10);

      setNotifications(data.content ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      console.error(err);
      setNotifications([]);
      setTotalPages(1);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotifications(page, 10);

        setNotifications(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "PO_SUBMITTED":
        return "📨";
      case "PO_APPROVED":
        return "✅";
      case "PO_REJECTED":
        return "❌";
      case "BUDGET_EXCEEDED":
        return "⚠️";
      default:
        return "🔔";
    }
  };

  if (loading) {
    return <div className="notification-page">Loading notifications...</div>;
  }

  if (error) {
    return (
      <div className="notification-page">
        <p>{error}</p>

        <button onClick={loadNotifications}>Retry</button>
      </div>
    );
  }

  return (
    <div className="notification-page">
      <h2>Notification Center</h2>

      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <>
          <table className="notification-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Message</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {notifications.map((notification) => (
                <tr
                  key={notification.id}
                  className={notification.isRead ? "" : "unread"}
                >
                  <td>{getIcon(notification.type)}</td>

                  <td>{notification.title}</td>

                  <td>{notification.message}</td>

                  <td>{new Date(notification.createdAt).toLocaleString()}</td>

                  <td>
                    {!notification.isRead && (
                      <button onClick={() => markAsRead(notification.id)}>
                        Mark Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="notification-pagination">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>

            <span>
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
