import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export default function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  className = "",
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={!isDisabled ? onClick : undefined}
      className={`
        w-full
        bg-blue-700 hover:bg-blue-800
        text-white
        py-3
        rounded-xl
        font-semibold
        transition
        ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
