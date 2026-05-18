import React from 'react';

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
          return (
            <div key={agent.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200/50 transition-all duration-200">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
              {loadingTasks[agent.id] && (
                <div className="absolute top-0.5 left-0 right-0 h-0.5 bar-shimmer" />
              )}

              <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-100 flex items-center justify-center text-emerald-700 font-display font-extrabold text-lg">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-slate-900">{agent.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{agent.role}</p>
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
                      disabled={loadingTasks[agent.id] || !taskInputs[agent.id]}
                      className="bg-slate-900 text-white rounded-2xl px-5 py-2.5 text-sm font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-2"
                    >
                      {loadingTasks[agent.id] ? (
                        <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Thinking…</>
                      ) : (
                        <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>Deploy</>
                      )}
                    </button>
                  </div>
                </div>

                {result?.result && (
                  <div className="mb-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl max-h-48 overflow-y-auto">
                    <p className="text-emerald-700 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
                      Execution Output
                    </p>
                    <p className="text-xs text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">{result.result}</p>
                    {result.delegated && (
                      <p className="mt-2 pt-2 border-t border-emerald-100 text-xs text-indigo-600 font-bold flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                        Delegated → {result.delegated_to}
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => fetchPerformance(agent.id)}
                  className="w-full border border-slate-200 text-slate-600 rounded-xl py-2.5 text-xs font-bold hover:border-emerald-300 hover:text-emerald-600 transition-all flex items-center justify-center gap-1.5"
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
