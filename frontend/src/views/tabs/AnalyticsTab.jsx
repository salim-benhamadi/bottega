import React from 'react';
import AgentActivityAccordion from '../../components/AgentActivityAccordion';

export default function AnalyticsTab({ analytics, token, logout, apiUrl }) {
  return (
    <div>
      <div className="mb-10">
        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-2">Insights</p>
        <h1 className="text-3xl font-bold text-slate-950 mb-2 tracking-tight">Analytics</h1>
        <p className="text-slate-400 text-sm">System throughput, swarm delegation matrix, and credit velocity.</p>
      </div>

      {!analytics ? (
        <div className="bg-white border border-slate-200 py-24 text-center">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-600">Gathering system metrics…</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Primary stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Total Tasks',      value: analytics.total_tasks,       sub: 'operational logs',      dot: 'bg-emerald-400' },
              { label: 'Active Agents',    value: analytics.active_agents,     sub: 'in pipeline',           dot: 'bg-indigo-400' },
              { label: 'A2A Delegations',  value: analytics.delegation_count,  sub: 'swarm-orchestrated',    dot: 'bg-purple-400' },
              { label: 'Credit Balance',   value: analytics.credit_balance,    sub: `${analytics.credits_spent_on_hires} cr on hires`, dot: 'bg-amber-400' },
            ].map(({ label, value, sub, dot }) => (
              <div key={label} className="bg-white border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{label}</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-0.5 tracking-tight">{value}</div>
                <div className="text-[10px] text-slate-400">{sub}</div>
              </div>
            ))}
          </div>

          {/* Derived efficiency metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Hours saved */}
            <div className="bg-white border border-slate-200 p-5 overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Hours Saved</p>
                  <div className="text-3xl font-bold text-teal-600 tracking-tight">{analytics.hours_saved}h</div>
                </div>
                <span className="text-[10px] text-slate-300 font-medium">~15 min / task</span>
              </div>
              <p className="text-[11px] text-slate-400">Based on {analytics.total_tasks} tasks completed by your agents</p>
            </div>

            {/* Manager approval rate */}
            <div className="bg-white border border-slate-200 p-5 overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Approval Rate</p>
                  {analytics.approval_rate === null ? (
                    <div className="text-3xl font-bold text-slate-300 tracking-tight">—</div>
                  ) : (
                    <div className="text-3xl font-bold text-emerald-600 tracking-tight">{analytics.approval_rate}%</div>
                  )}
                </div>
                <span className="text-[10px] text-slate-300 font-medium">probation tasks</span>
              </div>
              {analytics.approval_rate !== null && (
                <div className="w-full bg-slate-100 h-1">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${analytics.approval_rate}%` }}
                  />
                </div>
              )}
              {analytics.approval_rate === null && (
                <p className="text-[11px] text-slate-400">No probation tasks yet</p>
              )}
            </div>

            {/* Cost per workflow */}
            <div className="bg-white border border-slate-200 p-5 overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Cost / Workflow</p>
                  {analytics.cost_per_workflow === null ? (
                    <div className="text-3xl font-bold text-slate-300 tracking-tight">—</div>
                  ) : (
                    <div className="text-3xl font-bold text-amber-600 tracking-tight">{analytics.cost_per_workflow} cr</div>
                  )}
                </div>
                <span className="text-[10px] text-slate-300 font-medium">credits / task</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {analytics.cost_per_workflow === null
                  ? 'Run your first task to see this'
                  : `${analytics.credits_spent_on_hires} cr in hires ÷ ${analytics.total_tasks} tasks`}
              </p>
            </div>
          </div>

          {/* Weekly activity chart */}
          <div className="bg-white border border-slate-200 p-6 overflow-hidden">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Weekly Swarm Activity</p>
            <p className="text-sm font-semibold text-slate-900 mb-5">Cycles executed per week over the last 8 weeks.</p>
            {(() => {
              const max = Math.max(...analytics.tasks_per_week.map(w => w.count), 1);
              return (
                <div className="flex items-end gap-2" style={{ height: '100px' }}>
                  {analytics.tasks_per_week.map((week, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                      <span className="text-[10px] font-medium text-slate-500">{week.count > 0 ? week.count : ''}</span>
                      <div
                        className={`w-full transition-all duration-500 ${i === analytics.tasks_per_week.length - 1 ? 'bar-shimmer' : 'bg-slate-200 hover:bg-slate-300'}`}
                        style={{ height: `${Math.max((week.count / max) * 100, week.count > 0 ? 4 : 1)}%` }}
                      />
                      <span className="text-[10px] text-slate-400 font-medium uppercase">{week.label}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Tasks per agent */}
          <div className="bg-white border border-slate-200 p-6 overflow-hidden">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Tasks per Agent</p>
            <p className="text-sm font-semibold text-slate-900 mb-5">Execution cycles dispatched per autonomous unit.</p>
            {analytics.tasks_per_agent.length === 0 ? (
              <p className="text-sm text-slate-400">No tasks completed yet.</p>
            ) : (() => {
              const max = Math.max(...analytics.tasks_per_agent.map(a => a.count), 1);
              return (
                <div className="space-y-3">
                  {analytics.tasks_per_agent.map(agent => (
                    <div key={agent.agent_id} className="flex items-center gap-4">
                      <div className="w-32 shrink-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">{agent.agent_name}</p>
                      </div>
                      <div className="flex-1 bg-slate-100 h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-700"
                          style={{ width: `${(agent.count / max) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700 w-5 text-right shrink-0">{agent.count}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Agent activity log */}
          <div className="bg-white border border-slate-200 p-6 overflow-hidden">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Per-Agent Activity Log</p>
            <p className="text-sm font-semibold text-slate-900 mb-5">Expand any agent to review their raw execution transaction ledger.</p>
            {analytics.tasks_per_agent.length === 0 ? (
              <p className="text-sm text-slate-400">No agent activity yet.</p>
            ) : (
              <AgentActivityAccordion agents={analytics.tasks_per_agent} token={token} logout={logout} apiUrl={apiUrl} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
