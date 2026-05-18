import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

function TopNav({ token }) {
  return (
    <header className="absolute top-0 w-full z-50 px-8 py-6 flex justify-between items-center">
      <Link to="/"><Logo /></Link>
      <nav className="flex items-center gap-6">
        {!token ? (
          <>
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Sign In</Link>
            <Link to="/register" className="text-sm font-bold bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-emerald-600 shadow-xl hover:-translate-y-0.5 transition-all">Start Free</Link>
          </>
        ) : (
          <Link to="/dashboard" className="text-sm font-bold bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-emerald-600 transition-all">Go to Dashboard</Link>
        )}
      </nav>
    </header>
  );
}

export default function Home({ token }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <TopNav token={token} />
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-emerald-50 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-lime-50 rounded-full blur-3xl pointer-events-none opacity-60" />
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-48 pb-20 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div>
            <div className="animate-fade-in-up inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 rounded-full tracking-wide uppercase mb-6 border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />HR Platform for the AI Era
            </div>
            <h1 className="animate-fade-in-up delay-100 text-6xl lg:text-[5rem] font-display font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-8">
              Hire your AI team.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Manage them</span> like people.
            </h1>
            <p className="animate-fade-in-up delay-200 text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">Don't build complex workflows. Hire specialized agents, assign tasks, and watch them grow into experts of your business.</p>
            <div className="animate-fade-in-up delay-300">
              <Link to="/register" className="bg-emerald-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 hover:bg-emerald-400 active:scale-95 transition-all">Hire Agents Now</Link>
            </div>
          </div>
          <div className="relative h-[500px] hidden lg:block">
            <div className="absolute top-10 right-20 w-72 bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_-12px_rgba(16,185,129,0.2)] border border-slate-100 animate-float z-20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">P</div>
                <div><h4 className="font-display font-bold text-slate-900">Proposal Writer</h4><p className="text-xs text-slate-500">Active · 10 credits/mo</p></div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl text-sm text-slate-600 italic">"I've drafted the Acme Corp proposal."</div>
            </div>
            <div className="absolute top-48 left-0 w-80 bg-white rounded-[2rem] p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 animate-float-delayed z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl">L</div>
                <div><h4 className="font-display font-bold text-slate-900">Lead Hunter Elite</h4><p className="text-xs text-slate-500">Probation · 12 credits/mo</p></div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full"><div className="h-full w-3/4 bg-teal-400 rounded-full" /></div>
            </div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-lime-300 to-emerald-400 rounded-[3rem] rotate-12 blur-sm opacity-80 animate-float z-0" />
          </div>
        </div>
      </main>

      {/* Features section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24 border-t border-slate-100">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl font-display font-extrabold text-slate-900">Your AI team, managed like people</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🛍', title: 'Hire in minutes', body: 'Browse 15+ specialized agents — each with skills, pricing, and an EU AI Act compliance card. No setup, no code.', accent: 'emerald' },
            { icon: '⚡', title: 'Delegate outcomes', body: 'Assign tasks in plain English. Agents coordinate autonomously via A2A delegation when they need a specialist.', accent: 'indigo' },
            { icon: '🧠', title: 'They grow with you', body: 'Every task builds your agent\'s private Dossier. Over time, they become experts on your business — not just generic AI.', accent: 'teal' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Bottega */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-24">
        <div className="bg-slate-900 rounded-[2rem] p-10 md:p-14">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-extrabold text-white mb-3">Built for managers, not developers</h2>
            <p className="text-slate-400 font-medium">The only AI platform designed for the people who actually run businesses.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { label: 'Setup time', bottega: '5 minutes', others: 'Days of config' },
              { label: 'EU AI Act', bottega: '✓ Native compliance', others: '✗ Retrofit required' },
              { label: 'Agent growth', bottega: 'Learns your business', others: 'Static & generic' },
            ].map(row => (
              <div key={row.label} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">{row.label}</p>
                <p className="text-emerald-400 font-bold text-sm mb-1">{row.bottega}</p>
                <p className="text-slate-500 text-xs font-medium line-through">{row.others}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
