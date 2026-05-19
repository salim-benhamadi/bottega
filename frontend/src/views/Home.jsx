import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

function TopNav({ token }) {
  return (
    <header className="absolute top-0 w-full z-50 px-8 py-5 flex justify-between items-center border-b border-slate-100 bg-white/80 backdrop-blur-sm">
      <Link to="/"><Logo /></Link>
      <nav className="flex items-center gap-4">
        {!token ? (
          <>
            <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Sign In</Link>
            <Link to="/register" className="text-sm font-medium bg-slate-950 text-white px-5 py-2.5 hover:bg-emerald-600 active:scale-95 transition-all">Start Free</Link>
          </>
        ) : (
          <Link to="/dashboard" className="text-sm font-medium bg-slate-950 text-white px-5 py-2.5 hover:bg-emerald-600 active:scale-95 transition-all">Go to Dashboard</Link>
        )}
      </nav>
    </header>
  );
}

export default function Home({ token }) {
  return (
    <div className="min-h-screen bg-white">
      <TopNav token={token} />

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-8 pt-40 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-slate-950 text-emerald-400 text-[10px] font-medium px-3 py-1.5 tracking-widest uppercase mb-8 border border-slate-800">
              <span className="w-1.5 h-1.5 bg-emerald-400" />
              HR Platform for the AI Era
            </div>
            <h1 className="animate-fade-in-up text-5xl lg:text-6xl font-bold text-slate-950 leading-[1.05] tracking-tight mb-6">
              Hire your AI team.<br />
              <span className="text-emerald-500">Manage them</span> like people.
            </h1>
            <p className="animate-fade-in-up text-slate-500 mb-10 max-w-lg leading-relaxed text-base">
              Don't build complex workflows. Hire specialized agents, assign tasks in plain English, and watch them grow into experts of your business.
            </p>
            <div className="animate-fade-in-up flex items-center gap-4">
              <Link to="/register" className="bg-slate-950 text-white px-7 py-3.5 text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all">
                Hire Agents Now
              </Link>
              <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Sign in →
              </Link>
            </div>
          </div>

          {/* Agent preview cards */}
          <div className="relative h-[420px] hidden lg:block">
            <div className="absolute top-8 right-16 w-72 bg-white border border-slate-200 p-5 shadow-lg z-20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold">P</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Proposal Writer</p>
                  <p className="text-[11px] text-slate-400">Active · 10 credits/mo</p>
                </div>
                <span className="ml-auto text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 uppercase tracking-widest">Live</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-3 text-xs text-slate-500 italic">
                "I've drafted the Acme Corp proposal."
              </div>
            </div>

            <div className="absolute top-44 left-0 w-76 bg-white border border-slate-200 p-5 shadow-lg z-10" style={{ width: 300 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold">L</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Lead Hunter Elite</p>
                  <p className="text-[11px] text-slate-400">Probation · 12 credits/mo</p>
                </div>
                <span className="ml-auto text-[9px] font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 uppercase tracking-widest">Supervised</span>
              </div>
              <div className="h-1.5 bg-slate-100">
                <div className="h-full w-3/4 bg-emerald-400 transition-all" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">Task in progress…</p>
            </div>

            <div className="absolute bottom-16 right-8 bg-white border border-slate-200 p-4 shadow-sm z-30 flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">A2A Delegation</p>
                <p className="text-[10px] text-slate-400">Translator hired automatically</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-20 border-t border-slate-100">
        <div className="mb-12">
          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl font-bold text-slate-950 tracking-tight">Your AI team, managed like people</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { n: '01', title: 'Hire in minutes', body: 'Browse 15+ specialized agents — each with skills, pricing, and an EU AI Act compliance card. No setup, no code.' },
            { n: '02', title: 'Delegate outcomes', body: 'Assign tasks in plain English. Agents coordinate autonomously via A2A delegation when they need a specialist.' },
            { n: '03', title: 'They grow with you', body: 'Every task builds your agent\'s private Dossier. Over time, they become experts on your business — not just generic AI.' },
          ].map(f => (
            <div key={f.n} className="bg-white border border-slate-200 p-7">
              <p className="text-3xl font-bold text-slate-100 mb-4 tabular-nums">{f.n}</p>
              <h3 className="text-base font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Bottega */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <div className="bg-slate-950 p-10 md:p-14">
          <div className="mb-10">
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-3">Comparison</p>
            <h2 className="text-2xl font-bold text-white tracking-tight">Built for managers, not developers</h2>
            <p className="text-slate-500 text-sm mt-2">The only AI platform designed for the people who actually run businesses.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Setup time', bottega: '5 minutes', others: 'Days of config' },
              { label: 'EU AI Act', bottega: 'Native compliance', others: 'Retrofit required' },
              { label: 'Agent growth', bottega: 'Learns your business', others: 'Static & generic' },
            ].map(row => (
              <div key={row.label} className="border border-slate-800 p-6">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mb-4">{row.label}</p>
                <p className="text-emerald-400 font-semibold text-sm mb-1.5">{row.bottega}</p>
                <p className="text-slate-600 text-xs line-through">{row.others}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
