import React from 'react';

export default function MeetingNotetakerTab({
  meetingInput,
  setMeetingInput,
  meetingResult,
  meetingLoading,
  audioFile,
  setAudioFile,
  audioResult,
  audioLoading,
  handleAudioUpload,
  handleTranscribe
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Intelligence</p>
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <h1 className="text-4xl font-display font-extrabold text-slate-900">Meeting Notetaker</h1>
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Speechmatics</span>
        </div>
        <p className="text-slate-500 font-medium text-lg">Paste notes or upload audio — AI transcribes and structures intelligence into your swarms.</p>
      </div>

      {/* Audio upload section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden mb-5">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
        <div className="p-8">
          <label className="block text-sm font-bold text-slate-700 mb-2">Upload Audio File</label>
          <p className="text-slate-400 text-sm font-medium mb-5">Speechmatics real-time transcription — supports .mp3, .wav, .m4a</p>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-400 hover:bg-emerald-50/20 transition-all">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                </div>
                <p className="text-sm font-bold text-slate-500">{audioFile ? audioFile.name : 'Click to browse or drop a file'}</p>
                {!audioFile && <p className="text-xs text-slate-400 mt-1">MP3, WAV, M4A up to 200MB</p>}
              </div>
              <input type="file" accept="audio/*" className="hidden" onChange={e => setAudioFile(e.target.files[0])} />
            </label>
            <button
              onClick={handleAudioUpload}
              disabled={!audioFile || audioLoading}
              className="bg-slate-900 text-white py-4 px-7 rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all disabled:opacity-30 shrink-0"
            >
              {audioLoading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
          {audioResult && (
            <div className="mt-5 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <p className="text-emerald-700 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
                {audioResult.transcribed_by ? 'Speechmatics Transcript ✓' : 'Uploaded'}
              </p>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">{audioResult.transcript}</p>
            </div>
          )}
        </div>
      </div>

      {/* Paste transcript section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden mb-5">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
        <div className="p-8">
          <label className="block text-sm font-bold text-slate-700 mb-2">Or paste transcript / briefing logs</label>
          <p className="text-slate-400 text-sm font-medium mb-5">Raw meeting dialogue, auto-summarized and distributed to relevant agents in your swarm.</p>
          <textarea
            className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400 resize-none"
            rows="6"
            placeholder="Paste meeting dialogue or raw transcript here…"
            value={meetingInput}
            onChange={e => setMeetingInput(e.target.value)}
          />
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <div className="w-4 h-4 bg-slate-900 rounded flex items-center justify-center">
                <span className="text-[8px] font-bold text-emerald-400">V</span>
              </div>
              Audit logs secured on Vultr
            </div>
            <button
              onClick={handleTranscribe}
              disabled={meetingLoading || !meetingInput}
              className="bg-slate-900 text-white py-4 px-7 rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all disabled:opacity-30"
            >
              {meetingLoading ? 'Processing…' : 'Analyze Transcript'}
            </button>
          </div>
        </div>
      </div>

      {meetingResult && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-emerald-400 to-transparent" />
          <div className="p-8">
            <div className="flex items-center justify-between mb-5 pb-5 border-b border-slate-100">
              <h3 className="text-xl font-display font-bold text-slate-900">Meeting Summary</h3>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                {meetingResult.transcribed_by}
              </span>
            </div>
            <div className="text-sm text-slate-600 font-medium whitespace-pre-wrap leading-relaxed mb-6">
              {meetingResult.result}
            </div>
            {meetingResult.briefed_agents?.length > 0 && (
              <div className="border-t border-slate-100 pt-5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Auto-briefed agents</p>
                <div className="flex gap-2 flex-wrap">
                  {meetingResult.briefed_agents.map(a => (
                    <span key={a} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold px-3 py-1.5 rounded-full">✓ {a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
