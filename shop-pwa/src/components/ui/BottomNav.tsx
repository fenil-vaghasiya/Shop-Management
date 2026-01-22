import { Link, useLocation } from "react-router-dom";

const tabs = [
  { path: "/", label: "Dashboard" },
  { path: "/billing", label: "Bill" },
  { path: "/stock-list", label: "Stock" },
  { path: "/reports", label: "Reports" }
];

export default function BottomNav() {
  const { pathname } = useLocation();

  // ❌ Hide BottomNav on login page
  if (pathname === "/login") return null;

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0
        bg-white
        border-t border-slate-200
        flex justify-around
        py-2
        z-50
      "
    >
      {tabs.map((t) => {
        const active = pathname === t.path;

        return (
          <Link
            key={t.path}
            to={t.path}
            className={`
              text-sm
              font-medium
              transition
              ${
                active
                  ? "text-blue-700"
                  : "text-slate-500 hover:text-blue-600"
              }
            `}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
