import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

import Organizations from "./pages/Organizations";
import Projects from "./pages/Projects";
import Budgets from "./pages/Budgets";
import PurchaseOrders from "./pages/PurchaseOrders";
import Users from "./pages/Users";

import BudgetCategories from "./pages/BudgetCategories";
import BudgetLines from "./pages/BudgetLines";
import ApprovalQueue from "./pages/ApprovalQueue";
import BudgetReport from "./pages/BudgetReport";
import NotificationCenter from "./pages/NotificationCenter";
import PurchaseOrderDetails from "./pages/PurchaseOrderDetails";
import PurchaseOrderForm from "./pages/PurchaseOrderForm";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organizations"
            element={
              <ProtectedRoute>
                <Organizations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/budgets"
            element={
              <ProtectedRoute>
                <Budgets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/purchase-orders"
            element={
              <ProtectedRoute>
                <PurchaseOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/purchase-orders/new"
            element={
              <ProtectedRoute>
                <PurchaseOrderForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/purchase-orders/:id/edit"
            element={
              <ProtectedRoute>
                <PurchaseOrderForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/purchase-orders/:id"
            element={
              <ProtectedRoute>
                <PurchaseOrderDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/budget-categories"
            element={
              <ProtectedRoute>
                <BudgetCategories />
              </ProtectedRoute>
            }
          />

          <Route
            path="/budget-lines"
            element={
              <ProtectedRoute>
                <BudgetLines />
              </ProtectedRoute>
            }
          />

          <Route
            path="/budget-report"
            element={
              <ProtectedRoute>
                <BudgetReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/approval-queue"
            element={
              <ProtectedRoute>
                <ApprovalQueue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationCenter />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
