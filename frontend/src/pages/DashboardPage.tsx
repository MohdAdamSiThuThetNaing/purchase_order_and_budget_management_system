import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogoutButton } from "../components/LogoutButton";
import NotificationBell from "../components/NotificationBell";

import "../layouts/DashboardPage.css";

export function DashboardPage() {
  const { user } = useAuth();

  const modules = [
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
      <header className="dashboard-header">
        <div>
          <h1>Purchase Order Management System</h1>

          <p className="subtitle">
            Welcome back,
            <strong> {user?.firstName}</strong>
          </p>

          <span className="organization-badge">
            {user?.organizationName ?? "No Organization"}
          </span>
        </div>

        <div className="dashboard-actions">
          <NotificationBell />
          <LogoutButton />
        </div>
      </header>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-header">
            <h2>Modules</h2>
            <span>{modules.length}</span>
          </div>

          <div className="module-grid">
            {modules.map((module) => (
              <Link key={module.path} to={module.path} className="module-card">
                <span className="module-icon">{module.icon}</span>

                <div>
                  <h3>{module.title}</h3>

                  <p>Open module</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <aside className="dashboard-card profile-card">
          <div className="card-header">
            <h2>User Information</h2>
          </div>

          <div className="profile-row">
            <span>Name</span>
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>

          <div className="profile-row">
            <span>Organization</span>
            <strong>{user?.organizationName}</strong>
          </div>

          <div className="profile-row">
            <span>Roles</span>
            <strong>{user?.roles?.join(", ")}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
