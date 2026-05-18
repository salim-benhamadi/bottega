import React from 'react';
import AgentActivityAccordion from '../../components/AgentActivityAccordion';

export default function AnalyticsTab({ analytics, token, logout, apiUrl }) {
  return (
    <div>
      <div className="mb-10">
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Insights</p>
        <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Analytics</h1>
        <p className="text-slate-500 font-medium text-lg">System throughput, swarm delegation matrix, and credit velocity.</p>
      </div>

      {!analytics ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-24 text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-600">Gathering System Metrics…</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Primary stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Tasks', value: analytics.total_tasks, sub: 'operational logs', accent: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
              { label: 'Active Agents', value: analytics.active_agents, sub: 'in pipeline', accent: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
              { label: 'A2A Delegations', value: analytics.delegation_count, sub: 'swarm-orchestrated', accent: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
              { label: 'Credit Balance', value: analytics.credit_balance, sub: `${analytics.credits_spent_on_hires} cr on hires`, accent: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
            ].map(({ label, value, sub, accent, bg, border }) => (
              <div key={label} className={`${bg} rounded-2xl border ${border} p-5 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up`}>
                <div className={`text-4xl font-display font-extrabold mb-1 ${accent}`}>{value}</div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-widest">{label}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">{sub}</div>
              </div>
            ))}
          </div>

          {/* Derived efficiency metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hours saved */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 relative overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-transparent" />
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">~15 min / task</span>
              </div>
              <div className="text-3xl font-display font-extrabold text-teal-600 mb-0.5">{analytics.hours_saved}h</div>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-widest">Estimated Hours Saved</div>
              <div className="text-[10px] text-slate-400 font-medium mt-1">Based on {analytics.total_tasks} tasks completed by your agents</div>
            </div>

            {/* Manager approval rate */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 relative overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">probation tasks</span>
              </div>
              {analytics.approval_rate === null ? (
                <>
                  <div className="text-3xl font-display font-extrabold text-slate-300 mb-0.5">—</div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-widest">Manager Approval Rate</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-1">No probation tasks yet</div>
                </>
              ) : (
                <>
                  <div className="text-3xl font-display font-extrabold text-emerald-600 mb-0.5">{analytics.approval_rate}%</div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-widest">Manager Approval Rate</div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                      style={{ width: `${analytics.approval_rate}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Cost per completed workflow */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 relative overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-transparent" />
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">credits / task</span>
              </div>
              {analytics.cost_per_workflow === null ? (
                <>
                  <div className="text-3xl font-display font-extrabold text-slate-300 mb-0.5">—</div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-widest">Cost per Workflow</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-1">Run your first task to see this</div>
                </>
              ) : (
                <>
                  <div className="text-3xl font-display font-extrabold text-amber-600 mb-0.5">{analytics.cost_per_workflow} cr</div>
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-widest">Cost per Workflow</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-1">{analytics.credits_spent_on_hires} cr in hires ÷ {analytics.total_tasks} tasks</div>
                </>
              )}
            </div>
          </div>

          {/* Weekly activity chart */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
            <h3 className="text-base font-display font-bold text-slate-900 mb-0.5">Weekly Swarm Activity</h3>
            <p className="text-xs text-slate-400 font-medium mb-6">Swarm cycles executed per week over the last 8 weeks.</p>
            {(() => {
              const max = Math.max(...analytics.tasks_per_week.map(w => w.count), 1);
              return (
                <div className="flex items-end gap-2" style={{ height: '120px' }}>
                  {analytics.tasks_per_week.map((week, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                      <span className="text-[10px] font-bold text-slate-500">{week.count > 0 ? week.count : ''}</span>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${i === analytics.tasks_per_week.length - 1 ? 'bar-shimmer shadow-sm' : 'bg-slate-200 hover:bg-slate-300'}`}
                        style={{ height: `${Math.max((week.count / max) * 100, week.count > 0 ? 4 : 1)}%` }}
                      />
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{week.label}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Tasks per agent */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
            <h3 className="text-base font-display font-bold text-slate-900 mb-0.5">Tasks per Agent</h3>
            <p className="text-xs text-slate-400 font-medium mb-5">Execution cycles dispatched per autonomous unit.</p>
            {analytics.tasks_per_agent.length === 0 ? (
              <p className="text-slate-400 text-sm font-medium">No tasks completed yet.</p>
            ) : (() => {
              const max = Math.max(...analytics.tasks_per_agent.map(a => a.count), 1);
              return (
                <div className="space-y-4">
                  {analytics.tasks_per_agent.map(agent => (
                    <div key={agent.agent_id} className="flex items-center gap-4">
                      <div className="w-32 shrink-0">
                        <p className="text-sm font-bold text-slate-700 truncate">{agent.agent_name}</p>
                      </div>
                      <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                          style={{ width: `${(agent.count / max) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-extrabold text-slate-700 w-6 text-right shrink-0">{agent.count}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Agent activity log */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
            <h3 className="text-base font-display font-bold text-slate-900 mb-0.5">Per-Agent Activity Log</h3>
            <p className="text-xs text-slate-400 font-medium mb-5">Expand any agent to review their raw execution transaction ledger.</p>
            {analytics.tasks_per_agent.length === 0 ? (
              <p className="text-slate-400 text-sm font-medium">No agent activity yet.</p>
            ) : (
              <AgentActivityAccordion agents={analytics.tasks_per_agent} token={token} logout={logout} apiUrl={apiUrl} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
