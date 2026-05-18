import React, { useEffect } from 'react';

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-3 animate-fade-in-up ${type === 'success' ? 'bg-slate-900 text-white' : 'bg-rose-500 text-white'}`}>
      {type === 'success' ? '✓' : '✕'} {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">×</button>
    </div>
  );
}
