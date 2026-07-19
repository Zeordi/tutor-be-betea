'use client';

import { useState } from 'react';

export function DropdownMenu({
  label,
  items,
}: {
  label: string;
  items: { label: string; onSelect: () => void }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button type="button" className="rounded-md border px-3 py-2 text-sm" onClick={() => setOpen((v) => !v)}>
        {label}
      </button>
      {open && (
        <ul className="absolute right-0 z-20 mt-1 min-w-[10rem] rounded-md border bg-white py-1 shadow-md">
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                onClick={() => {
                  item.onSelect();
                  setOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
