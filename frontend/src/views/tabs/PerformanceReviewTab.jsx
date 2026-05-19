import React from 'react';
import AgentAvatar from '../../components/AgentAvatar';

function StarRating({ value, count }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(value) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="text-[11px] text-slate-400 ml-0.5">{count > 0 ? `${value.toFixed(1)} (${count})` : 'No ratings'}</span>
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
    <div className="bg-white border border-slate-200 overflow-hidden mb-4">
      <div className="px-6 py-4 border-b border-slate-100">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">Growth</p>
        <h3 className="text-base font-semibold text-slate-900">Specialization Growth</h3>
      </div>
      <div className="p-6">
        <p className="text-[11px] text-slate-400 mb-5">Knowledge entries accumulated per month.</p>
        <div className="flex items-end gap-2" style={{ height: 80 }}>
          {entries.map(([month, count]) => (
            <div key={month} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
              <span className="text-[10px] font-medium text-slate-500">{count}</span>
              <div className="w-full bg-emerald-500 transition-all duration-700"
                style={{ height: `${Math.max((count / max) * 100, 8)}%` }} />
              <span className="text-[9px] text-slate-400 font-medium uppercase">
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
        className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-700 mb-6 transition-colors uppercase tracking-widest">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Team
      </button>

      {/* Header card */}
      <div className="bg-white border border-slate-200 overflow-hidden mb-4">
        <div className="p-6">
          <div className="flex items-start gap-5 mb-6 pb-6 border-b border-slate-100">
            <AgentAvatar name={performance.agent_name} role={performance.role} size={72} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Agent Profile</p>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">{performance.agent_name}</h2>
              <p className="text-sm text-slate-500 mb-3">{performance.role}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-1 border text-[10px] font-medium ${isFullTrust ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {isFullTrust ? 'Full Trust' : `Probation · Day ${performance.days_active}/30`}
                </span>
                {performance.is_official && (
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-medium px-2.5 py-1">Official</span>
                )}
                <StarRating value={performance.avg_rating || 0} count={performance.rating_count || 0} />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              ['Days Active',     performance.days_active,                             'text-emerald-600'],
              ['Tasks Done',      performance.task_count,                              'text-indigo-600'],
              ['Pending Review',  performance.pending_approvals ?? pendingTasks.length,'text-amber-600'],
              ['Dossier Entries', performance.specializations?.length ?? 0,            'text-teal-600'],
            ].map(([label, val, accent]) => (
              <div key={label} className="text-center p-4 bg-slate-50 border border-slate-100">
                <div className={`text-2xl font-bold mb-0.5 tracking-tight ${accent}`}>{val}</div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-tight">{label}</div>
              </div>
            ))}
          </div>

          {/* Autonomy bar */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium uppercase tracking-widest mb-2">
              <span>Hired</span>
              <span>Full Trust (30 days)</span>
            </div>
            <div className="bg-slate-100 h-1.5">
              <div className="bg-emerald-500 h-1.5 transition-all duration-1000"
                style={{ width: `${autonomyPct}%` }} />
            </div>
            <div className="text-right text-[10px] text-slate-400 mt-1">{autonomyPct}% to full autonomy</div>
          </div>
        </div>
      </div>

      {/* Skills & Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Skills & Capabilities</p>
          </div>
          <div className="p-5">
            {performance.skills?.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">Core Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {performance.skills.map(s => (
                    <span key={s} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-medium px-2 py-0.5">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {performance.use_cases?.length > 0 && (
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">Use Cases</p>
                <div className="flex flex-wrap gap-1.5">
                  {performance.use_cases.map(u => (
                    <span key={u} className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-medium px-2 py-0.5">{u}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Configuration</p>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {[
                ['Manager',           'You'],
                ['Budget',            `${performance.price_credits} cr / hire`],
                ['Data Access',       performance.compliance?.data_processed || 'Internal task data'],
                ['Approval Threshold', performance.probation_mode ? 'Every task (probation)' : 'Autonomous'],
                ['Autonomy',          performance.probation_mode ? 'Restricted' : 'Full'],
                ['Hired',             performance.hired_at ? new Date(performance.hired_at).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center gap-2">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest shrink-0">{label}</span>
                  <span className="text-[12px] font-medium text-slate-700 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance */}
      {performance.compliance && (
        <div className="bg-white border border-slate-200 overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">EU AI Act Compliance</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Risk Level', val: performance.compliance.risk_level },
                { label: 'Model',      val: performance.compliance.underlying_model },
                { label: 'Audit Log',  val: performance.compliance.audit_log ? 'Active' : 'Disabled', color: performance.compliance.audit_log ? 'text-emerald-600' : 'text-rose-600' },
              ].map(({ label, val, color }) => (
                <div key={label} className="p-3 bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                  <p className={`text-xs font-semibold ${color || 'text-slate-700'} capitalize`}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <SpecializationChart specializations={performance.specializations || []} />

      {/* Pending approvals */}
      {pendingTasks.length > 0 && (
        <div className="bg-white border border-amber-200 overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-amber-100">
            <p className="text-[10px] font-medium text-amber-500 uppercase tracking-widest mb-0.5">Action Required</p>
            <h3 className="text-base font-semibold text-slate-900">Pending Approval</h3>
          </div>
          <div className="p-5">
            <p className="text-[11px] text-slate-400 mb-4">Tasks waiting for your review before the agent learns from them.</p>
            <div className="space-y-2">
              {pendingTasks.map(task => (
                <div key={task.task_id} className="p-3.5 bg-amber-50 border border-amber-100">
                  <p className="text-sm font-medium text-slate-800 truncate">{task.task_description}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{new Date(task.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent tasks */}
      {recentTasks.length > 0 && (
        <div className="bg-white border border-slate-200 overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">History</p>
            <h3 className="text-base font-semibold text-slate-900">Recent Tasks</h3>
          </div>
          <div className="p-5">
            <div className="space-y-2">
              {recentTasks.map(task => (
                <div key={task.task_id} className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      {task.delegated && <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-medium px-1.5 py-0.5">A2A</span>}
                      {task.approved  && <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium px-1.5 py-0.5">Approved</span>}
                    </div>
                    <p className="text-sm font-medium text-slate-800 truncate">{task.task_description}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{new Date(task.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dossier */}
      <div className="bg-white border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">Memory</p>
          <h3 className="text-base font-semibold text-slate-900">Dossier</h3>
        </div>
        <div className="p-5">
          <p className="text-[11px] text-slate-400 mb-5">Proprietary company knowledge this agent has accumulated.</p>

          {(performance.specializations || []).length === 0 ? (
            <div className="py-14 text-center border border-dashed border-slate-200">
              <p className="text-sm text-slate-400">No entries yet — the agent learns from approved tasks.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200" />
              {performance.specializations.map((spec, idx) => (
                <div key={idx} className="flex items-start gap-5 mb-3 relative group/entry">
                  <div className="w-8 h-8 bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 z-10">
                    <span className="text-slate-500 text-xs font-bold">{idx + 1}</span>
                  </div>
                  <div className="flex-1 bg-slate-50 p-4 border border-slate-100 hover:border-slate-200 transition-all">
                    {editingDossier?.agentId === performance.agent_id && editingDossier?.idx === idx ? (
                      <div className="flex gap-2">
                        <input
                          className="flex-1 text-sm bg-white border border-slate-300 px-3 py-2 outline-none font-medium text-slate-700 focus:border-slate-400"
                          value={editingDossier.text}
                          onChange={e => setEditingDossier(p => ({ ...p, text: e.target.value }))}
                        />
                        <button onClick={handleSaveDossierEdit} className="text-xs bg-slate-900 text-white px-3 py-2 font-medium hover:bg-emerald-600 transition-all">Save</button>
                        <button onClick={() => setEditingDossier(null)} className="text-xs text-slate-400 hover:text-slate-600 px-2 font-medium transition-colors">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-medium px-2 py-0.5 inline-block mb-2">{spec.date}</span>
                          <p className="text-sm text-slate-700 leading-relaxed">{spec.skill_acquired}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover/entry:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => setEditingDossier({ agentId: performance.agent_id, idx, text: spec.skill_acquired })}
                            className="text-[11px] text-slate-400 hover:text-emerald-600 font-medium px-2 py-1 transition-colors">Edit</button>
                          <button onClick={() => handleDeleteDossierEntry(performance.agent_id, idx)}
                            className="text-[11px] text-slate-400 hover:text-rose-600 font-medium px-2 py-1 transition-colors">Delete</button>
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
