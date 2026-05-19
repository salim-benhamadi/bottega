import React from 'react';

export default function NavButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-all duration-150 rounded-sm ${
        active
          ? 'bg-slate-950 text-white'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      <span className={`shrink-0 transition-colors ${active ? 'text-white' : 'text-slate-400'}`}>
        {icon}
      </span>
      <span className="truncate">{children}</span>
    </button>
  );
}
