import React from "react";

export interface TabsProps {
  tabs: string[];
  activeIndex?: number;
  onChange?: (index: number) => void;
}

export function Tabs({ tabs, activeIndex = 0, onChange }: TabsProps) {
  return (
    <div className="flex max-w-lg gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      {tabs.map((t, i) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange?.(i)}
          className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
            activeIndex === i
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export default Tabs;