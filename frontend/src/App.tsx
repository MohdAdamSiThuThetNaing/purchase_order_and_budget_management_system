import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";

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
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />

              <Route path="/organizations" element={<Organizations />} />

              <Route path="/projects" element={<Projects />} />

              <Route path="/budgets" element={<Budgets />} />

              <Route path="/purchase-orders" element={<PurchaseOrders />} />

              <Route
                path="/purchase-orders/new"
                element={<PurchaseOrderForm />}
              />

              <Route
                path="/purchase-orders/:id/edit"
                element={<PurchaseOrderForm />}
              />

              <Route
                path="/purchase-orders/:id"
                element={<PurchaseOrderDetails />}
              />

              <Route path="/users" element={<Users />} />

              <Route path="/budget-categories" element={<BudgetCategories />} />

              <Route path="/budget-lines" element={<BudgetLines />} />

              <Route path="/budget-report" element={<BudgetReport />} />

              <Route path="/approval-queue" element={<ApprovalQueue />} />

              <Route path="/notifications" element={<NotificationCenter />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
