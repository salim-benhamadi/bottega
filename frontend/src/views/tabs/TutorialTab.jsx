import React from 'react';

const STEPS = ['Hire Specialists', 'Natural Delegation', 'A2A Swarms', 'The Growth Engine'];

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
          return (
            <button key={n} onClick={() => setTutorialStep(n)}
              className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all duration-150 ${
                active ? 'bg-white border-emerald-200 shadow-sm' : 'border-transparent hover:bg-white hover:border-slate-100'
              }`}>
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all ${active ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {String(n).padStart(2, '0')}
                </span>
                <span className={`text-sm font-semibold transition-colors ${active ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-10 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
        <div key={tutorialStep} className="animate-slide-in max-w-lg">
          <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md uppercase tracking-widest mb-5">
            Step {String(tutorialStep).padStart(2,'0')} of 04
          </span>
          {tutorialStep===1 && <>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-3">Build your dream team instantly</h2>
            <p className="text-slate-500 leading-relaxed mb-7 text-sm">Browse the marketplace and hire specialized AI agents — each with their own skills, use cases, and EU AI Act compliance card. You start with 100 free credits.</p>
            <div className="flex items-center gap-3">
              <button onClick={()=>setActiveTab('marketplace')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all">Browse Marketplace →</button>
              <button onClick={()=>setTutorialStep(2)} className="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">Next step</button>
            </div>
          </>}
          {tutorialStep===2 && <>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-3">Assign tasks in plain English</h2>
            <p className="text-slate-500 leading-relaxed mb-7 text-sm">No code. Go to 'Your Team' and type a task. Agents in probation require your approval before their learnings are committed to their Dossier.</p>
            <div className="flex items-center gap-3">
              <button onClick={()=>setTutorialStep(3)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all">Next step →</button>
              <button onClick={()=>setTutorialStep(1)} className="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">Back</button>
            </div>
          </>}
          {tutorialStep===3 && <>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-3">Autonomous A2A Swarms</h2>
            <p className="text-slate-500 leading-relaxed mb-7 text-sm">If an agent needs a specialist (e.g. a German translator), it automatically hires one from the marketplace and pipelines the work — without you lifting a finger.</p>
            <div className="flex items-center gap-3">
              <button onClick={()=>setTutorialStep(4)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all">Next step →</button>
              <button onClick={()=>setTutorialStep(2)} className="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">Back</button>
            </div>
          </>}
          {tutorialStep===4 && <>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 mb-3">The Growth Engine</h2>
            <p className="text-slate-500 leading-relaxed mb-7 text-sm">After every task, agents extract new facts into their private Dossier — permanent memory that makes them experts on your business over time. You can edit or delete any entry.</p>
            <div className="flex items-center gap-3">
              <button onClick={()=>setActiveTab('marketplace')} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all">Start Hiring Now →</button>
              <button onClick={()=>setTutorialStep(3)} className="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">Back</button>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}
