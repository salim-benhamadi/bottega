import React from 'react';

export default function TaskHistoryTab({
  taskHistory,
  historySearch,
  setHistorySearch,
  historyAgentFilter,
  setHistoryAgentFilter
}) {
  const filtered = taskHistory.filter(t => {
    const matchSearch = !historySearch || t.task_description?.toLowerCase().includes(historySearch.toLowerCase());
    const matchAgent  = historyAgentFilter === 'all' || t.agent_id === historyAgentFilter;
    return matchSearch && matchAgent;
  });

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Logs</p>
        <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Task History</h1>
        <p className="text-slate-500 font-medium text-lg">Search and filter execution logs across your swarms.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="relative flex-1 min-w-44">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
            placeholder="Search task descriptions…"
            value={historySearch}
            onChange={e => setHistorySearch(e.target.value)}
          />
        </div>
        <select
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all cursor-pointer"
          value={historyAgentFilter}
          onChange={e => setHistoryAgentFilter(e.target.value)}
        >
          <option value="all">All agents</option>
          {[...new Set(taskHistory.map(t => t.agent_id))].map(id => {
            const name = taskHistory.find(t => t.agent_id === id)?.agent_name || id;
            return <option key={id} value={id}>{name}</option>;
          })}
        </select>
        {(historySearch || historyAgentFilter !== 'all') && (
          <button
            onClick={() => { setHistorySearch(''); setHistoryAgentFilter('all'); }}
            className="border border-slate-200 text-slate-500 rounded-xl px-4 py-2.5 text-xs font-bold hover:border-slate-300 hover:text-slate-700 transition-all"
          >
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
          <p className="text-slate-400 font-medium">
            {taskHistory.length === 0 ? 'No tasks yet — assign tasks to your team first.' : 'No tasks match your filters.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-3 ml-1">
            {filtered.length} log entr{filtered.length !== 1 ? 'ies' : 'y'}
          </p>
          <div className="space-y-3">
            {filtered.map(task => (
              <div key={task.task_id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200/50 transition-all duration-200 animate-fade-in-up">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md">{task.agent_name || task.agent_id}</span>
                      {task.delegated && <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2.5 py-0.5 rounded-md">A2A Swarm</span>}
                      {task.pending_approval && <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold px-2.5 py-0.5 rounded-md">Pending Approval</span>}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">{task.task_description}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium shrink-0">{new Date(task.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium bg-slate-50 border border-slate-100 rounded-xl p-3 leading-relaxed whitespace-pre-wrap">
                  {task.result?.slice(0, 300)}{task.result?.length > 300 ? '…' : ''}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
