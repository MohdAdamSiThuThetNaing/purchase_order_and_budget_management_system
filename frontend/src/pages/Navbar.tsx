import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { LogoutButton } from "../components/LogoutButton";

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
} from "../api/notificationApi";
import { useTheme } from "../contexts/ThemeContext";
import "../layouts/Navbar.css";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const Navbar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const [highlightBell, setHighlightBell] = useState(false);
  const [popupNotification, setPopupNotification] =
    useState<Notification | null>(null);

  const popupTimer = useRef<number | null>(null);

  const [latestNotificationId, setLatestNotificationId] = useState<
    string | null
  >(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const showPopup = (notification: Notification) => {
    setPopupNotification(notification);

    if (popupTimer.current) {
      clearTimeout(popupTimer.current);
    }

    popupTimer.current = window.setTimeout(() => {
      setPopupNotification(null);
    }, 5000);
  };

  const loadNotifications = async () => {
    try {
      const [list, unread] = await Promise.all([
        getNotifications(0, 5),
        getUnreadNotificationCount(),
      ]);

      const latest = list.content?.[0];

      if (latestNotificationId === null) {
        setLatestNotificationId(latest?.id ?? null);
      } else if (latest && latest.id !== latestNotificationId) {
        setLatestNotificationId(latest.id);

        setHighlightBell(true);

        showPopup(latest);

        window.setTimeout(() => {
          setHighlightBell(false);
        }, 4000);
      }

      setNotifications(list.content ?? []);
      setUnreadCount(unread);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      await loadNotifications();
    };

    fetchNotifications();

    const timer = setInterval(fetchNotifications, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = async (id: string) => {
    await markNotificationAsRead(id);

    loadNotifications();
  };

  useEffect(() => {
    return () => {
      if (popupTimer.current) {
        clearTimeout(popupTimer.current);
      }
    };
  }, []);

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        Purchase Order System
      </Link>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <div className="notification-wrapper" ref={dropdownRef}>
          <button
            className={`notification-button ${
              highlightBell ? "notification-highlight" : ""
            }`}
            onClick={() => setOpen(!open)}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </button>

          {open && (
            <div className="notification-dropdown">
              <div className="notification-title">Notifications</div>

              {notifications.length === 0 ? (
                <div className="notification-empty">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      notification.isRead ? "" : "unread"
                    } ${
                      notification.id === latestNotificationId
                        ? "notification-new"
                        : ""
                    }`}
                  >
                    <div className="notification-header">
                      <strong>{notification.title}</strong>

                      {!notification.isRead && (
                        <button onClick={() => markRead(notification.id)}>
                          ✓
                        </button>
                      )}
                    </div>

                    <div className="notification-message">
                      {notification.message}
                    </div>

                    <small>
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))
              )}

              <Link
                className="view-all"
                to="/notifications"
                onClick={() => setOpen(false)}
              >
                View All Notifications →
              </Link>
            </div>
          )}
        </div>

        <div className="navbar-user">
          <span>
            {user?.firstName} {user?.lastName}
          </span>

          <LogoutButton />
        </div>
      </div>
      {popupNotification && (
        <div className="notification-popup">
          <button
            className="notification-popup-close"
            onClick={() => setPopupNotification(null)}
          >
            ✕
          </button>

          <div className="notification-popup-content">
            <div className="notification-popup-header">
              <div className="notification-popup-icon">🔔</div>

              <div>
                <h4>{popupNotification.title}</h4>
                <span className="notification-popup-new">New Notification</span>
              </div>
            </div>

            <p>{popupNotification.message}</p>

            <small>
              {new Date(popupNotification.createdAt).toLocaleString()}
            </small>

            <Link
              to="/notifications"
              onClick={() => setPopupNotification(null)}
            >
              View Notifications →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
