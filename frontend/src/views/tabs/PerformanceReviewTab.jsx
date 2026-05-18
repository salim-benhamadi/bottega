import React from 'react';

function SpecializationChart({ specializations }) {
  if (specializations.length === 0) return null;
  // Group by month
  const counts = {};
  specializations.forEach(s => {
    const month = s.date ? s.date.slice(0, 7) : 'Unknown';
    counts[month] = (counts[month] || 0) + 1;
  });
  const entries = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
  const max = Math.max(...entries.map(([,v]) => v), 1);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden mb-5">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
      <div className="p-7">
        <h3 className="text-lg font-display font-bold text-slate-900 mb-0.5">Specialization Growth</h3>
        <p className="text-xs text-slate-500 font-medium mb-5">Knowledge entries accumulated per month.</p>
        <div className="flex items-end gap-3" style={{ height: 80 }}>
          {entries.map(([month, count]) => (
            <div key={month} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
              <span className="text-[10px] font-bold text-slate-500">{count}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-teal-400 transition-all duration-700"
                style={{ height: `${Math.max((count / max) * 100, 8)}%` }}
              />
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                {new Date(month + '-01').toLocaleDateString('en', { month: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PerformanceReviewTab({
  performance,
  agentTasks,
  editingDossier,
  setEditingDossier,
  handleSaveDossierEdit,
  handleDeleteDossierEntry,
  setActiveTab
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => setActiveTab('team')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 mb-6 transition-colors uppercase tracking-widest">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
        Back to Team
      </button>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden mb-5">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
        <div className="p-7">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7 pb-7 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Performance Review</p>
              <h2 className="text-3xl font-display font-extrabold text-slate-900">{performance.agent_name}</h2>
            </div>
            <span className={`px-4 py-2 rounded-xl border text-sm font-bold ${performance.days_active >= 30 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
              {performance.days_active >= 30 ? '30-Day Review Complete ✓' : `Day ${performance.days_active} of 30`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-7">
            {[['Days Active', performance.days_active], ['Tasks Done', performance.task_count], ['Specializations', performance.specializations.length]].map(([label, val]) => (
              <div key={label} className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-3xl font-display font-extrabold text-emerald-600 mb-0.5">{val}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
              <span>Hired</span>
              <span>Full Trust (30 days)</span>
            </div>
            <div className="bg-slate-100 rounded-full h-2">
              <div
                className="bg-emerald-500 rounded-full h-2 transition-all duration-1000"
                style={{ width: `${Math.min(100, (performance.days_active / 30) * 100)}%` }}
              />
            </div>
            <div className="text-right text-[10px] text-slate-400 font-medium mt-1">
              {Math.min(100, Math.round((performance.days_active / 30) * 100))}% to full autonomy
            </div>
          </div>
        </div>
      </div>

      <SpecializationChart specializations={performance.specializations} />

      {/* Recent activity */}
      {agentTasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden mb-5">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
          <div className="p-7">
            <h3 className="text-lg font-display font-bold text-slate-900 mb-0.5">Recent Activity</h3>
            <p className="text-xs text-slate-500 font-medium mb-5">Last {agentTasks.length} tasks completed by this agent.</p>
            <div className="space-y-2.5">
              {agentTasks.map(task => (
                <div key={task.task_id} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {task.delegated && <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-md">A2A</span>}
                      {task.pending_approval && <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-md">Pending</span>}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 truncate">{task.task_description}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{new Date(task.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Specialization timeline */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
        <div className="p-7">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-0.5">Specialization Timeline</h3>
          <p className="text-xs text-slate-500 font-medium mb-6">Proprietary company knowledge — edit or delete any entry.</p>

          {performance.specializations.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <p className="text-slate-400 font-medium">No specializations yet.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-emerald-100 rounded-full" />
              {performance.specializations.map((spec, idx) => (
                <div key={idx} className="flex items-start gap-5 mb-4 relative group/entry">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 z-10">
                    <span className="text-emerald-600 text-xs font-bold">{idx + 1}</span>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-emerald-200 transition-all">
                    {editingDossier?.agentId === performance.agent_id && editingDossier?.idx === idx ? (
                      <div className="flex gap-2">
                        <input
                          className="flex-1 text-sm bg-white border border-emerald-300 rounded-xl px-3 py-2 outline-none font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/10"
                          value={editingDossier.text}
                          onChange={e => setEditingDossier(p => ({ ...p, text: e.target.value }))}
                        />
                        <button onClick={handleSaveDossierEdit} className="text-xs bg-emerald-500 text-white px-3 py-2 rounded-xl font-bold hover:bg-emerald-400 transition-all">Save</button>
                        <button onClick={() => setEditingDossier(null)} className="text-xs text-slate-400 hover:text-slate-600 px-2 font-semibold transition-colors">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest inline-block mb-2">{spec.date}</span>
                          <p className="text-sm text-slate-700 font-medium leading-relaxed">{spec.skill_acquired}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover/entry:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => setEditingDossier({ agentId: performance.agent_id, idx, text: spec.skill_acquired })}
                            className="text-xs text-slate-400 hover:text-emerald-600 font-semibold px-2 py-1 rounded-lg transition-colors">Edit</button>
                          <button onClick={() => handleDeleteDossierEntry(performance.agent_id, idx)}
                            className="text-xs text-slate-400 hover:text-rose-600 font-semibold px-2 py-1 rounded-lg transition-colors">Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
