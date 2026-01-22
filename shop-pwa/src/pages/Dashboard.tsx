import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="p-4 space-y-5">
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>

      {/* PRIMARY ACTION */}
      <Link
        to="/billing"
        className="
          block
          bg-blue-700 hover:bg-blue-800
          text-white
          p-4
          rounded-xl
          text-center
          font-semibold
          shadow-sm
        "
      >
        Create Bill
      </Link>

      {/* SECONDARY ACTIONS */}
      <div className="grid grid-cols-2 gap-3">
        <DashboardCard to="/customers" label="Customers" />
        <DashboardCard to="/product-types" label="Product Types" />
        <DashboardCard to="/products" label="Products" />
        <DashboardCard to="/stock-entry" label="Stock Entry" />
        <DashboardCard to="/stock-list" label="Stock Summary" />
        <DashboardCard to="/bills" label="Bill History" />
        <DashboardCard to="/reports" label="Reports" />
        <DashboardCard to="/settings" label="⚙ Settings" />
      </div>

      {/* CRITICAL SECTION */}
      <Link
        to="/pending-payments"
        className="
          block
          bg-red-50
          border border-red-300
          text-red-700
          p-4
          rounded-xl
          text-center
          font-semibold
        "
      >
        Pending Payments
      </Link>
    </div>
  );
}

function DashboardCard({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="
        bg-white
        border border-slate-200
        rounded-xl
        p-4
        text-center
        shadow-sm
        hover:border-blue-400
        transition
      "
    >
      <span className="text-sm font-medium text-slate-800">{label}</span>
    </Link>
  );
}
