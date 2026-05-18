import React from 'react';
import { ClockIcon, BoltIcon, AlertIcon } from '../../components/Icons';

export default function DailyBriefingTab({ standup }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Intelligence</p>
        <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Daily Briefing</h1>
        <p className="text-slate-500 font-medium text-lg">AI-synthesized from your team's execution logs and operational history.</p>
      </div>

      {standup ? (
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
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-24 text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-600 mb-1">Synthesizing Briefing…</p>
          <p className="text-xs text-slate-400 font-medium">Aggregating agent memory banks</p>
        </div>
      )}
    </div>
  );
}
