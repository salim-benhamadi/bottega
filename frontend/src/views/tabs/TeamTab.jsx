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
  fetchPerformance
}) {
  return (
    <div>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Operations</p>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Your Team</h1>
          <p className="text-slate-500 font-medium text-lg">Manage deployed agents and assign operational objectives.</p>
        </div>
        {team.length > 0 && (
          <button onClick={() => setActiveTab('marketplace')}
            className="bg-emerald-500 text-white rounded-2xl px-6 py-3.5 font-bold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            Hire Agent
          </button>
        )}
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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

                {/* Result rendering */}
                {result?.result && !isDelegating && (
                  parsed?.isA2A
                    ? <A2APipelineResult parsed={parsed} />
                    : (
                      <div className="mb-4 rounded-xl overflow-hidden animate-fade-in-up bg-emerald-50 border border-emerald-100">
                        <div className="px-4 pt-4 pb-1 border-b border-emerald-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
                          <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest">Execution Output</span>
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
      </div>
    </div>
  );
}
