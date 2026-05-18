import React, { useState } from 'react';
import StarRating from '../../components/StarRating';
import AgentAvatar from '../../components/AgentAvatar';

const COLOR_MAP = {
  green: {
    accent: '#22c55e',
    badge: 'bg-green-100 text-green-700 border border-green-200',
    button: 'bg-green-500 hover:bg-green-400 text-white',
    border: 'border-green-200',
    strip: 'from-green-400 to-emerald-400',
  },
  indigo: {
    accent: '#6366f1',
    badge: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    button: 'bg-indigo-500 hover:bg-indigo-400 text-white',
    border: 'border-indigo-200',
    strip: 'from-indigo-400 to-purple-400',
  },
  purple: {
    accent: '#a855f7',
    badge: 'bg-purple-100 text-purple-700 border border-purple-200',
    button: 'bg-purple-500 hover:bg-purple-400 text-white',
    border: 'border-purple-200',
    strip: 'from-purple-400 to-fuchsia-400',
  },
  teal: {
    accent: '#14b8a6',
    badge: 'bg-teal-100 text-teal-700 border border-teal-200',
    button: 'bg-teal-500 hover:bg-teal-400 text-white',
    border: 'border-teal-200',
    strip: 'from-teal-400 to-cyan-400',
  },
  amber: {
    accent: '#f59e0b',
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    button: 'bg-amber-500 hover:bg-amber-400 text-white',
    border: 'border-amber-200',
    strip: 'from-amber-400 to-orange-400',
  },
};

