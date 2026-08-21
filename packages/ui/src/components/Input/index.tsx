import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label style={{ fontSize: 14, fontWeight: 500 }}>{label}</label>
      )}
      <input
        {...props}
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          border: `1px solid ${error ? "var(--error)" : "var(--border)"}`,
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          fontSize: 15,
          outline: "none",
        }}
      />
      {error && (
        <span style={{ fontSize: 13, color: "var(--error)" }}>{error}</span>
      )}
    </div>
  );
}
