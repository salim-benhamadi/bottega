import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const STEPS = [
  {
    id: 1,
    label: 'Welcome',
    quote: 'The best managers don\'t do the work — they build the team that does.',
    author: { name: 'Sofia Reyes', role: 'COO, Meridian Ventures' },
    title: 'Welcome to Bottega',
    subtitle: 'Your AI workforce starts here.',
  },
  {
    id: 2,
    label: 'Marketplace',
    quote: 'I hired a Lead Hunter, a Proposal Writer, and a Translator in under 3 minutes.',
    author: { name: 'James Okafor', role: 'Founder, PulseB2B' },
    title: 'Hire specialist agents',
    subtitle: 'Browse 15+ pre-built AI experts.',
  },
  {
    id: 3,
    label: 'Tasks',
    quote: 'I just type what I need done — no prompting, no configuration.',
    author: { name: 'Anna Fischer', role: 'Head of Sales, Bauwerk GmbH' },
    title: 'Delegate in plain English',
    subtitle: 'No code. No templates.',
  },
  {
    id: 4,
    label: 'Oversight',
    quote: 'Probation mode gave me the confidence to let go at exactly the right pace.',
    author: { name: 'Marcus Cole', role: 'Founder, Zenith Agency' },
    title: 'You stay in control',
    subtitle: 'Human oversight built in from day one.',
  },
  {
    id: 5,
    label: 'A2A',
    quote: 'They delegated to each other before I even realized the task needed a second agent.',
    author: { name: 'Lena Vargas', role: 'Growth Lead, Novatech' },
    title: 'Agents collaborate autonomously',
    subtitle: 'A2A intelligence activates automatically.',
  },
  {
    id: 6,
    label: 'Memory',
    quote: 'After 3 months, my agents know my clients better than my interns do.',
    author: { name: 'David Park', role: 'Managing Partner, Apex Advisory' },
    title: 'Your team learns & grows',
    subtitle: 'Permanent memory that compounds over time.',
  },
];

function ProgressBar({ current, total }) {
  return (
    <div className="flex items-center gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${
            i < current ? 'bg-emerald-500 flex-1' : i === current ? 'bg-emerald-300 flex-[2]' : 'bg-slate-200 flex-1'
          }`}
        />
      ))}
    </div>
  );
}

function AgentMockCard({ name, role, probation, price, color = 'emerald' }) {
  const colors = {
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    violet: 'bg-violet-50 border-violet-100 text-violet-700',
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center font-bold font-display shrink-0 ${colors[color]}`}>
        {name[0]}
      </div>
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

