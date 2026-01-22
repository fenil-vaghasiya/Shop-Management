import { useEffect, useRef, useState } from "react";

type Option = {
  label: string;
  value: string | number;
};

type Props = {
  value: string | number;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
};

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select option",
  disabled = false,
  searchable = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = options.find(o => String(o.value) === String(value));

  const filteredOptions = searchable
    ? options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {/* SELECT BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        className={`
          w-full bg-white border border-slate-300 rounded-xl
          px-4 py-3 text-left flex justify-between items-center
          focus:outline-none focus:ring-2 focus:ring-blue-600
          ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <span className={selected ? "text-slate-900" : "text-slate-400"}>
          {selected?.label || placeholder}
        </span>
        <span className="text-slate-400">▾</span>
      </button>

      {/* DROPDOWN */}
      {open && !disabled && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg">
          {/* SEARCH INPUT */}
          {searchable && (
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="
                w-full px-4 py-2 border-b border-slate-200
                text-sm focus:outline-none
              "
            />
          )}

          {/* OPTIONS */}
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 && (
              <div className="px-4 py-3 text-sm text-slate-500">
                No results
              </div>
            )}

            {filteredOptions.map(opt => {
              const active = String(opt.value) === String(value);
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(String(opt.value));
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`
                    px-4 py-3 cursor-pointer text-slate-900
                    hover:bg-slate-100
                    ${active ? "bg-slate-100 font-medium" : ""}
                  `}
                >
                  {opt.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
