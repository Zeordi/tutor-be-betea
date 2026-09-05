import React from "react";

export function ChatRedactionBanner() {
  return (
    <div className="mx-2 flex items-center gap-2">
      <div className="h-px flex-1 bg-red-200 dark:bg-red-900" />
      <span className="text-[9px] font-semibold text-red-500">
        ⚠️ Contact info redacted per platform policy
      </span>
      <div className="h-px flex-1 bg-red-200 dark:bg-red-900" />
    </div>
  );
}

export function RestrictedToken({ children = "[RESTRICTED CONTACT INFO]" }: { children?: string }) {
  return (
    <span className="rounded bg-red-100 px-1 font-mono text-red-600 dark:bg-red-900/40 dark:text-red-400">
      {children}
    </span>
  );
}

export default ChatRedactionBanner;