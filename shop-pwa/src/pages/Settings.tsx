import { Link } from "react-router-dom";

export default function Settings() {
  return (
    <div className="p-4 bg-slate-50 min-h-screen space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">
        Settings
      </h1>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between gap-2">
        <Link
          to="/backup"
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex justify-between"
        >
          📤 Backup Data
        </Link>

        <Link
          to="/restore"
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex justify-between"
        >
          📥 Restore Data
        </Link>
      </div>
    </div>
  );
}
