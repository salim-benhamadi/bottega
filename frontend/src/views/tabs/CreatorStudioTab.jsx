import React, { useState, useRef, useEffect } from 'react';

const FIELDS = ['name', 'role', 'skills', 'use_cases', 'price_credits'];
const FIELD_LABELS = { name: 'Agent Name', role: 'Role', skills: 'Skills', use_cases: 'Use Cases', price_credits: 'Price (Credits/mo)' };

function PreviewCard({ draft }) {
  const filled = FIELDS.filter(f => draft[f] != null && draft[f] !== '');
  const pct = Math.round((filled.length / FIELDS.length) * 100);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
      <div className="p-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Live Preview</p>

        {/* Progress ring */}
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

export default function CreatorStudioTab({
  creatorStats,
  creatorForm,
  setCreatorForm,
  handleCreateAgent,
  token,
  apiUrl,
}) {
  const [mode, setMode] = useState('chat'); // 'chat' | 'manual'
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
    } catch (e) {
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
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Publish</p>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Creator Studio</h1>
          <p className="text-slate-500 font-medium text-lg">Design specialized agents and earn royalties on the marketplace.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1.5 shrink-0">
          {['chat', 'manual'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === m ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              {m === 'chat' ? '✦ AI Chat' : '⊞ Manual'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: chat or manual form */}
        <div className={creatorStats ? 'lg:col-span-2' : 'lg:col-span-3'}>
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

              {/* Messages */}
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

              {/* Input */}
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
                    <textarea
                      rows={1}
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
            /* Manual form — unchanged */
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

        {/* Right sidebar: preview card (chat mode) or earnings (always) */}
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
                {creatorStats.published_agents?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Published</p>
                    {creatorStats.published_agents.map(a => (
                      <div key={a.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{a.name}</p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{a.hire_count || 0} hires · {a.price_credits} cr/mo</p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">Live</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
