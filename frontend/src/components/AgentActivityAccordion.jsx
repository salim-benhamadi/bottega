import React, { useState } from 'react';

export default function AgentActivityAccordion({ agents, token, logout, apiUrl }) {
  const [open, setOpen] = useState(null);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState({});

  const toggle = async (agentId) => {
    if (open === agentId) { setOpen(null); return; }
    setOpen(agentId);
    if (tasks[agentId]) return;
    setLoading(p => ({ ...p, [agentId]: true }));
    try {
      const res = await fetch(`${apiUrl}/tasks/history?agent_id=${agentId}&limit=10`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setTasks(p => ({ ...p, [agentId]: Array.isArray(data) ? data : [] }));
    } catch { setTasks(p => ({ ...p, [agentId]: [] })); }
    setLoading(p => ({ ...p, [agentId]: false }));
  };

  return (
    <div className="space-y-2">
      {agents.map(agent => (
        <div key={agent.agent_id} className="border border-slate-100 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggle(agent.agent_id)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">{agent.agent_name.charAt(0)}</div>
              <span className="font-bold text-slate-800 text-sm">{agent.agent_name}</span>
              <span className="text-xs text-slate-400 font-medium">{agent.count} task{agent.count !== 1 ? 's' : ''}</span>
            </div>
            <span className={`text-slate-400 text-sm transition-transform ${open === agent.agent_id ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {open === agent.agent_id && (
            <div className="px-5 pb-4 border-t border-slate-100">
              {loading[agent.agent_id] ? (
                <p className="text-sm text-slate-400 py-4 text-center">Loading…</p>
              ) : tasks[agent.agent_id]?.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No tasks found.</p>
              ) : (
                <div className="space-y-2 mt-3">
                  {tasks[agent.agent_id]?.map(t => (
                    <div key={t.task_id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{t.task_description}</p>
                        <p className="text-xs text-slate-400 font-medium">{new Date(t.timestamp).toLocaleString()}</p>
                      </div>
                      {t.delegated && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold shrink-0">A2A</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
