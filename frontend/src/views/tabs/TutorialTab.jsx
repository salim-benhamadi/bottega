import React from 'react';

const STEPS = ['Hire Specialists', 'Natural Delegation', 'A2A Swarms', 'The Growth Engine'];

function AgentMockCard({ name, role, probation, price }) {
  return (
    <div className="bg-white border border-slate-200 p-3 flex items-center gap-3">
      <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-sm shrink-0">{name[0]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800 truncate">{name}</p>
        <p className="text-[10px] text-slate-400">{role}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {probation && <span className="bg-amber-50 text-amber-700 text-[9px] font-medium px-1.5 py-0.5 border border-amber-100 uppercase tracking-widest">Probation</span>}
        <span className="text-[10px] text-emerald-600 font-medium">{price} cr/mo</span>
      </div>
    </div>
  );
}

export default function TutorialTab({ tutorialStep, setTutorialStep, setActiveTab }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Step nav */}
      <div className="w-full lg:w-56 shrink-0 lg:sticky lg:top-8 space-y-px">
        <div className="mb-6">
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-2">Getting Started</p>
          <h1 className="text-2xl font-bold text-slate-950 mb-1 tracking-tight">How Bottega Works</h1>
          <p className="text-sm text-slate-400">Master the AI operating system.</p>
        </div>
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = tutorialStep === n;
          const done = tutorialStep > n;
          return (
            <button key={n} onClick={() => setTutorialStep(n)}
              className={`w-full text-left px-3 py-2.5 border transition-all duration-150 ${active ? 'bg-white border-slate-300' : 'border-transparent hover:bg-white hover:border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${active ? 'bg-slate-950 text-white' : done ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                  {done ? '✓' : String(n).padStart(2, '0')}
                </span>
                <span className={`text-sm font-medium transition-colors ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 bg-white border border-slate-200 overflow-hidden">
        <div className="h-[2px] bg-slate-950 w-full" />
        <div key={tutorialStep} className="animate-fade-in-up p-8 md:p-10">
          <span className="inline-flex items-center text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 uppercase tracking-widest mb-5">
            Step {String(tutorialStep).padStart(2,'0')} of 04
          </span>

          {tutorialStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-950 mb-3 tracking-tight">Build your dream team instantly</h2>
              <p className="text-slate-400 leading-relaxed mb-6 text-sm">Browse 15+ specialized AI agents, each with their own skills, use cases, pricing, and EU AI Act compliance card. You start with 100 free credits.</p>
              <div className="bg-slate-50 border border-slate-200 p-4 mb-6 space-y-2">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-3">Marketplace preview</p>
                <AgentMockCard name="Proposal Writer Pro" role="Proposal Writer" price={10} />
                <AgentMockCard name="Lead Hunter Elite" role="Lead Hunter" probation price={12} />
                <AgentMockCard name="Contract Reviewer" role="Legal Analyst" price={15} />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveTab('marketplace')} className="bg-slate-950 text-white px-5 py-2.5 text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all">Browse Marketplace →</button>
                <button onClick={() => setTutorialStep(2)} className="text-sm text-slate-400 hover:text-slate-700 transition-colors">Next step</button>
              </div>
            </div>
          )}

          {tutorialStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-950 mb-3 tracking-tight">Assign tasks in plain English</h2>
              <p className="text-slate-400 leading-relaxed mb-6 text-sm">No code. Go to "Your Team" and type any task. New hires start in <strong className="text-slate-600">Probation mode</strong> — they work, but their learnings need your approval before being committed to memory.</p>
              <div className="bg-slate-50 border border-slate-200 p-4 mb-6">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-3">Task example</p>
                <div className="bg-white border border-slate-200 p-3 text-sm text-slate-500 italic mb-3">
                  "Draft a proposal for Müller GmbH. Focus on our data analytics services."
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="text-xs text-amber-700 font-medium">Probation: result needs approval before dossier update</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setTutorialStep(3)} className="bg-slate-950 text-white px-5 py-2.5 text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all">Next step →</button>
                <button onClick={() => setTutorialStep(1)} className="text-sm text-slate-400 hover:text-slate-700 transition-colors">Back</button>
              </div>
            </div>
          )}

          {tutorialStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-950 mb-3 tracking-tight">Autonomous A2A Swarms</h2>
              <p className="text-slate-400 leading-relaxed mb-6 text-sm">When an agent detects it needs a specialist (e.g. German translation), it automatically hires one from the marketplace and pipelines the work — without you lifting a finger.</p>
              <div className="bg-indigo-50 border border-indigo-100 p-4 mb-6">
                <p className="text-[10px] font-medium text-indigo-400 uppercase tracking-widest mb-3">A2A Pipeline example</p>
                <div className="flex items-center gap-3">
                  <div className="bg-white border border-indigo-200 px-3 py-2 text-xs font-medium text-indigo-700">Proposal Writer</div>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="flex-1 h-px bg-indigo-300" />
                    <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                  </div>
                  <div className="bg-white border border-purple-200 px-3 py-2 text-xs font-medium text-purple-700">Translator Pro DE</div>
                </div>
                <p className="text-[10px] text-indigo-500 mt-2">Hint: try "Draft a proposal for a German client" to trigger delegation</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setTutorialStep(4)} className="bg-slate-950 text-white px-5 py-2.5 text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all">Next step →</button>
                <button onClick={() => setTutorialStep(2)} className="text-sm text-slate-400 hover:text-slate-700 transition-colors">Back</button>
              </div>
            </div>
          )}

          {tutorialStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-950 mb-3 tracking-tight">The Growth Engine</h2>
              <p className="text-slate-400 leading-relaxed mb-6 text-sm">After every task, agents extract new facts into their private <strong className="text-slate-600">Dossier</strong> — permanent memory that makes them experts on your business over time. You own this data forever.</p>
              <div className="bg-emerald-50 border border-emerald-100 p-4 mb-6">
                <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-widest mb-3">Dossier example</p>
                {[
                  { date: '2026-05-01', text: 'Client prefers formal tone in proposals.' },
                  { date: '2026-05-08', text: 'Focus market: manufacturing SMBs in Northern Italy.' },
                  { date: '2026-05-15', text: 'Successful close rate with 2-page executive summaries.' },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-medium px-1.5 py-0.5 shrink-0 mt-0.5">{s.date}</span>
                    <p className="text-xs text-slate-600">{s.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveTab('marketplace')} className="bg-slate-950 text-white px-5 py-2.5 text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all">Start Hiring Now →</button>
                <button onClick={() => setTutorialStep(3)} className="text-sm text-slate-400 hover:text-slate-700 transition-colors">Back</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
