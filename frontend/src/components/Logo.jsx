import React from 'react';

export default function Logo({ size = "normal", dark = false }) {
  const px        = size === "small" ? 24 : 30;
  const textClass = size === "small" ? "text-lg" : "text-xl";

  return (
    <div className={`flex items-center gap-2 font-bold tracking-tight select-none ${dark ? 'text-white' : 'text-slate-900'} ${textClass}`}>
      <svg
        width={px} height={px}
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, display: 'block' }}
      >
        <rect width="30" height="30" fill="#0f172a" />
        <rect x="8" y="8" width="6" height="14" fill="#34d399" />
        <rect x="8" y="8" width="14" height="3" fill="#34d399" />
        <rect x="8" y="19" width="11" height="3" fill="#34d399" />
        <rect x="8" y="13.5" width="10" height="3" fill="#0f172a" />
        <rect x="16" y="13" width="6" height="9" fill="#34d399" />
      </svg>
      bottega
    </div>
  );
}
