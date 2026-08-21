import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition focus:outline-none";

  const variants = {
    primary: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90",
    secondary: "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]",
    ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]",
    danger: "bg-[var(--error)] text-white hover:opacity-90",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]}`} {...props}>
      {children}
    </button>
  );
}
