type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search..."
}: Props) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full p-3 rounded-xl
        border border-slate-300
        text-slate-900
        placeholder-slate-400
        focus:outline-none
        focus:ring-2 focus:ring-blue-600
      "
    />
  );
}
