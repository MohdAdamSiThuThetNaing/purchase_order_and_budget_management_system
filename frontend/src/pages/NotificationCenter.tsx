import { useEffect, useState } from "react";
import axios from "axios";
import "../layouts/NotificationCenter.css";

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

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
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

      const { data } = await axios.get<
        PageResponse<Notification> | Notification[]
      >(`/notifications?page=${page}&size=10`);

      console.log("Notification Response:", data);

      // Backend returns Spring Page<>
      if (!Array.isArray(data) && "content" in data) {
        setNotifications(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
      }
      // Backend returns plain array
      else if (Array.isArray(data)) {
        setNotifications(data);
        setTotalPages(1);
      } else {
        setNotifications([]);
        setTotalPages(1);
      }
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
    const fetchNotifications = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get<PageResponse<Notification>>(
          `/notifications?page=${page}&size=10`
        );

        setNotifications(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
        setError("");
      } catch (err) {
        console.error(err);
        setNotifications([]);
        setError("Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page]);

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
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
    return <div style={{ padding: 24 }}>Loading notifications...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <p>{error}</p>

        <button onClick={loadNotifications}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Notification Center</h2>

      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 20,
            }}
          >
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
                  style={{
                    backgroundColor: notification.isRead ? "#fff" : "#eef6ff",
                    fontWeight: notification.isRead ? "normal" : "bold",
                  }}
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

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
              marginTop: 20,
            }}
          >
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
