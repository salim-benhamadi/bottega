import React, { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import * as personasStyle from '@dicebear/personas';

export default function AgentAvatar({ name, role, size = 48, className = '' }) {
  const svg = useMemo(() => {
    const r = (role || '').toLowerCase();
    let backgroundColor = 'e2e8f0';
    if (r.includes('legal') || r.includes('contract'))    backgroundColor = 'e0e7ff';
    else if (r.includes('sales') || r.includes('lead'))   backgroundColor = 'd1fae5';
    else if (r.includes('finance') || r.includes('data')) backgroundColor = 'fef3c7';
    else if (r.includes('content') || r.includes('seo'))  backgroundColor = 'dbeafe';
    else if (r.includes('german') || r.includes('trans')) backgroundColor = 'f3e8ff';
    else if (r.includes('project') || r.includes('plan')) backgroundColor = 'e0f2fe';
    else if (r.includes('meeting') || r.includes('note')) backgroundColor = 'd1fae5';

    return createAvatar(personasStyle, {
      seed: name || 'agent',
      size,
      backgroundColor: [backgroundColor],
    }).toString();
  }, [name, role, size]);

  return (
    <div
      className={`rounded-xl overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
