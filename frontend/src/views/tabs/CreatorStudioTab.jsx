import React, { useState, useRef, useEffect } from 'react';
import AgentAvatar from '../../components/AgentAvatar';

const FIELDS = ['name', 'role', 'skills', 'use_cases', 'price_credits'];
const FIELD_LABELS = {
  name: 'Agent Name', role: 'Role', skills: 'Skills',
  use_cases: 'Use Cases', price_credits: 'Price (Credits/mo)',
};

function PreviewCard({ draft }) {
  const filled = FIELDS.filter(f => draft[f] != null && draft[f] !== '');
  const pct = Math.round((filled.length / FIELDS.length) * 100);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
      <div className="p-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Live Preview</p>
        <div className="flex items-center gap-3 mb-5">
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <circle cx="22" cy="22" r="18" fill="none" stroke="#10b981" strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - pct / 100)}`}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-emerald-600">{pct}%</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{draft.name || 'Unnamed Agent'}</p>
            <p className="text-xs text-slate-400 font-medium">{draft.role || 'Role TBD'}</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {FIELDS.map(f => (
            <div key={f} className={`rounded-xl px-3 py-2.5 border transition-all ${draft[f] ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{FIELD_LABELS[f]}</p>
              <p className={`text-sm font-semibold leading-snug ${draft[f] ? 'text-slate-800' : 'text-slate-300'}`}>
                {draft[f] != null ? String(draft[f]) : '—'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ManageView({ agents, bundles, apiUrl, token, onRefresh }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [bundleOpen, setBundleOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bundleForm, setBundleForm] = useState({ name: '', description: '', discount_pct: 10 });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingBundleId, setDeletingBundleId] = useState(null);

  const handleDelete = async (agentId) => {
    if (!window.confirm('Remove this agent from the marketplace? This cannot be undone.')) return;
    setDeletingId(agentId);
    await fetch(`${apiUrl}/marketplace/${agentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeletingId(null);
    onRefresh();
  };

  const handleEdit = (agent) => {
    setEditingId(agent.id);
    setEditForm({
      name: agent.name,
      role: agent.role,
      skills: Array.isArray(agent.skills) ? agent.skills.join(', ') : (agent.skills || ''),
      use_cases: Array.isArray(agent.use_cases) ? agent.use_cases.join(', ') : (agent.use_cases || ''),
      price_credits: agent.price_credits,
    });
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    const payload = {
      name: editForm.name,
      role: editForm.role,
      skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      use_cases: editForm.use_cases.split(',').map(s => s.trim()).filter(Boolean),
      price_credits: parseInt(editForm.price_credits) || 10,
    };
    await fetch(`${apiUrl}/marketplace/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setEditingId(null);
    onRefresh();
  };

  const toggleAgent = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCreateBundle = async () => {
    if (selectedIds.length < 2 || !bundleForm.name) return;
    setSaving(true);
    await fetch(`${apiUrl}/creator/bundles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...bundleForm, agent_ids: selectedIds }),
    });
    setSaving(false);
    setBundleOpen(false);
    setSelectedIds([]);
    setBundleForm({ name: '', description: '', discount_pct: 10 });
    onRefresh();
  };

  const handleDeleteBundle = async (bundleId) => {
    if (!window.confirm('Delete this bundle?')) return;
    setDeletingBundleId(bundleId);
    await fetch(`${apiUrl}/creator/bundles/${bundleId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeletingBundleId(null);
    onRefresh();
  };

  return (
    <div className="space-y-8">
      {/* My Agents */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Published</p>
            <h2 className="text-xl font-display font-bold text-slate-900">My Agents ({agents.length})</h2>
          </div>
          <button onClick={() => { setBundleOpen(v => !v); setSelectedIds([]); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${bundleOpen ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-sm shadow-emerald-500/20'}`}>
            {bundleOpen ? (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>Cancel</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>Create Bundle</>
            )}
          </button>
        </div>

        {/* Bundle creation panel */}
        {bundleOpen && (
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
            <p className="text-sm font-bold text-slate-700 mb-1">Select agents for your bundle</p>
            <p className="text-xs text-slate-400 font-medium mb-4">Minimum 2 agents required. Bundle will appear in the Marketplace.</p>
            {agents.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">Publish agents first before creating a bundle.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
                {agents.map(a => (
                  <button key={a.id} onClick={() => toggleAgent(a.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${selectedIds.includes(a.id) ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                    <AgentAvatar name={a.name} role={a.role} size={32} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{a.name}</p>
                      <p className="text-[10px] text-slate-400">{a.price_credits} cr/mo</p>
                    </div>
                    {selectedIds.includes(a.id) && (
                      <span className="ml-auto shrink-0 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {selectedIds.length >= 2 && (
              <div className="space-y-3 border-t border-slate-100 pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                    placeholder="Bundle name (e.g. Growth Squad)…"
                    value={bundleForm.name}
                    onChange={e => setBundleForm({ ...bundleForm, name: e.target.value })}
                  />
                  <input
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                    placeholder="Short description…"
                    value={bundleForm.description}
                    onChange={e => setBundleForm({ ...bundleForm, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-4 bg-slate-50 rounded-xl px-4 py-3">
                  <label className="text-sm font-bold text-slate-700 shrink-0">Discount</label>
                  <input type="range" min="5" max="40" step="5"
                    value={bundleForm.discount_pct}
                    onChange={e => setBundleForm({ ...bundleForm, discount_pct: parseInt(e.target.value) })}
                    className="flex-1 accent-emerald-500" />
                  <span className="text-sm font-extrabold text-emerald-600 w-10 text-right">{bundleForm.discount_pct}%</span>
                </div>
                <button onClick={handleCreateBundle} disabled={saving || !bundleForm.name}
                  className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-400 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {saving ? 'Publishing…' : `Publish Bundle — ${selectedIds.length} agents, ${bundleForm.discount_pct}% off`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Agent cards */}
        {agents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-16 text-center">
            <p className="text-3xl mb-3">🤖</p>
            <p className="text-slate-500 font-semibold mb-1">No agents published yet</p>
            <p className="text-slate-400 text-sm">Use AI Chat or Manual mode above to create your first agent.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {agents.map(a => (
              editingId === a.id ? (
                <div key={a.id} className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">Editing — {a.name}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {['name', 'role', 'skills', 'use_cases'].map(f => (
                      <div key={f}>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">{FIELD_LABELS[f]}</label>
                        <input
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                          value={editForm[f] || ''}
                          onChange={e => setEditForm({ ...editForm, [f]: e.target.value })}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Price (Credits/mo)</label>
                      <input type="number" min="1"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                        value={editForm.price_credits || ''}
                        onChange={e => setEditForm({ ...editForm, price_credits: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveEdit} disabled={saving}
                      className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-400 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5">
                      {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                    <button onClick={() => setEditingId(null)}
                      className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div key={a.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 group hover:border-slate-200 transition-all">
                  <AgentAvatar name={a.name} role={a.role} size={52} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-slate-900">{a.name}</p>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-widest">Live</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium truncate">{a.role}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[11px] text-slate-500 font-medium">{a.hire_count || 0} hires</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[11px] text-emerald-600 font-bold">{a.price_credits} cr/mo</span>
                      {(a.avg_rating > 0) && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[11px] text-amber-500 font-bold">★ {a.avg_rating}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(a)}
                      className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all" title="Edit agent">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button onClick={() => handleDelete(a.id)} disabled={deletingId === a.id}
                      className="p-2 rounded-xl hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all disabled:opacity-40" title="Delete agent">
                      {deletingId === a.id
                        ? <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      }
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {/* My Bundles */}
      {bundles && bundles.length > 0 && (
        <div>
          <div className="mb-5">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Teams</p>
            <h2 className="text-xl font-display font-bold text-slate-900">My Bundles ({bundles.length})</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bundles.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 relative group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{b.name}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{b.description}</p>
                  </div>
                  <button onClick={() => handleDeleteBundle(b.id)} disabled={deletingBundleId === b.id}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-40">
                    {deletingBundleId === b.id
                      ? <div className="w-3.5 h-3.5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                      : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    }
                  </button>
                </div>
                <div className="flex items-center gap-1.5 mb-3">
                  {(b.agent_ids || []).slice(0, 4).map((aid, i) => (
                    <div key={aid} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 10 - i }} className="relative">
                      <AgentAvatar name={aid} role="" size={28} />
                    </div>
                  ))}
                  {(b.agent_ids || []).length > 4 && (
                    <span className="text-[10px] font-bold text-slate-400 ml-1">+{b.agent_ids.length - 4}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">{b.discount_pct}% off</span>
                  <span className="text-xs text-slate-500 font-medium">{b.bundle_price} cr · {(b.agent_ids || []).length} agents</span>
                  <span className="ml-auto bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-widest">Live</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreatorStudioTab({
  creatorStats,
  creatorForm,
  setCreatorForm,
  handleCreateAgent,
  token,
  apiUrl,
  onRefreshStats,
}) {
  const [mode, setMode] = useState('chat'); // 'chat' | 'manual' | 'manage'
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'll help you design and publish a new AI agent. What kind of agent do you want to create?" }
  ]);
  const [input, setInput] = useState('');
  const [draft, setDraft] = useState({});
  const [complete, setComplete] = useState(false);
  const [sending, setSending] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Refresh stats when entering manage mode
  useEffect(() => {
    if (mode === 'manage' && onRefreshStats) onRefreshStats();
  }, [mode]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setSending(true);
    try {
      const res = await fetch(`${apiUrl}/creator/converse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      if (data.draft && Object.keys(data.draft).length) setDraft(prev => ({ ...prev, ...data.draft }));
      if (data.complete) setComplete(true);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    }
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handlePublish = async () => {
    setPublishing(true);
    const skills = typeof draft.skills === 'string' ? draft.skills.split(',').map(s => s.trim()) : (draft.skills || []);
    const use_cases = typeof draft.use_cases === 'string' ? draft.use_cases.split(',').map(s => s.trim()) : (draft.use_cases || []);
    const payload = { name: draft.name, role: draft.role, skills, use_cases, price_credits: parseInt(draft.price_credits) || 10 };
    await fetch(`${apiUrl}/marketplace`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    setPublished(true);
    setPublishing(false);
    if (onRefreshStats) onRefreshStats();
  };

  const publishedAgents = creatorStats?.published_agents || [];
  const publishedBundles = creatorStats?.published_bundles || [];

  const MODES = [
    { id: 'chat', label: '✦ AI Chat' },
    { id: 'manual', label: '⊞ Manual' },
    { id: 'manage', label: `⊟ My Agents${publishedAgents.length > 0 ? ` (${publishedAgents.length})` : ''}` },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Publish</p>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Creator Studio</h1>
          <p className="text-slate-500 font-medium text-lg">Design specialized agents and earn royalties on the marketplace.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 shrink-0">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${mode === m.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manage mode — full width */}
      {mode === 'manage' && (
        <ManageView
          agents={publishedAgents}
          bundles={publishedBundles}
          apiUrl={apiUrl}
          token={token}
          onRefresh={onRefreshStats || (() => {})}
        />
      )}

      {/* Create modes — 2-col layout */}
      {mode !== 'manage' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: chat or manual form */}
          <div className="lg:col-span-2">
            {mode === 'chat' ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden flex flex-col" style={{ minHeight: 500 }}>
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <span className="text-sm">✦</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Agent Builder AI</p>
                      <p className="text-xs text-emerald-500 font-medium">Powered by Gemini 2.5 Flash</p>
                    </div>
                  </div>
                  {complete && !published && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest animate-pulse">Ready to publish</span>
                  )}
                  {published && (
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest">Published ✓</span>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4" style={{ maxHeight: 380 }}>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-slate-900 text-white rounded-br-md'
                          : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-bl-md'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex justify-start">
                      <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                        {[0, 1, 2].map(i => (
                          <span key={i} className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-slate-100">
                  {published ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                      <p className="text-sm font-bold text-emerald-700">🎉 Your agent is live on the marketplace!</p>
                      <button onClick={() => { setMessages([{ role: 'assistant', content: "Hi! I'll help you design and publish a new AI agent. What kind of agent do you want to create?" }]); setDraft({}); setComplete(false); setPublished(false); }}
                        className="mt-3 text-xs font-bold text-emerald-600 underline hover:text-emerald-800">Create another agent</button>
                    </div>
                  ) : complete ? (
                    <button onClick={handlePublish} disabled={publishing}
                      className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all text-base flex items-center justify-center gap-2 disabled:opacity-60">
                      {publishing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                      {publishing ? 'Publishing…' : 'Publish to Marketplace'}
                      {!publishing && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>}
                    </button>
                  ) : (
                    <div className="flex items-end gap-3">
                      <textarea rows={1}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
                        placeholder="Describe your agent idea…"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <button onClick={sendMessage} disabled={!input.trim() || sending}
                        className="bg-slate-900 text-white w-11 h-11 rounded-xl flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-40 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
                <div className="p-8">
                  <h3 className="text-2xl font-display font-bold text-slate-900 mb-8">Publish a New Agent</h3>
                  <form onSubmit={handleCreateAgent} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Agent Name</label>
                        <input required
                          className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                          value={creatorForm.name} onChange={e => setCreatorForm({ ...creatorForm, name: e.target.value })}
                          placeholder="e.g. SEO Auditor Pro" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                        <input required
                          className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                          value={creatorForm.role} onChange={e => setCreatorForm({ ...creatorForm, role: e.target.value })}
                          placeholder="e.g. SEO Specialist" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Skills <span className="text-slate-400 font-normal">— comma separated</span></label>
                      <input required
                        className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                        value={creatorForm.skills} onChange={e => setCreatorForm({ ...creatorForm, skills: e.target.value })}
                        placeholder="Keyword Research, Analytics, Content Strategy" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Use Cases <span className="text-slate-400 font-normal">— comma separated</span></label>
                      <input required
                        className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                        value={creatorForm.use_cases} onChange={e => setCreatorForm({ ...creatorForm, use_cases: e.target.value })}
                        placeholder="Auditing websites, Writing SEO content" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Price (Credits)</label>
                      <input required type="number" min="1"
                        className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                        value={creatorForm.price_credits} onChange={e => setCreatorForm({ ...creatorForm, price_credits: e.target.value })}
                        placeholder="25" />
                    </div>
                    <button type="submit"
                      className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all text-lg flex items-center justify-center gap-2">
                      Publish to Marketplace
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {mode === 'chat' && <PreviewCard draft={draft} />}

            {creatorStats && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
                <div className="p-6">
                  <h3 className="text-lg font-display font-bold text-slate-900 mb-5">Your Earnings</h3>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-3 text-center">
                      <div className="text-2xl font-display font-extrabold text-emerald-600">{creatorStats.total_hires}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Hires</div>
                    </div>
                    <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-3 text-center">
                      <div className="text-2xl font-display font-extrabold text-emerald-600">{creatorStats.total_earnings_credits}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cr Earned</div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-5">
                    {[['Revenue share', '15% per hire'], ['Payout cycle', 'Monthly'], ['Min payout', '€10 credits']].map(([l, v]) => (
                      <div key={l} className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-xs text-slate-500 font-medium">{l}</span>
                        <span className="text-xs font-bold text-emerald-600">{v}</span>
                      </div>
                    ))}
                  </div>
                  {publishedAgents.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Published</p>
                        <button onClick={() => setMode('manage')} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">Manage →</button>
                      </div>
                      {publishedAgents.slice(0, 3).map(a => (
                        <div key={a.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                          <div className="flex items-center gap-2.5">
                            <AgentAvatar name={a.name} role={a.role} size={28} />
                            <div>
                              <p className="text-sm font-bold text-slate-800">{a.name}</p>
                              <p className="text-xs text-slate-400 font-medium">{a.hire_count || 0} hires · {a.price_credits} cr/mo</p>
                            </div>
                          </div>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">Live</span>
                        </div>
                      ))}
                      {publishedAgents.length > 3 && (
                        <button onClick={() => setMode('manage')} className="w-full text-center text-xs text-slate-400 font-medium pt-2 hover:text-emerald-600 transition-colors">
                          +{publishedAgents.length - 3} more — view all
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
