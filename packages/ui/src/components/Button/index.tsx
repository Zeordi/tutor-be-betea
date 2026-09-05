import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "soft" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantMap: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-sm hover:shadow-md disabled:bg-teal-300",
  secondary: "bg-blue-700 hover:bg-blue-800 text-white shadow-sm disabled:bg-blue-300",
  ghost:
    "bg-transparent hover:bg-teal-50 dark:hover:bg-teal-900/20 text-teal-700 dark:text-teal-400",
  soft:
    "bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300",
  danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm disabled:bg-red-300",
  outline:
    "border border-teal-600 text-teal-700 hover:bg-teal-50 dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-900/20",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 rounded-[8px]",
  md: "text-sm px-4 py-2 rounded-[10px]",
  lg: "text-base px-6 py-3 rounded-[12px]",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  fullWidth,
  icon,
  iconRight,
  children,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:opacity-60 disabled:cursor-not-allowed ${variantMap[variant]} ${sizeMap[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        icon
      )}
      {children}
      {iconRight && !loading && iconRight}
    </button>
  );
}

export default Button;