function StepContent({ step, onNext, onBack, onFinish, isLast, isFirst }) {
  const btnBase = 'px-6 py-3 rounded-2xl font-bold transition-all active:scale-95';

  return (
    <div className="animate-fade-in-up">
      {step === 1 && (
        <>
          <p className="text-slate-500 leading-relaxed mb-6 text-sm">
            Bottega is an AI workforce manager. You hire specialized agents, assign them tasks in plain English, and they work — learning your business with every interaction.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: '🏪', label: 'Marketplace', desc: '15+ specialist agents' },
              { icon: '🧠', label: 'Dossier', desc: 'Permanent memory per agent' },
              { icon: '🤝', label: 'A2A', desc: 'Agents delegate to each other' },
            ].map(f => (
              <div key={f.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1.5">{f.icon}</div>
                <p className="text-xs font-bold text-slate-800">{f.label}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
            <span className="text-2xl">🎁</span>
            <div>
              <p className="text-sm font-bold text-emerald-800">100 free credits to start</p>
              <p className="text-xs text-emerald-600 font-medium">Enough to hire 5–8 agents and run dozens of tasks</p>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-slate-500 leading-relaxed mb-6 text-sm">
            The <strong className="text-slate-700">Marketplace</strong> has agents for every business function — sales, legal, finance, marketing, operations. Each costs a small monthly credit fee. Hire as many as you need.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Sample agents</p>
            <AgentMockCard name="Proposal Writer Pro" role="Proposal Writer" price={10} />
            <AgentMockCard name="Lead Hunter Elite" role="Lead Hunter" probation price={12} color="indigo" />
            <AgentMockCard name="Contract Reviewer" role="Legal Analyst" price={15} color="violet" />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span>Official agents are built and maintained by Bottega. Community agents are created by other users.</span>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <p className="text-slate-500 leading-relaxed mb-6 text-sm">
            Go to <strong className="text-slate-700">Your Team</strong>, pick an agent, and type any task. No prompting tricks needed — agents understand natural business language and know their own role.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Example tasks you can type</p>
            {[
              '"Draft a proposal for Müller GmbH focused on our data analytics services"',
              '"Find 10 leads in the manufacturing sector in Northern Italy"',
              '"Review this contract and highlight any unusual clauses"',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                <p className="text-xs text-slate-600 italic font-medium">{t}</p>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 font-medium mb-6">
            Agents also use their <strong>Dossier</strong> — everything they've learned about your business — to personalise every output automatically.
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <p className="text-slate-500 leading-relaxed mb-6 text-sm">
            All new agents start in <strong className="text-slate-700">Probation Mode</strong>. They execute tasks fully, but their learnings need your approval before being written to their Dossier. Once you trust them, switch them to autonomous mode.
          </p>
          <div className="space-y-3 mb-5">
            {[
              { icon: '🔒', label: 'Probation Mode', desc: 'Agent works — but each learning requires your approval before it sticks.', color: 'amber' },
              { icon: '⚡', label: 'Autonomous Mode', desc: 'Agent works and learns independently. Full speed ahead.', color: 'emerald' },
              { icon: '🚨', label: 'Escalation Protocol', desc: 'Agents pause and ask you before taking risky or ambiguous actions.', color: 'rose' },
            ].map(o => (
              <div key={o.label} className={`flex items-start gap-3 bg-${o.color}-50 border border-${o.color}-100 rounded-xl p-3`}>
                <span className="text-xl mt-0.5">{o.icon}</span>
                <div>
                  <p className={`text-xs font-bold text-${o.color}-800`}>{o.label}</p>
                  <p className={`text-[10px] text-${o.color}-600 font-medium mt-0.5`}>{o.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 5 && (
        <>
          <p className="text-slate-500 leading-relaxed mb-6 text-sm">
            When an agent detects it needs a specialist — say, a German translator — it automatically delegates to another agent on the marketplace and pipelines the work. All without interrupting you.
          </p>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-5">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">A2A pipeline</p>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white rounded-xl border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-700">Proposal Writer</div>
              <div className="flex-1 flex items-center gap-1">
                <div className="flex-1 h-px bg-indigo-300" />
                <svg className="w-3 h-3 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
              </div>
              <div className="bg-white rounded-xl border border-purple-200 px-3 py-2 text-xs font-bold text-purple-700">Translator Pro DE</div>
            </div>
            <p className="text-[10px] text-indigo-500 font-medium">Every delegation is logged in your audit trail with full attribution.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600 font-medium mb-6">
            Try it: assign <span className="italic">"Draft a proposal for a German client"</span> — the agent will detect it needs a translator and auto-delegate.
          </div>
        </>
      )}

      {step === 6 && (
        <>
          <p className="text-slate-500 leading-relaxed mb-6 text-sm">
            After every task, agents extract and store key facts into their private <strong className="text-slate-700">Dossier</strong>. This memory compounds — the longer they work for you, the smarter they become about your specific business.
          </p>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-5">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3">Dossier example</p>
            {[
              { date: 'Day 1', text: 'Client base: manufacturing SMBs in Northern Italy.' },
              { date: 'Day 7', text: 'Prefers formal tone, 2-page executive summaries.' },
              { date: 'Day 30', text: 'Best close rate: proposals sent Mon–Wed morning.' },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
                <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 whitespace-nowrap">{s.date}</span>
                <p className="text-xs text-slate-600 font-medium">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
            <span className="text-xl">🔐</span>
            <p className="text-xs text-white font-medium">Your Dossier data is private and belongs entirely to your workspace. It is never shared.</p>
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3 pt-2">
        {isLast ? (
          <button onClick={onFinish} className={`${btnBase} bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25`}>
            Enter Workspace →
          </button>
        ) : (
          <button onClick={onNext} className={`${btnBase} bg-slate-900 text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25`}>
            Next →
          </button>
        )}
        {!isFirst && (
          <button onClick={onBack} className="text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">
            Back
          </button>
        )}
        {!isLast && (
          <button onClick={onFinish} className="ml-auto text-sm font-semibold text-slate-300 hover:text-slate-500 transition-colors">
            Skip tour
          </button>
        )}
      </div>
    </div>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const current = STEPS[step];

  const finish = () => {
    localStorage.setItem('bottega_onboarding_done', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[42%] bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-slate-900 z-0" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] z-0" />
        <div className="absolute top-1/3 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] z-0" />

        <div className="relative z-10 inline-block max-w-min bg-white p-2 rounded-2xl">
          <Logo size="small" />
        </div>

        {/* Step indicator */}
        <div className="relative z-10 flex flex-col gap-3 mb-6">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`flex items-center gap-3 transition-all duration-300 ${i === step ? 'opacity-100' : i < step ? 'opacity-40' : 'opacity-20'}`}>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                i < step ? 'bg-emerald-500/30 text-emerald-400' : i === step ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-500'
              }`}>
                {i < step ? '✓' : String(i + 1).padStart(2, '0')}
              </div>
              <span className={`text-sm font-semibold transition-colors ${i === step ? 'text-white' : 'text-slate-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="relative z-10 max-w-lg mb-10 transition-all duration-500" key={step}>
          <div className="text-emerald-400 text-5xl font-serif leading-none mb-3">"</div>
          <p className="text-2xl font-display font-medium text-white mb-5 leading-snug">{current.quote}</p>
          <p className="text-white font-bold text-sm">{current.author.name}</p>
          <p className="text-slate-400 text-sm font-medium">{current.author.role}</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-[58%] flex flex-col justify-center items-center p-8 sm:p-12 bg-slate-50">
        <div className="w-full max-w-lg">
          <ProgressBar current={step} total={STEPS.length} />

          <div className="mb-8 animate-fade-in-up" key={`header-${step}`}>
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md uppercase tracking-widest mb-4">
              Step {String(step + 1).padStart(2, '0')} of {String(STEPS.length).padStart(2, '0')}
            </span>
            <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-2">{current.title}</h2>
            <p className="text-slate-500 font-medium text-base">{current.subtitle}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
            <div key={step} className="p-8">
              <StepContent
                step={step + 1}
                onNext={() => setStep(s => s + 1)}
                onBack={() => setStep(s => s - 1)}
                onFinish={finish}
                isLast={step === STEPS.length - 1}
                isFirst={step === 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
