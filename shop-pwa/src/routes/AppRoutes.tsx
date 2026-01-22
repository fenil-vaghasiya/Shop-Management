import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoutes";
import Customers from "../pages/Customers";
import ProductTypes from "../pages/productTypes";
import Products from "../pages/Products";
import StockEntry from "../pages/StockEntry";
import StockList from "../pages/StockList";
import Billing from "../pages/Billing";
import BillInvoice from "../pages/BillInvoice";
import BillHistory from "../pages/BillHistory";
import Reports from "../pages/Reports";
import PendingPayments from "../pages/PendingPayments";
import RestoreBackup from "../pages/RestoreBackup";
import BackupPage from "../pages/Backup";
import Settings from "../pages/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/product-types"
        element={
          <ProtectedRoute>
            <ProductTypes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stock-entry"
        element={
          <ProtectedRoute>
            <StockEntry />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stock-list"
        element={
          <ProtectedRoute>
            <StockList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bills"
        element={
          <ProtectedRoute>
            <BillHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bill/:id"
        element={
          <ProtectedRoute>
            <BillInvoice />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pending-payments"
        element={
          <ProtectedRoute>
            <PendingPayments />
          </ProtectedRoute>
        }
      />

      <Route path="/settings" element={<Settings />} />
      <Route path="/backup" element={<BackupPage />} />
      <Route path="/restore" element={<RestoreBackup />} />
    </Routes>
  );
}
