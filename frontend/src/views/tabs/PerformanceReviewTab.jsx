import React from 'react';
import AgentAvatar from '../../components/AgentAvatar';

function StarRating({ value, count }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(value) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="text-xs text-slate-400 font-medium ml-0.5">{count > 0 ? `${value.toFixed(1)} (${count})` : 'No ratings'}</span>
    </div>
  );
}

function SpecializationChart({ specializations }) {
  if (specializations.length === 0) return null;
  const counts = {};
  specializations.forEach(s => {
    const month = s.date ? s.date.slice(0, 7) : 'Unknown';
    counts[month] = (counts[month] || 0) + 1;
  });
  const entries = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
  const max = Math.max(...entries.map(([, v]) => v), 1);
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
              <div className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-teal-400 transition-all duration-700"
                style={{ height: `${Math.max((count / max) * 100, 8)}%` }} />
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
  setActiveTab,
}) {
  if (!performance) return null;

  const isFullTrust = !performance.probation_mode && performance.days_active >= 30;
  const autonomyPct = Math.min(100, Math.round((performance.days_active / 30) * 100));

  const pendingTasks = agentTasks.filter(t => t.pending_approval);
  const recentTasks  = agentTasks.filter(t => !t.pending_approval).slice(0, 10);

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => setActiveTab('team')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 mb-6 transition-colors uppercase tracking-widest">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Team
      </button>

      {/* ── Header card with avatar ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden mb-5">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
        <div className="p-7">
          <div className="flex items-start gap-5 mb-7 pb-7 border-b border-slate-100">
            <AgentAvatar name={performance.agent_name} role={performance.role} size={88} className="rounded-2xl ring-4 ring-white shadow-lg" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Agent Profile</p>
              <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-1">{performance.agent_name}</h2>
              <p className="text-sm font-semibold text-slate-500 mb-3">{performance.role}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${isFullTrust ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                  {isFullTrust ? 'Full Trust' : `Probation · Day ${performance.days_active}/30`}
                </span>
                {performance.is_official && (
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold px-3 py-1 rounded-lg">Official</span>
                )}
                <StarRating value={performance.avg_rating || 0} count={performance.rating_count || 0} />
              </div>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-4 gap-3 mb-7">
            {[
              ['Days Active',      performance.days_active,                    'text-emerald-600'],
              ['Tasks Done',       performance.task_count,                     'text-indigo-600'],
              ['Pending Review',   performance.pending_approvals ?? pendingTasks.length, 'text-amber-600'],
              ['Dossier Entries',  performance.specializations?.length ?? 0,   'text-teal-600'],
            ].map(([label, val, accent]) => (
              <div key={label} className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className={`text-2xl font-display font-extrabold mb-0.5 ${accent}`}>{val}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">{label}</div>
              </div>
            ))}
          </div>

          {/* ── Autonomy bar ── */}
          <div className="mb-0">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
              <span>Hired</span>
              <span>Full Trust (30 days)</span>
            </div>
            <div className="bg-slate-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full h-2 transition-all duration-1000"
                style={{ width: `${autonomyPct}%` }} />
            </div>
            <div className="text-right text-[10px] text-slate-400 font-medium mt-1">{autonomyPct}% to full autonomy</div>
          </div>
        </div>
      </div>

      {/* ── Profile details ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

        {/* Skills & Use Cases */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent" />
          <div className="p-6">
            <h3 className="text-sm font-display font-bold text-slate-900 mb-4">Skills & Capabilities</h3>
            {performance.skills?.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Core Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {performance.skills.map(s => (
                    <span key={s} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2.5 py-1 rounded-lg">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {performance.use_cases?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Allowed Tools / Use Cases</p>
                <div className="flex flex-wrap gap-1.5">
                  {performance.use_cases.map(u => (
                    <span key={u} className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-lg">{u}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Operational config */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-transparent" />
          <div className="p-6">
            <h3 className="text-sm font-display font-bold text-slate-900 mb-4">Configuration</h3>
            <div className="space-y-3">
              {[
                ['Manager',           'You'],
                ['Budget',            `${performance.price_credits} cr / hire`],
                ['Data Access',       performance.compliance?.data_processed || 'Internal task data'],
                ['Approval Threshold', performance.probation_mode ? 'Every task (probation)' : 'Autonomous'],
                ['Current Autonomy',  performance.probation_mode ? 'Restricted' : 'Full'],
                ['Hired',             performance.hired_at ? new Date(performance.hired_at).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">{label}</span>
                  <span className="text-xs font-semibold text-slate-700 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Compliance ── */}
      {performance.compliance && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden mb-5">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-transparent" />
          <div className="p-6">
            <h3 className="text-sm font-display font-bold text-slate-900 mb-4">EU AI Act Compliance</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Level</p>
                <p className="text-xs font-bold text-slate-700 capitalize">{performance.compliance.risk_level}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Model</p>
                <p className="text-xs font-bold text-slate-700">{performance.compliance.underlying_model}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Audit Log</p>
                <p className={`text-xs font-bold ${performance.compliance.audit_log ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {performance.compliance.audit_log ? 'Active ✓' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <SpecializationChart specializations={performance.specializations || []} />

      {/* ── Pending approvals ── */}
      {pendingTasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm relative overflow-hidden mb-5">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-transparent" />
          <div className="p-7">
            <h3 className="text-lg font-display font-bold text-slate-900 mb-0.5">Pending Approval</h3>
            <p className="text-xs text-slate-500 font-medium mb-5">Tasks waiting for your review before the agent learns from them.</p>
            <div className="space-y-2.5">
              {pendingTasks.map(task => (
                <div key={task.task_id} className="p-3.5 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-sm font-semibold text-slate-800 truncate">{task.task_description}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{new Date(task.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Recent tasks ── */}
      {recentTasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden mb-5">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
          <div className="p-7">
            <h3 className="text-lg font-display font-bold text-slate-900 mb-0.5">Recent Tasks</h3>
            <p className="text-xs text-slate-500 font-medium mb-5">Last {recentTasks.length} completed tasks.</p>
            <div className="space-y-2.5">
              {recentTasks.map(task => (
                <div key={task.task_id} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {task.delegated && <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-md">A2A</span>}
                      {task.approved  && <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md">Approved</span>}
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

      {/* ── Dossier / Memory ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
        <div className="p-7">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-0.5">Dossier / Memory</h3>
          <p className="text-xs text-slate-500 font-medium mb-6">Proprietary company knowledge this agent has accumulated.</p>

          {(performance.specializations || []).length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <p className="text-slate-400 font-medium">No entries yet — the agent learns from approved tasks.</p>
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
