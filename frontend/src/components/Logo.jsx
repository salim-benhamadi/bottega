import React from 'react';

export default function Logo({ size = "normal", dark = false }) {
  const iconClass = size === "small" ? "w-6 h-6 rounded-lg" : "w-8 h-8 rounded-xl";
  const textClass = size === "small" ? "text-xl" : "text-2xl";
  const dotSize   = size === "small" ? "w-1.5 h-1.5" : "w-2.5 h-2.5";
  return (
    <div className={`flex items-center gap-2 font-display font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-900'} ${textClass}`}>
      <div className={`flex items-center justify-center bg-slate-900 relative overflow-hidden shadow-md ${iconClass}`}>
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-emerald-500 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-teal-400 rounded-tr-full" />
        <div className={`absolute bg-lime-300 rounded-full shadow-sm z-10 ${dotSize}`} />
      </div>
      bottega
    </div>
  );
}
