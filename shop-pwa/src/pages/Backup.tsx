import Button from "../components/ui/Button";
import { exportBackup } from "../offline/backup.export";
import { downloadJSON } from "../utils/file";

export default function BackupPage() {
  const handleBackup = async () => {
    const backup = await exportBackup();

    const fileName =
      `shop-backup-${new Date().toISOString().slice(0, 10)}.json`;

    downloadJSON(backup, fileName);
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">
        Backup Data
      </h1>

      <Button onClick={handleBackup}>
        Download Backup
      </Button>
    </div>
  );
}
