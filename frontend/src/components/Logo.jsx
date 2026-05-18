import React from 'react';

export default function Logo({ size = "normal", dark = false }) {
  const px        = size === "small" ? 24 : 32;
  const rx        = size === "small" ? 7  : 9;
  const textClass = size === "small" ? "text-xl" : "text-2xl";

  return (
    <div className={`flex items-center gap-2.5 font-display font-extrabold tracking-tight select-none ${dark ? 'text-white' : 'text-slate-900'} ${textClass}`}>
      <svg
        width={px} height={px}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, borderRadius: rx, overflow: 'hidden', display: 'block' }}
      >
        <defs>
          <linearGradient id="logo-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <radialGradient id="logo-arcA" cx="28" cy="4" r="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
          </radialGradient>

          <radialGradient id="logo-arcB" cx="4" cy="28" r="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.7" />
          </radialGradient>

          <radialGradient id="logo-bloom" cx="16" cy="16" r="7" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#d9f99d" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0"   />
          </radialGradient>

          <linearGradient id="logo-sheen" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0"    />
          </linearGradient>
        </defs>

        <rect width="32" height="32" fill="url(#logo-bg)" />

        <path d="M 32 0 L 32 20 Q 32 32 20 32 L 32 32 Z" fill="url(#logo-arcA)" opacity="0.9" />
        <path d="M 0 32 L 12 32 Q 0 32 0 20 L 0 32 Z"   fill="url(#logo-arcB)" opacity="0.9" />

        <circle cx="16" cy="16" r="7"   fill="url(#logo-bloom)" />
        <circle cx="16" cy="16" r="2.6" fill="#bef264" />
        <circle cx="16" cy="16" r="1.4" fill="#ecfccb" />

        <rect width="32" height="32" fill="url(#logo-sheen)" />
      </svg>

      bottega
    </div>
  );
}
