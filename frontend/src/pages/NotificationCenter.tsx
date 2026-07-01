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
      <div className="notification-header">
        <div>
          <h1>Notification Center</h1>
          <p>Stay updated with purchase order activities.</p>
        </div>
      </div>

      {loading && (
        <div className="notification-loading">Loading notifications...</div>
      )}

      {!loading && error && (
        <>
          <div className="notification-error">{error}</div>

          <button className="notification-button" onClick={loadNotifications}>
            Retry
          </button>
        </>
      )}

      {!loading && !error && (
        <>
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <h3>No Notifications</h3>
              <p>You don't have any notifications yet.</p>
            </div>
          ) : (
            <>
              <div className="notification-card">
                <table>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Title</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {notifications.map((notification) => (
                      <tr
                        key={notification.id}
                        className={
                          notification.isRead
                            ? "notification-read"
                            : "notification-unread"
                        }
                      >
                        <td className="notification-status">
                          {getIcon(notification.type)}
                        </td>

                        <td className="notification-title">
                          {notification.title}
                        </td>

                        <td className="notification-message">
                          {notification.message}
                        </td>

                        <td className="notification-date">
                          {new Date(notification.createdAt).toLocaleString()}
                        </td>

                        <td>
                          {!notification.isRead ? (
                            <button
                              className="notification-button"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark Read
                            </button>
                          ) : (
                            <span className="notification-badge read">
                              Read
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="notification-pagination">
                <button
                  className="notification-button"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>

                <span>
                  Page {page + 1} of {totalPages}
                </span>

                <button
                  className="notification-button"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
