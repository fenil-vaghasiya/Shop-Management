type Props = {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  onConfirm,
  onCancel
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-sm">
        <div className="font-semibold mb-4">{title}</div>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel}>Cancel</button>
          <button
            onClick={onConfirm}
            className="text-red-600 font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
