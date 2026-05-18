import React, { useState, useEffect } from 'react';
import AgentAvatar from '../../components/AgentAvatar';

// Parse the structured A2A result text produced by tasks.py
function parseA2AResult(text) {
  const pipelineMatch = text.match(/A2A Pipeline:\s*([^*\n→]+?)\s*→\s*([^*\n]+?)\*\*/);
  const delegatedMatch = text.match(/\*\*Delegated Work:\*\*\n([\s\S]+?)(?:\n\n\*\*Result from|$)/);
  const resultMatch = text.match(/\*\*Result from ([^:]+):\*\*\n([\s\S]+)$/);

  if (pipelineMatch) {
    return {
      isA2A: true,
      fromAgent: pipelineMatch[1].trim(),
      toAgent: pipelineMatch[2].trim(),
      delegatedWork: delegatedMatch?.[1]?.trim() || '',
      specialistResult: resultMatch?.[2]?.trim() || text,
      specialistName: resultMatch?.[1]?.trim() || pipelineMatch[2].trim(),
    };
  }
  return { isA2A: false, plain: text };
}

// Animated in-flight pipeline shown while delegation is running
function DelegationInFlight({ agentName }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const steps = [
    { label: 'Analyzing task scope', icon: '⚙' },
    { label: 'Routing to specialist', icon: '⚡' },
    { label: 'Awaiting result', icon: '↩' },
  ];

  return (
    <div className="mb-4 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 pulse-dot" />
          <span className="text-indigo-700 text-xs font-bold uppercase tracking-widest">A2A Swarm Pipeline</span>
        </div>
        <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>

      {/* Flow visualization */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          {/* Source node */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center font-bold text-sm text-indigo-700 a2a-pulse">
              {agentName?.charAt(0) || '?'}
            </div>
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest max-w-[52px] text-center truncate">{agentName}</span>
          </div>

          {/* Animated flow track */}
          <div className="flex-1 relative h-6 flex items-center">
            <div className="absolute inset-x-0 h-px bg-indigo-200" />
            <div className="absolute inset-0 overflow-hidden flex items-center">
              {[0, 1, 2].map(i => (
                <div key={i} className="absolute w-2 h-2 rounded-full bg-indigo-400 a2a-flow-particle" style={{ left: '50%' }} />
              ))}
            </div>
            <div className="absolute right-0 text-indigo-400">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5-5 5M6 7l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* Target node */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-purple-100 border-2 border-purple-200 flex items-center justify-center">
              <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <span className="text-[9px] font-bold text-purple-500 uppercase tracking-widest">Specialist</span>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-1.5">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-2 transition-all duration-300 ${i <= step ? 'opacity-100' : 'opacity-30'} ${i === step ? 'step-in' : ''}`}>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] shrink-0 ${
                i < step ? 'bg-indigo-500 text-white' : i === step ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
              }`}>
                {i < step ? '✓' : s.icon}
              </div>
              <span className={`text-xs font-medium ${i === step ? 'text-indigo-700 font-bold' : i < step ? 'text-slate-400 line-through' : 'text-slate-400'}`}>{s.label}</span>
              {i === step && <div className="flex gap-0.5 ml-auto">
                {[0,1,2].map(d => <span key={d} className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />)}
              </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Rich A2A result card rendered after delegation completes
function A2APipelineResult({ parsed }) {
  const [showWork, setShowWork] = useState(false);

  return (
    <div className="mb-4 rounded-2xl border border-indigo-200 overflow-hidden animate-fade-in-up">
      {/* Pipeline header banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-xs">{parsed.fromAgent?.charAt(0)}</div>
          <span className="text-white text-xs font-bold">{parsed.fromAgent}</span>
          <svg className="w-3.5 h-3.5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-xs">{parsed.toAgent?.charAt(0)}</div>
          <span className="text-white text-xs font-bold">{parsed.toAgent}</span>
        </div>
        <span className="bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">A2A Pipeline</span>
      </div>

      {/* Specialist result */}
      <div className="bg-indigo-50 px-4 py-3">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-4 h-4 rounded bg-indigo-500 flex items-center justify-center text-white" style={{ fontSize: 9 }}>✓</div>
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Result from {parsed.specialistName}</span>
        </div>
        <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">{parsed.specialistResult}</p>
      </div>

      {/* Collapsible delegated work section */}
      {parsed.delegatedWork && (
        <div className="border-t border-indigo-100">
          <button onClick={() => setShowWork(v => !v)}
            className="w-full px-4 py-2 flex items-center justify-between text-[10px] font-bold text-indigo-500 hover:bg-indigo-50 transition-colors uppercase tracking-widest">
            <span>Delegated Prompt</span>
            <svg className={`w-3 h-3 transition-transform ${showWork ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          {showWork && (
            <div className="px-4 pb-3 bg-white">
              <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{parsed.delegatedWork}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Escalation ─────────────────────────────────────────────────────────────

const ESCALATION_CONFIG = {
  stop:            { bg: 'bg-rose-50',   border: 'border-rose-200',   dot: 'bg-rose-500',   text: 'text-rose-700',   label: 'Agent Stopped',   icon: '🛑' },
  risky:           { bg: 'bg-orange-50', border: 'border-orange-200', dot: 'bg-orange-500', text: 'text-orange-700', label: 'Risk Flagged',    icon: '⚠️' },
  ask_manager:     { bg: 'bg-amber-50',  border: 'border-amber-200',  dot: 'bg-amber-500',  text: 'text-amber-700',  label: 'Needs Your Input',icon: '💬' },
  missing_context: { bg: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-500',   text: 'text-blue-700',   label: 'Missing Context', icon: '📋' },
};

function EscalationBanner({ escalation, taskId, agentId, onResolve, isLoading }) {
  const [reply, setReply] = React.useState('');
  const cfg = ESCALATION_CONFIG[escalation.type];
  if (!cfg) return null;
  const needsReply = escalation.type === 'ask_manager' || escalation.type === 'missing_context';
  return (
    <div className={`mb-4 rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden animate-fade-in-up`}>
      <div className={`px-4 pt-3.5 pb-3 border-b ${cfg.border} flex items-center gap-2`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        <span className={`text-xs font-bold uppercase tracking-widest ${cfg.text}`}>{cfg.icon} {cfg.label}</span>
      </div>
      <div className="p-4">
        <p className={`text-sm font-medium ${cfg.text} leading-relaxed mb-3`}>{escalation.reason}</p>
        {needsReply && (
          <div className="flex gap-2">
            <input
              className="flex-1 text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-medium placeholder-slate-400"
              placeholder={escalation.type === 'ask_manager' ? 'Your answer…' : 'Provide the missing context…'}
              value={reply}
              onChange={e => setReply(e.target.value)}
            />
            <button
              onClick={() => { if (reply.trim()) onResolve(agentId, taskId, reply); }}
              disabled={!reply.trim() || isLoading}
              className="bg-slate-900 text-white rounded-xl px-4 py-2 text-xs font-bold hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-40 shrink-0"
            >
              {isLoading ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Continue →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Org Chart ──────────────────────────────────────────────────────────────

const TITLE_OPTIONS = ['Director', 'Team Lead', 'Project Manager', 'Specialist', 'Analyst', 'Support'];
const TITLE_COLORS = {
  'Director':        'bg-purple-100 text-purple-700',
  'Team Lead':       'bg-emerald-100 text-emerald-700',
  'Project Manager': 'bg-indigo-100 text-indigo-700',
  'Specialist':      'bg-slate-100 text-slate-600',
  'Analyst':         'bg-amber-100 text-amber-700',
  'Support':         'bg-blue-100 text-blue-700',
};

function buildLayout(team, structure) {
  const children = {};
  const hasParent = new Set();
  team.forEach(a => { children[a.id] = []; });
  team.forEach(a => {
    const reportsTo = structure[a.id]?.reportsTo;
    if (reportsTo && children[reportsTo] !== undefined) {
      children[reportsTo].push(a.id);
      hasParent.add(a.id);
    }
  });
  const roots = team.filter(a => !hasParent.has(a.id)).map(a => a.id);
  const levelMap = {};
  const queue = roots.map(id => ({ id, level: 0 }));
  while (queue.length) {
    const { id, level } = queue.shift();
    levelMap[id] = level;
    (children[id] || []).forEach(cid => queue.push({ id: cid, level: level + 1 }));
  }
  const levels = {};
  team.forEach(a => {
    const lvl = levelMap[a.id] ?? 0;
    if (!levels[lvl]) levels[lvl] = [];
    levels[lvl].push(a.id);
  });
  const NODE_W = 160, NODE_H = 130, H_GAP = 20, V_GAP = 60;
  const numLevels = Math.max(...Object.keys(levels).map(Number)) + 1;
  const maxLevelSize = Math.max(...Object.values(levels).map(l => l.length));
  const canvasW = maxLevelSize * (NODE_W + H_GAP);
  const canvasH = numLevels * (NODE_H + V_GAP);
  const positions = {};
  Object.entries(levels).forEach(([lvlStr, ids]) => {
    const lvl = parseInt(lvlStr);
    const total = ids.length;
    const rowW = total * (NODE_W + H_GAP) - H_GAP;
    const startX = (canvasW - rowW) / 2;
    ids.forEach((id, i) => { positions[id] = { x: startX + i * (NODE_W + H_GAP), y: lvl * (NODE_H + V_GAP) }; });
  });
  return { positions, canvasW, canvasH: Math.max(canvasH, 200), children };
}

function OrgChartView({ team, orgStructure, onSave }) {
  const [localStructure, setLocalStructure] = React.useState(() => {
    const s = {};
    team.forEach(a => { s[a.id] = { reportsTo: orgStructure[a.id]?.reportsTo ?? null, title: orgStructure[a.id]?.title ?? '' }; });
    return s;
  });
  const [selectedAgent, setSelectedAgent] = React.useState(null);
  const [connectingFrom, setConnectingFrom] = React.useState(null);
  const [isDirty, setIsDirty] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [editingTitleFor, setEditingTitleFor] = React.useState(null);
  const [customTitleInput, setCustomTitleInput] = React.useState('');

  useEffect(() => {
    const s = {};
    team.forEach(a => { s[a.id] = { reportsTo: orgStructure[a.id]?.reportsTo ?? null, title: orgStructure[a.id]?.title ?? '' }; });
    setLocalStructure(s);
    setIsDirty(false);
  }, [orgStructure]);

  const { positions, canvasW, canvasH, children } = buildLayout(team, localStructure);
  const NODE_W = 160, NODE_H = 130;

  const handleNodeClick = (agentId) => {
    if (connectingFrom) {
      if (connectingFrom === agentId) { setConnectingFrom(null); }
      else {
        setLocalStructure(prev => ({ ...prev, [connectingFrom]: { ...prev[connectingFrom], reportsTo: agentId } }));
        setConnectingFrom(null);
        setIsDirty(true);
      }
    } else { setSelectedAgent(agentId === selectedAgent ? null : agentId); }
  };

  const handleDisconnect = (agentId) => {
    setLocalStructure(prev => ({ ...prev, [agentId]: { ...prev[agentId], reportsTo: null } }));
    setIsDirty(true);
  };

  const setTitle = (agentId, title) => {
    setLocalStructure(prev => ({ ...prev, [agentId]: { ...prev[agentId], title } }));
    setEditingTitleFor(null);
    setIsDirty(true);
  };

  const handleSave = async () => {
    await onSave(localStructure);
    setIsDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDiscard = () => {
    const s = {};
    team.forEach(a => { s[a.id] = { reportsTo: orgStructure[a.id]?.reportsTo ?? null, title: orgStructure[a.id]?.title ?? '' }; });
    setLocalStructure(s);
    setIsDirty(false);
  };

  const connectingAgent = connectingFrom ? team.find(a => a.id === connectingFrom) : null;

  return (
    <div className="relative">
      {connectingFrom && connectingAgent && (
        <div className="mb-3 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-sm font-semibold text-emerald-800">Connecting <span className="font-bold">{connectingAgent.name}</span> to… click another agent to set their manager.</span>
          <button onClick={() => setConnectingFrom(null)} className="ml-auto text-xs text-emerald-600 hover:text-emerald-800 font-bold transition-colors">Cancel</button>
        </div>
      )}
      <div className="overflow-auto rounded-2xl border border-slate-200 bg-slate-50" style={{ minHeight: 280, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }} />
        <div style={{ position: 'relative', width: canvasW + 80, height: canvasH + 80, minWidth: '100%', minHeight: 280 }}>
          <svg style={{ position: 'absolute', top: 40, left: 40, width: canvasW, height: canvasH, pointerEvents: 'none', zIndex: 1 }} viewBox={`0 0 ${canvasW} ${canvasH}`}>
            {team.map(agent => {
              const reportsTo = localStructure[agent.id]?.reportsTo;
              if (!reportsTo || !positions[agent.id] || !positions[reportsTo]) return null;
              const from = positions[reportsTo], to = positions[agent.id];
              const x1 = from.x + NODE_W / 2, y1 = from.y + NODE_H;
              const x2 = to.x + NODE_W / 2,   y2 = to.y;
              const midY = (y1 + y2) / 2;
              const isSelected = selectedAgent === agent.id || selectedAgent === reportsTo;
              return (
                <g key={`line-${agent.id}`}>
                  <path d={`M ${x1} ${y1} C ${x1} ${midY} ${x2} ${midY} ${x2} ${y2}`} fill="none" stroke={isSelected ? '#818cf8' : '#6ee7b7'} strokeWidth={isSelected ? 2.5 : 1.5} strokeDasharray={isSelected ? '6 3' : 'none'} opacity={0.85} />
                  <circle cx={x1} cy={y1} r={3} fill={isSelected ? '#818cf8' : '#6ee7b7'} />
                  <circle cx={x2} cy={y2} r={3} fill={isSelected ? '#818cf8' : '#6ee7b7'} />
                </g>
              );
            })}
          </svg>
          {team.map(agent => {
            const pos = positions[agent.id];
            if (!pos) return null;
            const isSelected = selectedAgent === agent.id;
            const isConnecting = connectingFrom === agent.id;
            const isConnectTarget = connectingFrom && connectingFrom !== agent.id;
            const title = localStructure[agent.id]?.title || '';
            const titleColor = TITLE_COLORS[title] || 'bg-slate-100 text-slate-500';
            return (
              <div key={agent.id} onClick={() => handleNodeClick(agent.id)}
                style={{ position: 'absolute', left: pos.x + 40, top: pos.y + 40, width: NODE_W, zIndex: 2, cursor: connectingFrom ? 'pointer' : 'default' }}
                className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 select-none ${isConnecting ? 'border-emerald-400 ring-2 ring-emerald-300 scale-105' : isSelected ? 'border-indigo-300 ring-2 ring-indigo-200' : isConnectTarget ? 'border-dashed border-emerald-400 hover:border-emerald-500 hover:shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-t-2xl" />
                <div className="pt-4 pb-3 px-3 flex flex-col items-center">
                  <div className="mb-2"><AgentAvatar name={agent.name} role={agent.role} size={40} /></div>
                  <p className="text-xs font-bold text-slate-900 text-center truncate w-full">{agent.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium text-center truncate w-full mb-2">{agent.role}</p>
                  {editingTitleFor === agent.id ? (
                    <div className="w-full mb-2" onClick={e => e.stopPropagation()}>
                      <div className="flex flex-wrap gap-1 mb-1">
                        {TITLE_OPTIONS.map(opt => (
                          <button key={opt} onClick={() => setTitle(agent.id, opt)} className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer hover:opacity-80 ${TITLE_COLORS[opt] || 'bg-slate-100 text-slate-500'}`}>{opt}</button>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <input className="flex-1 text-[10px] border border-slate-200 rounded-lg px-1.5 py-0.5 outline-none focus:border-emerald-400" placeholder="Custom…" value={customTitleInput} onChange={e => setCustomTitleInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') setTitle(agent.id, customTitleInput); }} autoFocus />
                        <button onClick={() => setTitle(agent.id, customTitleInput)} className="text-[9px] bg-emerald-500 text-white rounded-lg px-1.5 py-0.5 font-bold">OK</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={e => { e.stopPropagation(); setEditingTitleFor(agent.id); setCustomTitleInput(title); }} className={`text-[9px] font-bold px-2 py-0.5 rounded-md mb-2 hover:opacity-80 ${title ? titleColor : 'bg-slate-100 text-slate-400 border border-dashed border-slate-300'}`}>
                      {title || '+ Add title'}
                    </button>
                  )}
                  <div className="flex items-center gap-1.5 w-full justify-center" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setConnectingFrom(connectingFrom === agent.id ? null : agent.id)} title="Set manager" className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-lg transition-all ${connectingFrom === agent.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700'}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                      Connect
                    </button>
                    {localStructure[agent.id]?.reportsTo && (
                      <button onClick={() => handleDisconnect(agent.id)} title="Remove manager link" className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition-all">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {team.length > 0 && Object.values(localStructure).every(s => !s.reportsTo) && (
        <p className="text-center text-slate-400 text-xs font-medium mt-3">Connect agents by clicking the <span className="font-bold text-emerald-600">Connect</span> button on any card to set their manager.</p>
      )}
      {isDirty && (
        <div className="mt-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="text-sm font-medium text-amber-800 flex-1">You have unsaved changes</span>
          <button onClick={handleDiscard} className="text-xs text-amber-600 hover:text-amber-800 font-bold px-3 py-1.5 rounded-xl hover:bg-amber-100 transition-all">Discard</button>
          <button onClick={handleSave} className="text-xs bg-amber-500 hover:bg-amber-400 text-white font-bold px-4 py-1.5 rounded-xl transition-all active:scale-95">Save Structure</button>
        </div>
      )}
      {saved && !isDirty && (
        <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 animate-fade-in-up">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
          <span className="text-sm font-semibold text-emerald-700">Saved</span>
        </div>
      )}
    </div>
  );
}

// ── Main TeamTab ───────────────────────────────────────────────────────────

export default function TeamTab({
  team,
  setActiveTab,
  taskInputs,
  setTaskInputs,
  taskResults,
  loadingTasks,
  handleFire,
  handleTaskAssign,
  handleApproveTask,
  handleEndProbation,
  fetchPerformance,
  handleEscalationResolve,
  orgStructure = {},
  saveOrgStructure,
}) {
  const [viewMode, setViewMode] = useState('grid');

  return (
    <div>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Operations</p>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Your Team</h1>
          <p className="text-slate-500 font-medium text-lg">Manage deployed agents and assign operational objectives.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Grid</button>
            <button onClick={() => setViewMode('org')}  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'org'  ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Org Chart</button>
          </div>
          {team.length > 0 && (
            <button onClick={() => setActiveTab('marketplace')}
              className="bg-emerald-500 text-white rounded-2xl px-6 py-3.5 font-bold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              Hire Agent
            </button>
          )}
        </div>
      </div>

      {team.length > 0 && (
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-600">
            {team.length} agent{team.length !== 1 ? 's' : ''}
          </span>
          {team.filter(a => a.probation_mode).length > 0 && (
            <span className="bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2 text-xs font-bold text-amber-700">
              {team.filter(a => a.probation_mode).length} in probation
            </span>
          )}
        </div>
      )}

      {/* Org Chart view */}
      {viewMode === 'org' && (
        <div className="mb-6">
          {team.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
              <p className="text-slate-400 font-medium mb-5">Your team is empty. Hire specialized agents to get started.</p>
              <button onClick={() => setActiveTab('marketplace')} className="bg-slate-900 text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-emerald-500 transition-all inline-flex items-center gap-2">
                Go to Marketplace
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </button>
            </div>
          ) : (
            <OrgChartView team={team} orgStructure={orgStructure} onSave={saveOrgStructure} />
          )}
        </div>
      )}

      {/* Grid view */}
      {viewMode === 'grid' && <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {team.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
            <p className="text-slate-400 font-medium mb-5">Your team is empty. Hire specialized agents to get started.</p>
            <button onClick={() => setActiveTab('marketplace')}
              className="bg-slate-900 text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-emerald-500 transition-all inline-flex items-center gap-2">
              Go to Marketplace
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </button>
          </div>
        )}

        {team.map(agent => {
          const result = taskResults[agent.id];
          const isMeeting = agent.role === 'Meeting Analyst';
          const isDelegating = loadingTasks[agent.id];
          const justDelegated = result?.delegated && !isDelegating;
          const parsed = result?.result ? parseA2AResult(result.result) : null;

          return (
            <div key={agent.id} className={`bg-white rounded-2xl border shadow-sm flex flex-col relative overflow-hidden transition-all duration-300 ${
              justDelegated
                ? 'border-indigo-200 shadow-indigo-100/60 shadow-lg'
                : `border-slate-100 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200/50 ${agent.probation_mode && !justDelegated ? 'border-amber-200 shadow-amber-50' : ''}`
            }`}>
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r transition-all duration-500 ${
                justDelegated ? 'from-indigo-500 via-purple-400 to-transparent' : 'from-emerald-500 via-teal-400 to-transparent'
              }`} />
              {isDelegating && <div className="absolute top-0.5 left-0 right-0 h-0.5 bar-shimmer" />}

              <div className="p-6">
                {/* Agent header */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl overflow-hidden transition-all duration-500 ${
                      justDelegated ? 'ring-2 ring-indigo-400 scale-110 a2a-pulse'
                      : isDelegating ? 'ring-2 ring-emerald-300 animate-pulse'
                      : ''
                    }`}>
                      <AgentAvatar name={agent.name} role={agent.role} size={48} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-display font-bold text-slate-900">{agent.name}</h3>
                        {justDelegated && (
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest animate-fade-in-up">
                            A2A
                          </span>
                        )}
                        {isDelegating && (
                          <span className="bg-purple-50 text-purple-600 border border-purple-100 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest animate-pulse">
                            Delegating…
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{agent.role}</p>
                      {agent.skills?.some(s => ['Copywriting','Sales','Proposal','Legal','Financial','SEO','German','Translation','Lead','Data','Content','Project','Meeting'].some(k => s.includes(k))) && (
                        <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">A2A capable</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {agent.probation_mode ? (
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-widest">Probation</span>
                        <button onClick={() => handleEndProbation(agent.id)} className="text-[10px] text-slate-400 hover:text-slate-600 font-bold uppercase tracking-wider transition-colors">End</button>
                      </div>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-widest">Autonomous</span>
                    )}
                    <div className="flex items-center gap-2">
                      {isMeeting && <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">Speechmatics</span>}
                      <button onClick={() => handleFire(agent.id, agent.name)} className="text-xs text-rose-400 hover:text-rose-600 font-bold transition-colors">Fire</button>
                    </div>
                  </div>
                </div>

                {/* Pending approval banner */}
                {result?.pending_approval && (
                  <div className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <p className="text-amber-700 text-xs font-bold uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 pulse-dot" />
                        Pending Approval
                      </p>
                      <p className="text-amber-600 text-xs font-medium">Verify before committing to Dossier memory.</p>
                    </div>
                    <button onClick={() => handleApproveTask(agent.id)}
                      className="shrink-0 bg-slate-900 text-white rounded-xl px-4 py-2 text-xs font-bold hover:bg-emerald-500 transition-all">
                      Approve
                    </button>
                  </div>
                )}

                {/* Task input */}
                <div className="mb-4">
                  <textarea
                    className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400 resize-none"
                    rows="2"
                    placeholder={`Deploy objective to ${agent.name}…`}
                    value={taskInputs[agent.id] || ''}
                    onChange={e => setTaskInputs(prev => ({ ...prev, [agent.id]: e.target.value }))}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleTaskAssign(agent.id)}
                      disabled={isDelegating || !taskInputs[agent.id]}
                      className={`rounded-2xl px-5 py-2.5 text-sm font-bold active:scale-95 transition-all disabled:opacity-30 flex items-center gap-2 ${
                        isDelegating
                          ? 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25'
                          : 'bg-slate-900 text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25'
                      }`}
                    >
                      {isDelegating ? (
                        <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Delegating…</>
                      ) : (
                        <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>Deploy</>
                      )}
                    </button>
                  </div>
                </div>

                {/* A2A in-flight animation */}
                {isDelegating && <DelegationInFlight agentName={agent.name} />}

                {/* Escalation banner */}
                {result?.escalation && !isDelegating && (
                  <EscalationBanner
                    escalation={result.escalation}
                    taskId={result.task_id}
                    agentId={agent.id}
                    onResolve={handleEscalationResolve}
                    isLoading={isDelegating}
                  />
                )}

                {/* Result rendering */}
                {result?.result && !isDelegating && !['stop','ask_manager','missing_context'].includes(result?.escalation?.type) && (
                  parsed?.isA2A
                    ? <A2APipelineResult parsed={parsed} />
                    : (
                      <div className={`mb-4 rounded-xl overflow-hidden animate-fade-in-up ${result?.escalation?.type === 'risky' ? 'bg-orange-50 border border-orange-100' : 'bg-emerald-50 border border-emerald-100'}`}>
                        <div className={`px-4 pt-4 pb-1 border-b flex items-center gap-1.5 ${result?.escalation?.type === 'risky' ? 'border-orange-100' : 'border-emerald-100'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full pulse-dot ${result?.escalation?.type === 'risky' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                          <span className={`text-xs font-bold uppercase tracking-widest ${result?.escalation?.type === 'risky' ? 'text-orange-700' : 'text-emerald-700'}`}>
                            {result?.escalation?.type === 'risky' ? '⚠️ Completed with Risk' : 'Execution Output'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium whitespace-pre-wrap leading-relaxed p-4 max-h-56 overflow-y-auto">{result.result}</p>
                      </div>
                    )
                )}

                <button
                  onClick={() => fetchPerformance(agent.id)}
                  className="w-full border border-slate-200 text-slate-600 rounded-xl py-2.5 text-xs font-bold hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-all flex items-center justify-center gap-1.5"
                >
                  View Dossier & Performance
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>}
    </div>
  );
}
