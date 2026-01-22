import { toast } from "react-toastify";
import { importBackup } from "../offline/backup.import";

export default function RestoreBackup() {
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

      <input
        type="file"
        accept="application/json"
        onChange={handleRestore}
        className="block"
      />

      <p className="text-sm text-slate-500">
        ⚠ This will overwrite current data
      </p>
    </div>
  );
}
