import React, { useState } from 'react';

// ── Risk helpers ──────────────────────────────────────────────────────────

const RISK_CONFIG = {
  'High Risk':    { bg: 'bg-rose-50',   border: 'border-rose-200',   text: 'text-rose-700',   badge: 'bg-rose-100 text-rose-700 border-rose-200',   dot: 'bg-rose-500',   icon: '⚠️' },
  'Limited Risk': { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700 border-amber-200',  dot: 'bg-amber-500',  icon: '⚡' },
  'Minimal Risk': { bg: 'bg-emerald-50',border: 'border-emerald-200',text: 'text-emerald-700',badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',dot: 'bg-emerald-500',icon: '✓' },
};

const EVENT_CONFIG = {
  agent_deployed: { color: 'bg-blue-500',    label: 'bg-blue-50 text-blue-700 border-blue-200' },
  task_approved:  { color: 'bg-emerald-500', label: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  escalation:     { color: 'bg-amber-500',   label: 'bg-amber-50 text-amber-700 border-amber-200' },
  a2a_delegation: { color: 'bg-indigo-500',  label: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
};

function SectionHeader({ number, title, count }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center text-sm font-extrabold shrink-0">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-display font-bold text-slate-900 leading-tight">{title}</h2>
      </div>
      {count != null && (
        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-lg">{count}</span>
      )}
    </div>
  );
}

function RiskBadge({ level }) {
  const cfg = RISK_CONFIG[level] || RISK_CONFIG['Minimal Risk'];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-widest ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {level}
    </span>
  );
}

function StatCard({ value, label, sub, color = 'slate' }) {
  const colors = {
    slate:   'bg-slate-50 border-slate-200 text-slate-700',
    blue:    'bg-blue-50 border-blue-100 text-blue-700',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    amber:   'bg-amber-50 border-amber-100 text-amber-700',
    rose:    'bg-rose-50 border-rose-100 text-rose-700',
    indigo:  'bg-indigo-50 border-indigo-100 text-indigo-700',
  };
  return (
    <div className={`rounded-2xl border p-4 text-center ${colors[color]}`}>
      <p className="text-3xl font-display font-extrabold leading-tight">{value}</p>
      <p className="text-xs font-bold uppercase tracking-widest mt-1 opacity-80">{label}</p>
      {sub && <p className="text-[10px] opacity-60 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────

export default function ComplianceTab({ report, loading, onGenerate, token, apiUrl }) {
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [showAllAudit, setShowAllAudit] = useState(false);
  const [showAllApprovals, setShowAllApprovals] = useState(false);

  const handleExportJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bottega_eu_compliance_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!report?.inventory) return;
    const headers = ['ID', 'Name', 'Role', 'Risk Level', 'Autonomy', 'Model', 'Tasks', 'Approvals', 'Hired At', 'EU Data Residency'];
    const rows = report.inventory.map(a => [
      a.id, a.name, a.role, a.risk_level, a.autonomy_mode, a.underlying_model,
      a.task_count, a.approval_count, a.hired_at || '', a.eu_data_residency ? 'Yes' : 'No',
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bottega_ai_inventory_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Empty / Loading state ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5">
        <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-700 rounded-full animate-spin" style={{ borderWidth: 3 }} />
        <p className="text-slate-500 font-medium">Generating compliance report…</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div>
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-0.5 items-center">
              {/* EU flag mini */}
              <div className="w-8 h-6 rounded bg-blue-700 flex items-center justify-center">
                <span className="text-[8px] leading-none text-yellow-300 font-bold" style={{ letterSpacing: '-1px' }}>★★★</span>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">EU AI Act 2024 — Regulation (EU) 2024/1689</span>
          </div>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-3">Compliance Report</h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl">
            Generate a structured compliance document covering your AI system inventory, risk classifications, human oversight measures, and audit trail — aligned with the EU Artificial Intelligence Act.
          </p>
        </div>

        {/* What's included */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {[
            { n: '01', title: 'AI System Inventory',           desc: 'All deployed agents with model, role, and deployment metadata' },
            { n: '02', title: 'Agent Role Descriptions',       desc: 'Capabilities, skills, use cases and tool access per agent' },
            { n: '03', title: 'Data Processing Summary',       desc: 'Task volumes, data categories processed, and usage statistics' },
            { n: '04', title: 'Approval & Oversight Records',  desc: 'Human approval events and oversight checkpoint evidence' },
            { n: '05', title: 'Audit Event Log',               desc: 'Chronological log of deployments, escalations, delegations' },
            { n: '06', title: 'Risk Classification',           desc: 'Per-agent EU AI Act risk tier with classification rationale' },
            { n: '07', title: 'Responsibility Framework',      desc: 'Provider and deployer obligations under the EU AI Act' },
          ].map(s => (
            <div key={s.n} className="bg-white rounded-2xl border border-slate-100 p-5">
              <p className="text-2xl font-display font-extrabold text-slate-200 mb-2">{s.n}</p>
              <p className="text-sm font-bold text-slate-800 mb-1">{s.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onGenerate}
          className="bg-blue-800 text-white px-10 py-4 rounded-2xl font-bold text-base hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-900/20 flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          Generate Compliance Report
        </button>
      </div>
    );
  }

  // ── Report view ──
  const { inventory, data_summary: ds, approval_records, audit_events, responsibility_framework: rf } = report;
  const auditShown = showAllAudit ? audit_events : audit_events?.slice(0, 8);
  const approvalsShown = showAllApprovals ? approval_records : approval_records?.slice(0, 6);

  return (
    <div className="print:text-sm">
      {/* Report header ────────────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6 print:mb-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-7 rounded bg-blue-700 flex items-center justify-center shrink-0">
              <div className="flex flex-col gap-0.5 items-center">
                <div className="flex gap-0.5">{[0,1,2].map(i=><span key={i} className="text-[5px] text-yellow-300">★</span>)}</div>
                <div className="flex gap-0.5">{[0,1,2,3].map(i=><span key={i} className="text-[5px] text-yellow-300">★</span>)}</div>
                <div className="flex gap-0.5">{[0,1,2].map(i=><span key={i} className="text-[5px] text-yellow-300">★</span>)}</div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">EU Artificial Intelligence Act</p>
              <p className="text-[10px] text-slate-400 font-medium">Regulation (EU) 2024/1689 — Compliance Documentation</p>
            </div>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 mb-1">AI Compliance Report</h1>
          <div className="flex items-center flex-wrap gap-3 mt-2">
            <span className="text-xs text-slate-500 font-medium">Organisation: <strong className="text-slate-800">{report.deployer_org}</strong></span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-500 font-medium">Platform: <strong className="text-slate-800">{report.platform}</strong></span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-xs text-slate-500 font-medium">Generated: <strong className="text-slate-800">{new Date(report.generated_at).toLocaleString()}</strong></span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 print:hidden">
          <button onClick={onGenerate} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:border-blue-300 hover:text-blue-700 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Refresh
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:border-blue-300 hover:text-blue-700 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            CSV
          </button>
          <button onClick={handleExportJSON} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:border-blue-300 hover:text-blue-700 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            JSON
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-900/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print
          </button>
        </div>
      </div>

      {/* Risk summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard value={ds?.total_agents_deployed ?? 0} label="Agents Deployed" color="blue" />
        <StatCard value={ds?.high_risk_agents ?? 0} label="High Risk" sub="Annex III" color="rose" />
        <StatCard value={ds?.limited_risk_agents ?? 0} label="Limited Risk" sub="Art. 52" color="amber" />
        <StatCard value={ds?.minimal_risk_agents ?? 0} label="Minimal Risk" sub="General practice" color="emerald" />
      </div>

      <div className="space-y-8">

        {/* ── Section 1: AI System Inventory ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <SectionHeader number="01" title="AI System Inventory" count={inventory?.length} />
            <p className="text-xs text-slate-500 -mt-2">All AI agents deployed on this account and their technical metadata.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Agent ID','Name','Role','Underlying Model','Autonomy','Risk Level','Tasks','Deployed'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(inventory || []).map((a, i) => (
                  <tr key={a.id} className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                    <td className="px-4 py-3 font-mono text-slate-400 text-[10px]">{a.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">{a.name}</td>
                    <td className="px-4 py-3 text-slate-600">{a.role}</td>
                    <td className="px-4 py-3 text-slate-500">{a.underlying_model}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest ${a.autonomy_mode.includes('Probation') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {a.autonomy_mode.includes('Probation') ? 'Supervised' : 'Autonomous'}
                      </span>
                    </td>
                    <td className="px-4 py-3"><RiskBadge level={a.risk_level} /></td>
                    <td className="px-4 py-3 text-slate-600 tabular-nums">{a.task_count}</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{a.hired_at ? new Date(a.hired_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
                {(!inventory || inventory.length === 0) && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400 font-medium">No agents deployed yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Section 2: Agent Role Descriptions ─────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader number="02" title="Agent Role Descriptions" count={inventory?.length} />
          <p className="text-xs text-slate-500 -mt-4 mb-6">Purpose, capabilities, and data access scope for each deployed AI agent.</p>
          <div className="space-y-3">
            {(inventory || []).map(a => (
              <div key={a.id} className="border border-slate-100 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors text-left"
                  onClick={() => setExpandedAgent(expandedAgent === a.id ? null : a.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-xs shrink-0">
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{a.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{a.role}</p>
                    </div>
                    <RiskBadge level={a.risk_level} />
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${expandedAgent === a.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                {expandedAgent === a.id && (
                  <div className="px-4 pb-4 bg-slate-50 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Skills & Capabilities</p>
                        <div className="flex flex-wrap gap-1">
                          {a.skills.map(s => <span key={s} className="bg-white border border-slate-200 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md">{s}</span>)}
                          {a.skills.length === 0 && <span className="text-slate-400 text-xs">—</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Use Cases</p>
                        <div className="flex flex-wrap gap-1">
                          {a.use_cases.map(u => <span key={u} className="bg-white border border-slate-200 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md">{u}</span>)}
                          {a.use_cases.length === 0 && <span className="text-slate-400 text-xs">—</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Connected Tools</p>
                        <p className="text-xs text-slate-600">{a.allowed_tools.length > 0 ? a.allowed_tools.join(', ') : 'No tools assigned'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Data Processed</p>
                        <p className="text-xs text-slate-600">{a.data_processed}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">EU Data Residency</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${a.eu_data_residency ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                          {a.eu_data_residency ? 'Enabled' : 'Not guaranteed'}
                        </span>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Audit Logging</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${a.audit_log_enabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                          {a.audit_log_enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 3: Data Processing Summary ─────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader number="03" title="Data Processing Summary" />
          <p className="text-xs text-slate-500 -mt-4 mb-6">Aggregate statistics on AI-processed tasks and human oversight engagement.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
            <StatCard value={ds?.total_tasks_executed ?? 0} label="Tasks Executed" color="blue" />
            <StatCard value={ds?.tasks_approved ?? 0} label="Human-Approved" color="emerald" />
            <StatCard value={ds?.tasks_escalated ?? 0} label="Escalated" color="amber" />
            <StatCard value={ds?.a2a_delegations ?? 0} label="A2A Delegations" color="indigo" />
            <StatCard value={ds?.agents_in_probation ?? 0} label="Supervised Agents" sub="Probation mode" color="amber" />
            <StatCard value={ds?.agents_autonomous ?? 0} label="Autonomous Agents" color="emerald" />
            <StatCard value={ds?.tasks_pending_approval ?? 0} label="Pending Review" color="rose" />
            <StatCard value={ds?.total_agents_deployed ?? 0} label="Total Deployed" color="slate" />
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-700 mb-1">Human Oversight Rate</p>
            {(() => {
              const total = ds?.total_tasks_executed || 1;
              const overseen = (ds?.tasks_approved || 0) + (ds?.tasks_escalated || 0);
              const pct = Math.round((overseen / total) * 100);
              return (
                <>
                  <div className="h-2 bg-blue-100 rounded-full overflow-hidden mb-1.5">
                    <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <p className="text-xs text-blue-600 font-medium">{pct}% of tasks involved human oversight ({overseen} / {total})</p>
                </>
              );
            })()}
          </div>
        </div>

        {/* ── Section 4: Approval & Oversight Records ─────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader number="04" title="Human Approval Records" count={approval_records?.length} />
          <p className="text-xs text-slate-500 -mt-4 mb-6">Tasks that required or received explicit human review — evidence of oversight compliance.</p>
          {(!approvalsShown || approvalsShown.length === 0) ? (
            <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <p className="font-medium">No approval events recorded yet.</p>
              <p className="text-xs mt-1">Tasks requiring human approval will appear here.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2.5">
                {approvalsShown.map((t, i) => (
                  <div key={t.task_id || i} className={`rounded-xl border p-4 ${t.status === 'approved' ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 mb-1">{t.task_description || '(no description)'}</p>
                        <p className="text-[10px] text-slate-500">Agent: {t.agent_name} · {t.timestamp ? new Date(t.timestamp).toLocaleString() : '—'}</p>
                      </div>
                      <span className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${t.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {(approval_records?.length || 0) > 6 && (
                <button onClick={() => setShowAllApprovals(v => !v)} className="mt-4 w-full text-xs text-blue-700 font-bold py-2 hover:bg-blue-50 rounded-xl transition-colors">
                  {showAllApprovals ? '↑ Show less' : `↓ Show all ${approval_records.length} records`}
                </button>
              )}
            </>
          )}
        </div>

        {/* ── Section 5: Audit Event Log ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader number="05" title="Audit Event Log" count={audit_events?.length} />
          <p className="text-xs text-slate-500 -mt-4 mb-6">Chronological record of significant AI system events for traceability and accountability.</p>
          {(!audit_events || audit_events.length === 0) ? (
            <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <p className="font-medium">No audit events yet.</p>
            </div>
          ) : (
            <>
              <div className="relative pl-5">
                <div className="absolute left-1.5 top-0 bottom-0 w-px bg-slate-200" />
                <div className="space-y-4">
                  {auditShown.map((e, i) => {
                    const cfg = EVENT_CONFIG[e.event] || { color: 'bg-slate-400', label: 'bg-slate-50 text-slate-700 border-slate-200' };
                    return (
                      <div key={i} className="relative">
                        <div className={`absolute -left-5 top-1.5 w-3 h-3 rounded-full border-2 border-white ${cfg.color}`} />
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest ${cfg.label}`}>
                                {e.event.replace(/_/g, ' ')}
                              </span>
                              <p className="text-xs font-bold text-slate-800">{e.label}</p>
                            </div>
                            {e.detail && <p className="text-[10px] text-slate-500 leading-relaxed">{e.detail}</p>}
                          </div>
                          <p className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">{e.timestamp ? new Date(e.timestamp).toLocaleString() : '—'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {(audit_events?.length || 0) > 8 && (
                <button onClick={() => setShowAllAudit(v => !v)} className="mt-5 w-full text-xs text-blue-700 font-bold py-2 hover:bg-blue-50 rounded-xl transition-colors">
                  {showAllAudit ? '↑ Collapse' : `↓ Show all ${audit_events.length} events`}
                </button>
              )}
            </>
          )}
        </div>

        {/* ── Section 6: Risk Classification ──────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader number="06" title="Risk Classification" count={inventory?.length} />
          <p className="text-xs text-slate-500 -mt-4 mb-6">Each agent classified according to EU AI Act risk tiers based on role and use cases.</p>
          {['High Risk', 'Limited Risk', 'Minimal Risk'].map(level => {
            const agents = (inventory || []).filter(a => a.risk_level === level);
            if (agents.length === 0) return null;
            const cfg = RISK_CONFIG[level];
            return (
              <div key={level} className={`mb-5 rounded-xl border ${cfg.border} ${cfg.bg} p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <h3 className={`text-sm font-bold ${cfg.text}`}>{level} <span className="font-medium opacity-70">({agents.length} agent{agents.length !== 1 ? 's' : ''})</span></h3>
                </div>
                <p className={`text-[10px] ${cfg.text} opacity-80 leading-relaxed mb-3`}>{agents[0]?.risk_rationale}</p>
                <div className="space-y-2">
                  {agents.map(a => (
                    <div key={a.id} className="bg-white/70 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{a.name}</p>
                        <p className="text-[10px] text-slate-500">{a.role} · {a.task_count} tasks · {a.autonomy_mode}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest ${a.eu_data_residency ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {a.eu_data_residency ? 'EU residency ✓' : 'No residency guarantee'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Section 7: Responsibility Framework ─────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader number="07" title="Provider & Deployer Responsibilities" />
          <p className="text-xs text-slate-500 -mt-4 mb-6">Obligations under EU AI Act 2024 allocated between Bottega (provider) and {report.deployer_org} (deployer).</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-800 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                </div>
                <p className="text-sm font-bold text-blue-900">Provider — Bottega</p>
              </div>
              <ul className="space-y-2.5">
                {(rf?.provider_obligations || []).map((o, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-700 leading-relaxed">
                    <span className="text-blue-500 font-bold shrink-0 mt-0.5">→</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <p className="text-sm font-bold text-slate-800">Deployer — {report.deployer_org}</p>
              </div>
              <ul className="space-y-2.5">
                {(rf?.deployer_obligations || []).map((o, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-700 leading-relaxed">
                    <span className="text-slate-400 font-bold shrink-0 mt-0.5">→</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <p className="text-sm font-bold text-emerald-900">Human Oversight Measures</p>
            </div>
            <ul className="space-y-2.5">
              {(rf?.human_oversight_measures || []).map((m, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-700 leading-relaxed">
                  <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer ──────────────────────────────────────────────────────────── */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            This report was generated by <strong className="text-slate-600">Bottega AI Workforce Manager</strong> on{' '}
            <strong className="text-slate-600">{new Date(report.generated_at).toLocaleString()}</strong> for{' '}
            <strong className="text-slate-600">{report.deployer_org}</strong> ({report.deployer_email}).
            <br />
            Framework reference: <strong className="text-slate-600">{report.framework}</strong>.
            This document serves as self-assessment documentation and does not constitute a legal opinion or regulatory approval.
          </p>
        </div>

      </div>
    </div>
  );
}
