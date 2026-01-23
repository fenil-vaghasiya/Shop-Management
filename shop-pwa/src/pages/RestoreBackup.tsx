import { useRef } from "react";
import { toast } from "react-toastify";
import { importBackup } from "../offline/backup.import";

export default function RestoreBackup() {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleRestore = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      await importBackup(json);

      toast.success("Backup restored successfully ✅");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Invalid backup file ❌");
    }
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen space-y-4">
      <h1 className="text-xl font-semibold">
        Restore Backup
      </h1>

      {/* CLICKABLE RESTORE AREA */}
      <div
        onClick={() => fileRef.current?.click()}
        className="
          cursor-pointer
          border-2 border-dashed border-slate-300
          rounded-xl
          p-6
          bg-white
          text-center
          hover:border-blue-600
          transition
        "
      >
        <div className="text-lg font-medium text-slate-800">
          📂 Click to select backup file
        </div>
        <div className="text-sm text-slate-500 mt-1">
          JSON backup file only
        </div>
      </div>

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        onChange={handleRestore}
        className="hidden"
      />

      <p className="text-sm text-slate-500">
        ⚠ This will overwrite current data
      </p>
    </div>
  );
}
