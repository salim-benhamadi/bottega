import React, { useState } from 'react';
import StarRating from '../../components/StarRating';
import AgentAvatar from '../../components/AgentAvatar';

const COLOR_MAP = {
  green:  { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200', button: 'bg-emerald-600 hover:bg-emerald-500 text-white', border: 'border-emerald-200', accent: 'bg-emerald-500' },
  indigo: { badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200',   button: 'bg-indigo-600 hover:bg-indigo-500 text-white',   border: 'border-indigo-200',  accent: 'bg-indigo-500' },
  purple: { badge: 'bg-purple-50 text-purple-700 border border-purple-200',   button: 'bg-purple-600 hover:bg-purple-500 text-white',   border: 'border-purple-200',  accent: 'bg-purple-500' },
  teal:   { badge: 'bg-teal-50 text-teal-700 border border-teal-200',         button: 'bg-teal-600 hover:bg-teal-500 text-white',       border: 'border-teal-200',    accent: 'bg-teal-500' },
  amber:  { badge: 'bg-amber-50 text-amber-700 border border-amber-200',      button: 'bg-amber-600 hover:bg-amber-500 text-white',     border: 'border-amber-200',   accent: 'bg-amber-500' },
};

function BundleCard({ bundle, onHire }) {
  const [confirming, setConfirming] = useState(false);
  const colors = COLOR_MAP[bundle.color] || COLOR_MAP.green;
  const savings = bundle.individual_total - bundle.bundle_price;

  return (
    <div className={`bg-white border flex flex-col relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-slate-300 ${colors.border}`} style={{ minWidth: 270, maxWidth: 300 }}>
      <div className={`h-[3px] shrink-0 ${colors.accent}`} />

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900 pr-4 leading-snug">{bundle.name}</h3>
          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest ${colors.badge}`}>
            {bundle.discount_pct}% OFF
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">{bundle.description}</p>

        {/* Agent avatar strip */}
        <div className="flex items-center mb-3" style={{ gap: 0 }}>
          {bundle.agents.map((agent, i) => (
            <div key={agent.id} className="overflow-hidden border-2 border-white" style={{ marginLeft: i === 0 ? 0 : -6, zIndex: i, borderRadius: 8 }}>
              <AgentAvatar name={agent.name} role={agent.role} size={28} />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {bundle.agents.map(agent => (
            <span key={agent.id} className={`text-[10px] font-medium px-2 py-0.5 border ${agent.is_hired ? 'bg-slate-50 text-slate-300 border-slate-100 line-through' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              {agent.name}
            </span>
          ))}
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-slate-300 text-sm line-through">{bundle.individual_total} cr</span>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">{bundle.bundle_price} cr</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 ${colors.badge}`}>Save {savings} cr</span>
        </div>

        {bundle.is_all_hired ? (
          <button disabled className="w-full bg-slate-100 text-slate-400 border border-slate-200 py-2.5 text-sm font-medium flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
            All Hired
          </button>
        ) : confirming ? (
          <div className="flex items-center gap-2 animate-fade-in-up">
            <span className="text-xs font-bold text-slate-600">{bundle.bundle_price} cr</span>
            <button onClick={() => { onHire(bundle.id); setConfirming(false); }}
              className="flex-1 bg-emerald-600 text-white px-3 py-2 text-xs font-medium hover:bg-emerald-500 active:scale-95 transition-all">
              Confirm
            </button>
            <button onClick={() => setConfirming(false)} className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-2 transition-colors">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)}
            className={`w-full py-2.5 text-sm font-medium active:scale-95 transition-all ${colors.button}`}>
            Hire Team — {bundle.bundle_price} cr
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
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-2">Hire</p>
          <h1 className="text-3xl font-bold text-slate-950 mb-2 tracking-tight">Marketplace</h1>
          <p className="text-slate-400 text-sm">{filteredMarketplace.length} of {marketplace.length} specialized agents available.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input
              className="bg-slate-50 border border-slate-200 pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-400 transition-all w-52"
              placeholder="Search agents…"
              value={marketplaceSearch}
              onChange={e => setMarketplaceSearch(e.target.value)}
            />
          </div>
          <div className="flex border border-slate-200 p-0.5">
            {['all', 'official', 'community'].map(f => (
              <button key={f} onClick={() => setMarketplaceFilter(f)}
                className={`px-3.5 py-1.5 text-xs font-medium transition-all ${marketplaceFilter === f ? 'bg-slate-950 text-white' : 'text-slate-400 hover:text-slate-700'}`}>
                {f === 'all' ? 'All' : f === 'official' ? 'Official' : 'Community'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Team Bundles */}
      {bundles.length > 0 && (
        <div className="mb-10">
          <div className="mb-4">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Bundles</p>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Team Bundles</h2>
            <p className="text-sm text-slate-400">Hire a complete team at a discounted rate.</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
            {bundles.map(bundle => (
              <BundleCard key={bundle.id} bundle={bundle} onHire={handleHireBundle} />
            ))}
          </div>
        </div>
      )}

      {/* Individual Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredMarketplace.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">No agents match your search.</p>
          </div>
        )}
        {filteredMarketplace.map(agent => (
          <div key={agent.id} className="bg-white border border-slate-200 flex flex-col overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200">

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <AgentAvatar name={agent.name} role={agent.role} size={44} />
                <div className="flex flex-col items-end gap-1">
                  {agent.is_official
                    ? <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-medium px-2 py-0.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500" />Official</span>
                    : <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-medium px-2 py-0.5">Community</span>}
                  {agent.compliance?.risk_level === 'Medium' && <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-medium px-2 py-0.5">Med Risk</span>}
                  {agent.id === 'a5' && <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-medium px-2 py-0.5">Speechmatics</span>}
                </div>
              </div>

              <h3 className="text-base font-semibold text-slate-900 mb-0.5 tracking-tight">{agent.name}</h3>
              <p className="text-[11px] text-slate-400 mb-3">{agent.role}</p>

              <div className="flex items-center gap-2 mb-4">
                <StarRating value={Math.round(agentRatings[agent.id]?.avg ?? agent.avg_rating ?? 0)} readonly size="text-sm" />
                <span className="text-xs text-slate-600 font-semibold">
                  {(agentRatings[agent.id]?.avg ?? agent.avg_rating ?? 0).toFixed(1)}
                  <span className="text-slate-400 font-medium ml-1">({agentRatings[agent.id]?.count ?? agent.rating_count ?? 0})</span>
                </span>
                {agent.hire_count > 0 && <><span className="w-1 h-1 rounded-full bg-slate-300" /><span className="text-xs text-slate-400">{agent.hire_count} hired</span></>}
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {agent.skills.map(s => <span key={s} className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-medium px-2 py-0.5">{s}</span>)}
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">Capabilities</p>
                <ul className="space-y-1.5">
                  {agent.use_cases.slice(0, 3).map(uc => (
                    <li key={uc} className="text-xs text-slate-600 flex items-start gap-2">
                      <svg className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 mt-auto mb-4" onClick={() => loadRatings(agent.id)}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Rate this agent</p>
                  <StarRating value={ratingInputs[agent.id] || 0} onChange={v => setRatingInputs(p => ({ ...p, [agent.id]: v }))} />
                </div>
                {ratingInputs[agent.id] > 0 && (
                  <div className="mt-2 flex gap-2 animate-fade-in-up">
                    <input
                      className="flex-1 text-xs bg-white border border-slate-200 px-3 py-2 outline-none focus:border-slate-400 placeholder-slate-400 transition-all"
                      placeholder="Optional review…"
                      value={reviewInputs[agent.id] || ''}
                      onChange={e => setReviewInputs(p => ({ ...p, [agent.id]: e.target.value }))}
                    />
                    <button onClick={() => handleRateAgent(agent.id)}
                      className="bg-slate-900 text-white px-3 py-2 text-xs font-medium hover:bg-emerald-600 transition-all">
                      Submit
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-slate-900 tracking-tight">{agent.price_credits}</span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest ml-1">cr / mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setComplianceAgent(agent)}
                    className="border border-slate-200 text-slate-500 px-3 py-1.5 text-xs font-medium hover:border-slate-400 hover:text-slate-700 transition-all">
                    AI Act
                  </button>
                  {agent.is_hired ? (
                    <span className="bg-slate-100 text-slate-500 border border-slate-200 px-4 py-1.5 text-sm font-medium flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      In Team
                    </span>
                  ) : confirmingHire === agent.id ? (
                    <div className="flex items-center gap-1.5 animate-fade-in-up">
                      <span className="text-xs font-bold text-slate-600">{agent.price_credits} cr</span>
                      <button onClick={() => { handleHire(agent.id); setConfirmingHire(null); }}
                        className="bg-emerald-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-emerald-500 active:scale-95 transition-all">
                        Confirm
                      </button>
                      <button onClick={() => setConfirmingHire(null)}
                        className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-1.5 transition-colors">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmingHire(agent.id)}
                      className="bg-slate-950 text-white px-4 py-1.5 text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all flex items-center gap-1.5">
                      Hire
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
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
