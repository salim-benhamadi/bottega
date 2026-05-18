import React from 'react';

export default function CreatorStudioTab({
  creatorStats,
  creatorForm,
  setCreatorForm,
  handleCreateAgent
}) {
  return (
    <div>
      <div className="mb-10">
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Publish</p>
        <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Creator Studio</h1>
        <p className="text-slate-500 font-medium text-lg">Design specialized agents and earn royalties on the marketplace.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings sidebar */}
        {creatorStats && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
              <div className="p-7">
                <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Your Earnings</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 text-center">
                    <div className="text-3xl font-display font-extrabold text-emerald-600">{creatorStats.total_hires}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total Hires</div>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 text-center">
                    <div className="text-3xl font-display font-extrabold text-emerald-600">{creatorStats.total_earnings_credits}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cr Earned</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[['Revenue share', '15% per hire'], ['Payout cycle', 'Monthly'], ['Min payout', '€10 credits']].map(([l, v]) => (
                    <div key={l} className="flex justify-between items-center py-2.5 border-b border-slate-100">
                      <span className="text-sm text-slate-500 font-medium">{l}</span>
                      <span className="text-sm font-bold text-emerald-600">{v}</span>
                    </div>
                  ))}
                </div>

                {creatorStats.published_agents?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Published Agents</p>
                    {creatorStats.published_agents.map(a => (
                      <div key={a.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{a.name}</p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{a.hire_count || 0} hires · {a.price_credits} cr/mo</p>
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest">Live</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Publish form */}
        <div className={creatorStats ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
            <div className="p-8">
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-8">Publish a New Agent</h3>
              <form onSubmit={handleCreateAgent} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Agent Name</label>
                    <input
                      required
                      className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                      value={creatorForm.name}
                      onChange={e => setCreatorForm({ ...creatorForm, name: e.target.value })}
                      placeholder="e.g. SEO Auditor Pro"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                    <input
                      required
                      className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                      value={creatorForm.role}
                      onChange={e => setCreatorForm({ ...creatorForm, role: e.target.value })}
                      placeholder="e.g. SEO Specialist"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Skills <span className="text-slate-400 font-normal">— comma separated</span>
                  </label>
                  <input
                    required
                    className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                    value={creatorForm.skills}
                    onChange={e => setCreatorForm({ ...creatorForm, skills: e.target.value })}
                    placeholder="Keyword Research, Analytics, Content Strategy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Use Cases <span className="text-slate-400 font-normal">— comma separated</span>
                  </label>
                  <input
                    required
                    className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                    value={creatorForm.use_cases}
                    onChange={e => setCreatorForm({ ...creatorForm, use_cases: e.target.value })}
                    placeholder="Auditing websites, Writing SEO content"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Price (Credits)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                    value={creatorForm.price_credits}
                    onChange={e => setCreatorForm({ ...creatorForm, price_credits: e.target.value })}
                    placeholder="25"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
                >
                  Publish to Marketplace
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
