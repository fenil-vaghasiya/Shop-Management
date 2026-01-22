import React from "react";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
};

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: Props) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        w-full
        bg-white
        border border-slate-300
        rounded-xl
        px-4 py-3
        text-slate-900
        text-sm
        placeholder-slate-400
        focus:outline-none
        focus:ring-2 focus:ring-blue-600
        focus:border-blue-600
        ${className}
      `}
    />
  );
}
