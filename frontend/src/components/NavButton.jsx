import React from 'react';

export default function NavButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-semibold transition-all duration-150 relative rounded-xl mx-1 ${
        active
          ? 'text-emerald-400 bg-emerald-500/10'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
      }`}
      style={{ width: 'calc(100% - 8px)' }}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-400 rounded-r" />
      )}
      <span className={`shrink-0 transition-colors ${active ? 'text-emerald-400' : 'text-slate-500'}`}>
        {icon}
      </span>
      <span className="truncate">{children}</span>
    </button>
  );
}
