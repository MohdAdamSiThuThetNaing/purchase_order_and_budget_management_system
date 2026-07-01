import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogoutButton } from "../components/LogoutButton";
import NotificationBell from "../components/NotificationBell";

import "../layouts/DashboardPage.css";

export function DashboardPage() {
  const { user } = useAuth();

  const modules = [
    {
      title: "Organizations",
      path: "/organizations",
      icon: "🏢",
      description: "Manage org settings",
    },
    { title: "Projects", path: "/projects", icon: "📁", description: "Projects" },
    { title: "Budgets", path: "/budgets", icon: "💰", description: "Budgets" },
    {
      title: "Budget Categories",
      path: "/budget-categories",
      icon: "📂",
      description: "Category setup",
    },
    {
      title: "Budget Lines",
      path: "/budget-lines",
      icon: "📊",
      description: "Track allocations",
    },
    {
      title: "Purchase Orders",
      path: "/purchase-orders",
      icon: "🛒",
      description: "Create and submit POs",
    },
    {
      title: "Approval Queue",
      path: "/approval-queue",
      icon: "✅",
      description: "Approve or reject",
    },
    {
      title: "Budget Report",
      path: "/budget-report",
      icon: "📈",
      description: "Financial overview",
    },
    {
      title: "Notifications",
      path: "/notifications",
      icon: "🔔",
      description: "Your updates",
    },
    { title: "Users", path: "/users", icon: "👥", description: "Access control" },
  ];

  const quickActions = [
    modules.find((m) => m.path === "/purchase-orders"),
    modules.find((m) => m.path === "/approval-queue"),
    modules.find((m) => m.path === "/budgets"),
    modules.find((m) => m.path === "/budget-lines"),
  ].filter(Boolean) as Array<(typeof modules)[number]>;

  const firstName = user?.firstName?.trim() || "there";
  const organizationName = user?.organizationName ?? "No Organization";
  const rolesCount = user?.roles?.length ?? 0;

  return (
    <div className="dashboard">
      <header className="dashboard-hero">
        <div className="dashboard-hero-surface">
          <div className="dashboard-hero-top">
            <div className="dashboard-hero-copy">
              <div className="dashboard-title-row">
                <h1>Dashboard</h1>
                <span className="organization-badge">{organizationName}</span>
              </div>

              <p className="subtitle">
                Welcome back, <strong>{firstName}</strong>. Pick a module to get
                started.
              </p>

              <div className="dashboard-stats">
                <div className="stat-card">
                  <span className="stat-label">Modules</span>
                  <span className="stat-value">{modules.length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Your Roles</span>
                  <span className="stat-value">{rolesCount}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Quick Actions</span>
                  <span className="stat-value">{quickActions.length}</span>
                </div>
              </div>
            </div>

            <div className="dashboard-actions">
              <NotificationBell />
              <LogoutButton />
            </div>
          </div>

          <div className="quick-actions">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="quick-action"
              >
                <span className="quick-action-icon">{action.icon}</span>
                <div className="quick-action-copy">
                  <span className="quick-action-title">{action.title}</span>
                  <span className="quick-action-subtitle">
                    {action.description}
                  </span>
                </div>
              </Link>
            ))}
          </div>
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

                <div className="module-copy">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </div>

                <span className="module-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <aside className="dashboard-card profile-card">
          <div className="card-header">
            <h2>User</h2>
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
            <strong>{organizationName}</strong>
          </div>

          <div className="profile-row">
            <span>Roles</span>
            <strong>{user?.roles?.join(", ") || "-"}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
