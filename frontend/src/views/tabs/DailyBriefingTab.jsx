import React from 'react';
import { ClockIcon, BoltIcon, AlertIcon } from '../../components/Icons';

export default function DailyBriefingTab({ standup, onRegenerate, regenerating }) {
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Intelligence</p>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-1">Daily Briefing</h1>
          <p className="text-slate-400 font-medium text-sm">{today}</p>
        </div>
        <button
          onClick={onRegenerate}
          disabled={regenerating}
          className="shrink-0 flex items-center gap-2 bg-slate-900 text-white rounded-2xl px-5 py-3 font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all disabled:opacity-40"
        >
          {regenerating ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          )}
          {regenerating ? 'Generating…' : 'Regenerate'}
        </button>
      </div>

      {regenerating ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-24 text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-600 mb-1">Synthesizing Briefing…</p>
          <p className="text-xs text-slate-400 font-medium">Aggregating agent memory banks</p>
        </div>
      ) : !standup ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <p className="font-bold text-slate-700 mb-1">No briefing yet</p>
          <p className="text-sm text-slate-400 font-medium mb-5">Assign tasks to your team first, then generate your morning briefing.</p>
          <button onClick={onRegenerate} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-500 transition-all">
            Generate Now
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                  <ClockIcon />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Yesterday's Execution</p>
              </div>
              <p className="text-xl font-display font-semibold text-slate-800 leading-relaxed pl-1">"{standup.yesterday}"</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <BoltIcon />
                  </div>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Focus for Today</p>
                </div>
                <p className="text-lg font-display font-semibold text-slate-800 leading-relaxed pl-1">{standup.today}</p>
              </div>
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
                    <AlertIcon />
                  </div>
                  <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">Blockers</p>
                </div>
                <p className="text-lg font-display font-semibold text-slate-800 leading-relaxed pl-1">
                  {standup.blockers || 'No operational blockers identified.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
