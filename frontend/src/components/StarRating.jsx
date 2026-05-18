import React, { useState } from 'react';

export default function StarRating({ value, onChange, readonly = false, size = "text-xl" }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => (
        <button key={star} type="button"
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${size} transition-colors ${star <= (hover || value) ? 'text-amber-400' : 'text-slate-200'} ${!readonly ? 'hover:scale-110 transition-transform cursor-pointer' : 'cursor-default'}`}
          disabled={readonly}>★</button>
      ))}
    </div>
  );
}
