import { useEffect, useRef, useState } from "react";

type Action = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

type Props = {
  actions: Action[];
};

export default function KebabMenu({ actions }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-slate-100"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-lg shadow-md z-50">
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={() => {
                setOpen(false);
                a.onClick();
              }}
              className={`
                w-full text-left px-4 py-2 text-sm
                hover:bg-slate-100
                ${a.danger ? "text-red-600" : "text-slate-700"}
              `}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
