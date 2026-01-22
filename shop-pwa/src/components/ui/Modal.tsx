type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-4">
        {title && (
          <div className="font-semibold mb-3">
            {title}
          </div>
        )}

        {children}

        <button
          onClick={onClose}
          className="mt-4 text-sm text-slate-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
