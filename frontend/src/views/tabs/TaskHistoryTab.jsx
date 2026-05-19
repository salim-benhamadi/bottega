import React, { useState } from 'react';

export default function TaskHistoryTab({
  taskHistory,
  setTaskHistory,
  historySearch,
  setHistorySearch,
  historyAgentFilter,
  setHistoryAgentFilter,
  token,
  apiUrl,
}) {
  const [exporting, setExporting] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  const handleApprove = async (taskId) => {
    setApprovingId(taskId);
    try {
      const res = await fetch(`${apiUrl}/tasks/approve/${taskId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Approval failed');
      setTaskHistory(prev => prev.map(t =>
        t.task_id === taskId ? { ...t, pending_approval: false, approved: true } : t
      ));
    } catch (e) {
      console.error(e);
    }
    setApprovingId(null);
  };

  const filtered = taskHistory.filter(t => {
    const matchSearch = !historySearch || t.task_description?.toLowerCase().includes(historySearch.toLowerCase());
    const matchAgent  = historyAgentFilter === 'all' || t.agent_id === historyAgentFilter;
    return matchSearch && matchAgent;
  });

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${apiUrl}/audit-log/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bottega_audit_log_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
    setExporting(false);
  };

  return (
    <div>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-2">Logs</p>
          <h1 className="text-3xl font-bold text-slate-950 mb-2 tracking-tight">Task History</h1>
          <p className="text-slate-400 text-sm">Search and filter execution logs across your swarms.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || taskHistory.length === 0}
          className="shrink-0 flex items-center gap-2 bg-slate-950 text-white px-5 py-2.5 text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-40"
        >
          {exporting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          )}
          Export Audit Log
          <span className="bg-white/15 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest">EU AI Act</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5 bg-white border border-slate-200 p-4">
        <div className="relative flex-1 min-w-44">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <input
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-400 transition-all"
            placeholder="Search task descriptions…"
            value={historySearch}
            onChange={e => setHistorySearch(e.target.value)}
          />
        </div>
        <select
          className="bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:border-slate-400 transition-all cursor-pointer"
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
            className="border border-slate-200 text-slate-500 px-4 py-2.5 text-xs font-medium hover:border-slate-300 hover:text-slate-700 transition-all"
          >
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-slate-200">
          <p className="text-slate-400 text-sm">
            {taskHistory.length === 0 ? 'No tasks yet — assign tasks to your team first.' : 'No tasks match your filters.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-3">
            {filtered.length} log entr{filtered.length !== 1 ? 'ies' : 'y'}
            {taskHistory.length !== filtered.length && ` · ${taskHistory.length} total`}
          </p>
          <div className="space-y-2">
            {filtered.map(task => (
              <div key={task.task_id} className="bg-white border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200 animate-fade-in-up">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-medium px-2 py-0.5">{task.agent_name || task.agent_id}</span>
                      {task.delegated && <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-medium px-2 py-0.5">A2A Swarm</span>}
                      {task.pending_approval && <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-medium px-2 py-0.5">Pending Approval</span>}
                      {task.approved && !task.pending_approval && <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium px-2 py-0.5">Approved</span>}
                      {task.escalation?.type === 'stop'            && <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-medium px-2 py-0.5">Stopped</span>}
                      {task.escalation?.type === 'risky'           && <span className="bg-orange-50 text-orange-700 border border-orange-100 text-[10px] font-medium px-2 py-0.5">Risk Flagged</span>}
                      {task.escalation?.type === 'ask_manager'     && <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-medium px-2 py-0.5">Asked Manager</span>}
                      {task.escalation?.type === 'missing_context' && <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-medium px-2 py-0.5">Missing Context</span>}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">{task.task_description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {task.pending_approval && (
                      <button
                        onClick={() => handleApprove(task.task_id)}
                        disabled={approvingId === task.task_id}
                        className="flex items-center gap-1.5 bg-slate-900 hover:bg-emerald-600 active:scale-95 text-white text-xs font-medium px-3 py-1.5 transition-all disabled:opacity-60"
                      >
                        {approvingId === task.task_id ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                        Approve
                      </button>
                    )}
                    <span className="text-[11px] text-slate-400">{new Date(task.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3">
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {task.result?.slice(0, 300)}{task.result?.length > 300 ? '…' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
