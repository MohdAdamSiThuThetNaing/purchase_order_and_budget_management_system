import { useEffect, useState } from "react";
import axios from "axios";

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
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const response = await axios.get<PageResponse<Notification>>(
        `/notifications?page=${page}&size=10`
      );

      setNotifications(response.data.content);
      setTotalPages(response.data.totalPages);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        const response = await axios.get<PageResponse<Notification>>(
          `/notifications?page=${page}&size=10`
        );

        setNotifications(response.data.content);
        setTotalPages(response.data.totalPages);
        setError("");
      } catch (error) {
        console.error(error);
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

  const icon = (type: NotificationType) => {
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
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={loadNotifications}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2>Notification Center</h2>

      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
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
                    backgroundColor: notification.isRead
                      ? "#ffffff"
                      : "#eef6ff",
                    fontWeight: notification.isRead ? "normal" : "bold",
                  }}
                >
                  <td>{icon(notification.type)}</td>

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

          <div style={{ marginTop: "20px" }}>
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>

            <span style={{ margin: "0 15px" }}>
              Page {page + 1} of {totalPages}
            </span>

            <button
              disabled={page + 1 >= totalPages}
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
