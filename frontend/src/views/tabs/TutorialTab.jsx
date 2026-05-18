import React from 'react';

const STEPS = ['Hire Specialists', 'Natural Delegation', 'A2A Swarms', 'The Growth Engine'];

function AgentMockCard({ name, role, probation, price }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-700 font-display shrink-0">{name[0]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-800 truncate">{name}</p>
        <p className="text-[10px] text-slate-400 font-medium">{role}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {probation && <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-100">Probation</span>}
        <span className="text-[10px] text-emerald-600 font-bold">{price} cr/mo</span>
      </div>
    </div>
  );
}

export default function TutorialTab({ tutorialStep, setTutorialStep, setActiveTab }) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Step nav */}
      <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-8 space-y-1">
        <div className="mb-6">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Getting Started</p>
          <h1 className="text-2xl font-display font-extrabold text-slate-900 mb-1.5">How Bottega Works</h1>
          <p className="text-sm text-slate-500 font-medium">Master the AI operating system.</p>
        </div>
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = tutorialStep === n;
          const done = tutorialStep > n;
          return (
            <button key={n} onClick={() => setTutorialStep(n)}
              className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all duration-150 ${active ? 'bg-white border-emerald-200 shadow-sm' : 'border-transparent hover:bg-white hover:border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all ${active ? 'bg-emerald-500 text-white' : done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {done ? '✓' : String(n).padStart(2, '0')}
                </span>
                <span className={`text-sm font-semibold transition-colors ${active ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
        <div key={tutorialStep} className="animate-slide-in p-10">
          <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md uppercase tracking-widest mb-5">
            Step {String(tutorialStep).padStart(2,'0')} of 04
          </span>

          {tutorialStep === 1 && (
            <div>
              <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-3">Build your dream team instantly</h2>
              <p className="text-slate-500 leading-relaxed mb-6 text-sm">Browse 15+ specialized AI agents, each with their own skills, use cases, pricing, and EU AI Act compliance card. You start with 100 free credits.</p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Marketplace preview</p>
                <AgentMockCard name="Proposal Writer Pro" role="Proposal Writer" price={10} />
                <AgentMockCard name="Lead Hunter Elite" role="Lead Hunter" probation price={12} />
                <AgentMockCard name="Contract Reviewer" role="Legal Analyst" price={15} />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveTab('marketplace')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all">Browse Marketplace →</button>
                <button onClick={() => setTutorialStep(2)} className="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">Next step</button>
              </div>
            </div>
          )}

          {tutorialStep === 2 && (
            <div>
              <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-3">Assign tasks in plain English</h2>
              <p className="text-slate-500 leading-relaxed mb-6 text-sm">No code. Go to "Your Team" and type any task. New hires start in <strong>Probation mode</strong> — they work, but their learnings need your approval before being committed to memory.</p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Task example</p>
                <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-600 italic mb-3">
                  "Draft a proposal for Müller GmbH. Focus on our data analytics services."
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="text-xs text-amber-700 font-bold">Probation: result needs approval before dossier update</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setTutorialStep(3)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all">Next step →</button>
                <button onClick={() => setTutorialStep(1)} className="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">Back</button>
              </div>
            </div>
          )}

          {tutorialStep === 3 && (
            <div>
              <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-3">Autonomous A2A Swarms</h2>
              <p className="text-slate-500 leading-relaxed mb-6 text-sm">When an agent detects it needs a specialist (e.g. German translation), it automatically hires one from the marketplace and pipelines the work — without you lifting a finger.</p>
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">A2A Pipeline example</p>
                <div className="flex items-center gap-3">
                  <div className="bg-white rounded-xl border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-700">Proposal Writer</div>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="flex-1 h-px bg-indigo-300" />
                    <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                  </div>
                  <div className="bg-white rounded-xl border border-purple-200 px-3 py-2 text-xs font-bold text-purple-700">Translator Pro DE</div>
                </div>
                <p className="text-[10px] text-indigo-500 font-medium mt-2">Hint: try "Draft a proposal for a German client" to trigger delegation</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setTutorialStep(4)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all">Next step →</button>
                <button onClick={() => setTutorialStep(2)} className="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">Back</button>
              </div>
            </div>
          )}

          {tutorialStep === 4 && (
            <div>
              <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-3">The Growth Engine</h2>
              <p className="text-slate-500 leading-relaxed mb-6 text-sm">After every task, agents extract new facts into their private <strong>Dossier</strong> — permanent memory that makes them experts on your business over time. You own this data forever.</p>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3">Dossier example</p>
                {[
                  { date: '2026-05-01', text: 'Client prefers formal tone in proposals.' },
                  { date: '2026-05-08', text: 'Focus market: manufacturing SMBs in Northern Italy.' },
                  { date: '2026-05-15', text: 'Successful close rate with 2-page executive summaries.' },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5">{s.date}</span>
                    <p className="text-xs text-slate-600 font-medium">{s.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveTab('marketplace')} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all">Start Hiring Now →</button>
                <button onClick={() => setTutorialStep(3)} className="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">Back</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
