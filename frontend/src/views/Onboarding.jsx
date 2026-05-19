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
          className={`h-[3px] transition-all duration-300 ${
            i < current
              ? 'bg-emerald-500 flex-1'
              : i === current
              ? 'bg-slate-950 flex-[2]'
              : 'bg-slate-200 flex-1'
          }`}
        />
      ))}
    </div>
  );
}

function AgentMockCard({ name, role, probation, price, accent = 'emerald' }) {
  const accentMap = {
    emerald: 'bg-emerald-500',
    indigo:  'bg-indigo-500',
    violet:  'bg-violet-500',
  };
  return (
    <div className="bg-white border border-slate-200 p-3 flex items-center gap-3">
      <div className={`w-8 h-8 flex items-center justify-center font-bold text-white text-sm shrink-0 ${accentMap[accent]}`}>
        {name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-800 truncate">{name}</p>
        <p className="text-[10px] text-slate-400 font-medium">{role}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {probation && (
          <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 border border-amber-200">
            Probation
          </span>
        )}
        <span className="text-[10px] text-emerald-600 font-bold">{price} cr/mo</span>
      </div>
    </div>
  );
}

function StepContent({ step, onNext, onBack, onFinish, isLast, isFirst }) {
  return (
    <div className="animate-fade-in-up">

      {step === 1 && (
        <>
          <p className="text-slate-500 leading-relaxed mb-6 text-sm">
            Bottega is an AI workforce manager. You hire specialized agents, assign them tasks in
            plain English, and they work — learning your business with every interaction.
          </p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: 'Marketplace', desc: '15+ specialist agents' },
              { label: 'Dossier',     desc: 'Permanent memory per agent' },
              { label: 'A2A',         desc: 'Agents delegate to each other' },
            ].map(f => (
              <div key={f.label} className="bg-slate-50 border border-slate-200 p-3 text-center">
                <p className="text-xs font-bold text-slate-800 mb-0.5">{f.label}</p>
                <p className="text-[10px] text-slate-400 font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-start gap-3 mb-6">
            <div className="w-1 h-full bg-emerald-500 shrink-0 self-stretch" />
            <div>
              <p className="text-sm font-bold text-emerald-800">100 free credits to start</p>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">
                Enough to hire 5–8 agents and run dozens of tasks
              </p>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <p className="text-slate-500 leading-relaxed mb-5 text-sm">
            The <strong className="text-slate-700">Marketplace</strong> has agents for every
            business function — sales, legal, finance, marketing, operations. Hire as many as
            you need.
          </p>
          <div className="bg-slate-50 border border-slate-200 p-4 mb-5 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Sample agents
            </p>
            <AgentMockCard name="Proposal Writer Pro" role="Proposal Writer" price={10} />
            <AgentMockCard name="Lead Hunter Elite"   role="Lead Hunter"    probation price={12} accent="indigo" />
            <AgentMockCard name="Contract Reviewer"   role="Legal Analyst"  price={15} accent="violet" />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-500 shrink-0" />
            <span>Official agents are built by Bottega. Community agents are created by users.</span>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <p className="text-slate-500 leading-relaxed mb-5 text-sm">
            Go to <strong className="text-slate-700">Your Team</strong>, pick an agent, and type
            any task. No prompting tricks — agents understand natural business language.
          </p>
          <div className="bg-slate-50 border border-slate-200 p-4 mb-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Example tasks
            </p>
            {[
              '"Draft a proposal for Müller GmbH focused on our data analytics services"',
              '"Find 10 leads in the manufacturing sector in Northern Italy"',
              '"Review this contract and highlight any unusual clauses"',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
                <span className="w-1 h-1 bg-emerald-500 shrink-0 mt-2" />
                <p className="text-xs text-slate-600 italic font-medium">{t}</p>
              </div>
            ))}
          </div>
          <div className="border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700 font-medium mb-6">
            Agents also use their <strong>Dossier</strong> — everything they've learned about
            your business — to personalise every output automatically.
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <p className="text-slate-500 leading-relaxed mb-5 text-sm">
            All new agents start in <strong className="text-slate-700">Probation Mode</strong>.
            They work fully, but their learnings need your approval before being saved. Once you
            trust them, switch to autonomous.
          </p>
          <div className="space-y-2 mb-6">
            {[
              { label: 'Probation Mode',     desc: 'Agent works — but each learning requires your approval before it sticks.', bar: 'bg-amber-500' },
              { label: 'Autonomous Mode',    desc: 'Agent works and learns independently. Full speed ahead.',                  bar: 'bg-emerald-500' },
              { label: 'Escalation Protocol',desc: 'Agents pause and ask you before taking risky or ambiguous actions.',       bar: 'bg-rose-500' },
            ].map(o => (
              <div key={o.label} className="flex items-start gap-3 border border-slate-200 bg-white p-3">
                <div className={`w-1 shrink-0 self-stretch ${o.bar}`} />
                <div>
                  <p className="text-xs font-bold text-slate-800">{o.label}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{o.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 5 && (
        <>
          <p className="text-slate-500 leading-relaxed mb-5 text-sm">
            When an agent detects it needs a specialist, it automatically delegates to another
            agent and pipelines the work. All without interrupting you.
          </p>
          <div className="bg-slate-50 border border-slate-200 p-4 mb-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              A2A pipeline
            </p>
            <div className="flex items-center gap-2 mb-4">
              <div className="border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700">
                Proposal Writer
              </div>
              <div className="flex-1 h-px bg-slate-300" />
              <span className="text-slate-400 text-xs font-bold">→</span>
              <div className="flex-1 h-px bg-slate-300" />
              <div className="border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
                Translator DE
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              Every delegation is logged in your audit trail with full attribution.
            </p>
          </div>
          <div className="border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 font-medium mb-6">
            Try it: assign{' '}
            <span className="italic">"Draft a proposal for a German client"</span> — the agent
            detects it needs a translator and auto-delegates.
          </div>
        </>
      )}

      {step === 6 && (
        <>
          <p className="text-slate-500 leading-relaxed mb-5 text-sm">
            After every task, agents extract and store key facts into their private{' '}
            <strong className="text-slate-700">Dossier</strong>. This memory compounds — the
            longer they work for you, the smarter they become about your business.
          </p>
          <div className="bg-slate-50 border border-slate-200 p-4 mb-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Dossier example
            </p>
            {[
              { date: 'Day 1',  text: 'Client base: manufacturing SMBs in Northern Italy.' },
              { date: 'Day 7',  text: 'Prefers formal tone, 2-page executive summaries.' },
              { date: 'Day 30', text: 'Best close rate: proposals sent Mon–Wed morning.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 mb-2 last:mb-0">
                <span className="bg-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 shrink-0 mt-0.5 whitespace-nowrap">
                  {item.date}
                </span>
                <p className="text-xs text-slate-600 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="border border-slate-200 bg-slate-950 px-4 py-3 flex items-center gap-3 mb-6">
            <div className="w-1 bg-emerald-500 self-stretch shrink-0" />
            <p className="text-xs text-white font-medium">
              Your Dossier data is private and belongs entirely to your workspace. Never shared.
            </p>
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3 pt-2">
        {isLast ? (
          <button
            onClick={onFinish}
            className="px-6 py-3 bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all"
          >
            Enter Workspace →
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-6 py-3 bg-slate-950 text-white text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all"
          >
            Next →
          </button>
        )}
        {!isFirst && (
          <button
            onClick={onBack}
            className="text-sm font-medium text-slate-400 hover:text-slate-700 transition-colors"
          >
            Back
          </button>
        )}
        {!isLast && (
          <button
            onClick={onFinish}
            className="ml-auto text-sm font-medium text-slate-300 hover:text-slate-500 transition-colors"
          >
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

      {/* ── Left panel ─────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] bg-slate-950 flex-col justify-between p-12">

        {/* Logo — no container, no rounding */}
        <Logo size="small" dark />

        {/* Step navigator */}
        <div className="flex flex-col gap-2.5">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-center gap-3 transition-all duration-300 ${
                i === step ? 'opacity-100' : i < step ? 'opacity-40' : 'opacity-20'
              }`}
            >
              {/* Flat square step indicator */}
              <div
                className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                  i === step ? 'bg-emerald-500' : 'bg-white/10'
                } text-white`}
              >
                {i < step ? '✓' : String(i + 1).padStart(2, '0')}
              </div>
              <span className="text-sm font-medium text-white">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Quote — flat rule instead of serif " */}
        <div key={step} className="transition-all duration-500">
          <div className="w-8 h-px bg-emerald-500 mb-5" />
          <p className="text-xl font-medium text-white mb-5 leading-snug">
            {current.quote}
          </p>
          <p className="text-white font-bold text-sm">{current.author.name}</p>
          <p className="text-slate-500 text-sm font-medium">{current.author.role}</p>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[58%] flex flex-col justify-center items-center p-8 sm:p-12 bg-white">
        <div className="w-full max-w-lg">

          <ProgressBar current={step} total={STEPS.length} />

          {/* Step header */}
          <div className="mb-8 animate-fade-in-up" key={`header-${step}`}>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-3 block">
              Step {String(step + 1).padStart(2, '0')} of {String(STEPS.length).padStart(2, '0')}
            </span>
            <h2 className="text-3xl font-bold text-slate-950 tracking-tight mb-1">
              {current.title}
            </h2>
            <p className="text-slate-500 font-medium text-base">{current.subtitle}</p>
          </div>

          {/* Content card — flat, no shadow, no rounding */}
          <div className="bg-white border border-slate-200 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-[2px] bg-slate-950" />
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
