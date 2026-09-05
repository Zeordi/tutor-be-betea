import React from "react";
import { Button } from "../Button";

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "🔍",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-3xl dark:bg-teal-900/30">
        {icon}
      </div>
      <p className="mb-1 text-sm font-bold text-slate-800 dark:text-white">{title}</p>
      {description && (
        <p className="mb-4 max-w-[220px] text-xs text-slate-400">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;