function BundleCard({ bundle, onHire }) {
  const [confirming, setConfirming] = useState(false);
  const colors = COLOR_MAP[bundle.color] || COLOR_MAP.green;
  const savings = bundle.individual_total - bundle.bundle_price;

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm flex flex-col relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${colors.border}`}
      style={{ minWidth: 280, maxWidth: 320 }}
    >
      {/* Top accent gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.strip}`} />

      {/* Discount badge */}
      <div
        className={`absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-widest ${colors.badge}`}
      >
        {bundle.discount_pct}% OFF
      </div>

      <div className="p-5 pt-6 flex-1 flex flex-col">
        <h3 className="text-base font-display font-bold text-slate-900 mb-1 pr-16">{bundle.name}</h3>
        <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">{bundle.description}</p>

        {/* Agent avatar strip */}
        <div className="flex items-center mb-3" style={{ gap: 0 }}>
          {bundle.agents.map((agent, i) => (
            <div
              key={agent.id}
              className="rounded-xl overflow-hidden border-2 border-white"
              style={{ marginLeft: i === 0 ? 0 : -8, zIndex: i }}
            >
              <AgentAvatar name={agent.name} role={agent.role} size={32} />
            </div>
          ))}
        </div>

        {/* Agent name chips */}
        <div className="flex flex-wrap gap-1 mb-4">
          {bundle.agents.map(agent => (
            <span
              key={agent.id}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${agent.is_hired ? 'bg-slate-100 text-slate-400 line-through' : 'bg-slate-100 text-slate-600'}`}
            >
              {agent.name}
            </span>
          ))}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-slate-400 text-sm line-through font-medium">{bundle.individual_total} cr</span>
          <span className="text-2xl font-display font-extrabold text-slate-900">{bundle.bundle_price} cr</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${colors.badge}`}>
            Save {savings} cr
          </span>
        </div>

        {/* CTA */}
        {bundle.is_all_hired ? (
          <button
            disabled
            className="w-full bg-slate-100 text-slate-400 border border-slate-200 rounded-2xl py-2.5 text-sm font-bold cursor-default flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
            All Hired
          </button>
        ) : confirming ? (
          <div className="flex items-center gap-1.5 animate-fade-in-up">
            <span className="text-xs font-bold text-slate-600">{bundle.bundle_price} cr</span>
            <button
              onClick={() => { onHire(bundle.id); setConfirming(false); }}
              className="flex-1 bg-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-bold hover:bg-emerald-400 active:scale-95 transition-all"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className={`w-full rounded-2xl py-2.5 text-sm font-bold active:scale-95 transition-all flex items-center justify-center gap-2 ${colors.button}`}
          >
            Hire Team — {bundle.bundle_price} cr
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function MarketplaceTab({
  marketplace,
  marketplaceSearch,
  setMarketplaceSearch,
  marketplaceFilter,
  setMarketplaceFilter,
  agentRatings,
  ratingInputs,
  setRatingInputs,
  reviewInputs,
  setReviewInputs,
  loadRatings,
  handleRateAgent,
  setComplianceAgent,
  handleHire,
  bundles = [],
  handleHireBundle,
}) {
  const [confirmingHire, setConfirmingHire] = useState(null);

  const filteredMarketplace = marketplace.filter(agent => {
    const term = marketplaceSearch.toLowerCase();
    const matchesSearch = agent.name.toLowerCase().includes(term) ||
      agent.role.toLowerCase().includes(term) ||
      agent.skills.some(s => s.toLowerCase().includes(term));
    if (!matchesSearch) return false;
    if (marketplaceFilter === 'official') return agent.is_official;
    if (marketplaceFilter === 'community') return !agent.is_official;
    return true;
  });

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Hire</p>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Marketplace</h1>
          <p className="text-slate-500 font-medium text-lg">{filteredMarketplace.length} of {marketplace.length} specialized agents available.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all w-56"
              placeholder="Search agents…"
              value={marketplaceSearch}
              onChange={e => setMarketplaceSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 rounded-xl p-1">
            {['all', 'official', 'community'].map(f => (
              <button key={f} onClick={() => setMarketplaceFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${marketplaceFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {f === 'all' ? 'All' : f === 'official' ? 'Official' : 'Community'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Team Bundles ── */}
      {bundles.length > 0 && (
        <div className="mb-10">
          <div className="mb-4">
            <h2 className="text-xl font-display font-bold text-slate-900 mb-0.5">Team Bundles</h2>
            <p className="text-sm text-slate-500 font-medium">Hire a complete team at a discounted rate</p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
            {bundles.map(bundle => (
              <BundleCard key={bundle.id} bundle={bundle} onHire={handleHireBundle} />
            ))}
          </div>
        </div>
      )}

      {/* ── Individual Agents ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredMarketplace.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
            <p className="text-slate-400 font-medium">No agents match your search.</p>
          </div>
        )}
        {filteredMarketplace.map(agent => (
          <div key={agent.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200/50 transition-all duration-200">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <AgentAvatar name={agent.name} role={agent.role} size={48} />
                <div className="flex flex-col items-end gap-1">
                  {agent.is_official
                    ? <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-widest flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500" />Official</span>
                    : <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-widest">Community</span>}
                  {agent.compliance?.risk_level === 'Medium' && <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-widest">Med Risk</span>}
                  {agent.id === 'a5' && <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-widest">Speechmatics</span>}
                </div>
              </div>

              <h3 className="text-lg font-display font-bold text-slate-900 mb-0.5">{agent.name}</h3>
              <p className="text-xs font-medium text-slate-500 mb-3">{agent.role}</p>

              <div className="flex items-center gap-2 mb-4">
                <StarRating value={Math.round(agentRatings[agent.id]?.avg ?? agent.avg_rating ?? 0)} readonly size="text-sm" />
                <span className="text-xs text-slate-600 font-bold">
                  {(agentRatings[agent.id]?.avg ?? agent.avg_rating ?? 0).toFixed(1)}
                  <span className="text-slate-400 font-medium ml-1">({agentRatings[agent.id]?.count ?? agent.rating_count ?? 0})</span>
                </span>
                {agent.hire_count > 0 && <><span className="w-1 h-1 rounded-full bg-slate-300" /><span className="text-xs text-slate-400 font-medium">{agent.hire_count} hired</span></>}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {agent.skills.map(s => <span key={s} className="bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-semibold px-2 py-0.5 rounded-md">{s}</span>)}
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Capabilities</p>
                <ul className="space-y-1.5">
                  {agent.use_cases.slice(0, 3).map(uc => (
                    <li key={uc} className="text-xs text-slate-600 font-medium flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-auto mb-4" onClick={() => loadRatings(agent.id)}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate this agent</p>
                  <StarRating value={ratingInputs[agent.id] || 0} onChange={v => setRatingInputs(p => ({ ...p, [agent.id]: v }))} />
                </div>
                {ratingInputs[agent.id] > 0 && (
                  <div className="mt-2 flex gap-2 animate-fade-in-up">
                    <input
                      className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-medium placeholder-slate-400"
                      placeholder="Optional review…"
                      value={reviewInputs[agent.id] || ''}
                      onChange={e => setReviewInputs(p => ({ ...p, [agent.id]: e.target.value }))}
                    />
                    <button onClick={() => handleRateAgent(agent.id)}
                      className="bg-slate-900 text-white rounded-xl px-3 py-2 text-xs font-bold hover:bg-emerald-500 transition-all">
                      Submit
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-display font-extrabold text-slate-900">{agent.price_credits}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">cr / mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setComplianceAgent(agent)}
                    className="border border-slate-200 text-slate-600 rounded-xl px-3 py-2 text-xs font-bold hover:border-emerald-300 hover:text-emerald-600 transition-all">
                    AI Act
                  </button>
                  {agent.is_hired ? (
                    <span className="bg-slate-100 text-slate-500 border border-slate-200 rounded-2xl px-5 py-2.5 font-bold text-sm flex items-center gap-1.5 cursor-default">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      In Team
                    </span>
                  ) : confirmingHire === agent.id ? (
                    <div className="flex items-center gap-1.5 animate-fade-in-up">
                      <span className="text-xs font-bold text-slate-600">{agent.price_credits} cr</span>
                      <button onClick={() => { handleHire(agent.id); setConfirmingHire(null); }}
                        className="bg-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-bold hover:bg-emerald-400 active:scale-95 transition-all">
                        Confirm
                      </button>
                      <button onClick={() => setConfirmingHire(null)}
                        className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-2 transition-colors">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmingHire(agent.id)}
                      className="bg-emerald-500 text-white rounded-2xl px-5 py-2.5 font-bold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-1.5">
                      Hire
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
