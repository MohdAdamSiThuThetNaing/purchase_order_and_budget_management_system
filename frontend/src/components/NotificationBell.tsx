import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationBell = () => {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get<number>("/notifications/unread-count");

      return response.data;
    } catch (error) {
      console.error("Failed to load notification count.", error);
      return 0;
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const count = await fetchUnreadCount();

      if (mounted) {
        setUnreadCount(count);
      }
    };

    load();

    const interval = setInterval(load, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <button
      onClick={() => navigate("/notifications")}
      style={{
        position: "relative",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "24px",
      }}
    >
      🔔
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-6px",
            right: "-6px",
            minWidth: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: "red",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2px",
          }}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
