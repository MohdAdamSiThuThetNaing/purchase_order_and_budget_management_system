import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogoutButton } from "../components/LogoutButton";
import NotificationBell from "../components/NotificationBell";

import "../layouts/DashboardPage.css";

export function DashboardPage() {
  const { user } = useAuth();

  const cards = [
    { title: "Organizations", path: "/organizations", icon: "🏢" },
    { title: "Projects", path: "/projects", icon: "📁" },
    { title: "Budgets", path: "/budgets", icon: "💰" },

    { title: "Budget Categories", path: "/budget-categories", icon: "📂" },
    { title: "Budget Lines", path: "/budget-lines", icon: "📊" },

    { title: "Purchase Orders", path: "/purchase-orders", icon: "🛒" },
    { title: "Approval Queue", path: "/approval-queue", icon: "✅" },

    { title: "Budget Report", path: "/budget-report", icon: "📈" },
    { title: "Notifications", path: "/notifications", icon: "🔔" },

    { title: "Users", path: "/users", icon: "👥" },
  ];

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1 className="title">Purchase Order Management System</h1>

          <p className="subtitle">
            Welcome back, <strong>{user?.firstName}</strong>
          </p>

          <p className="organization">
            <strong>Organization:</strong>{" "}
            {user?.organizationName ?? "Not Assigned"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <NotificationBell />
          <LogoutButton />
        </div>
      </header>

      <div className="cards">
        {cards.map((card) => (
          <Link key={card.path} to={card.path} className="card">
            <div className="cardIcon">{card.icon}</div>
            <h3>{card.title}</h3>
          </Link>
        ))}
      </div>

      <div className="content">
        <section className="panel">
          <h2>Quick Information</h2>

          <p>
            <b>Name:</b> {user?.firstName} {user?.lastName}
          </p>
          <p>
            <b>Email:</b> {user?.email}
          </p>
          <p>
            <b>Organization:</b> {user?.organizationName}
          </p>
          <p>
            <b>Roles:</b> {user?.roles?.join(", ")}
          </p>
        </section>
      </div>
    </div>
  );
}
