import React, { useState, useRef } from 'react';

function parseSections(text) {
  const sections = {};
  const pattern = /##\s+(.+?)\n([\s\S]*?)(?=\n##\s|\s*$)/g;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    sections[m[1].trim()] = m[2].trim();
  }
  return sections;
}

function SectionCard({ title, content, accent }) {
  const lines = content.split('\n').filter(l => l.trim());
  const isParagraph = !lines[0]?.startsWith('-') && !lines[0]?.startsWith('•');
  const colors = {
    indigo: 'border-indigo-100 bg-indigo-50/40',
    emerald: 'border-emerald-100 bg-emerald-50/40',
    amber: 'border-amber-100 bg-amber-50/40',
    slate: 'border-slate-200 bg-slate-50/40',
  };
  const dotColors = { indigo: 'bg-indigo-400', emerald: 'bg-emerald-400', amber: 'bg-amber-400', slate: 'bg-slate-400' };
  const headingColors = { indigo: 'text-indigo-700', emerald: 'text-emerald-700', amber: 'text-amber-700', slate: 'text-slate-600' };

  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`border p-5 ${colors[accent]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${dotColors[accent]}`} />
          <span className={`text-[10px] font-medium uppercase tracking-widest ${headingColors[accent]}`}>{title}</span>
        </div>
        <button onClick={copy} className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      {isParagraph ? (
        <p className="text-sm text-slate-700 leading-relaxed">{content}</p>
      ) : (
        <ul className="space-y-1.5">
          {lines.map((line, i) => (
            <li key={i} className="text-sm text-slate-700 leading-snug flex gap-2">
              <span className="text-slate-300 shrink-0 mt-0.5">—</span>
              <span>{line.replace(/^[-•]\s*/, '')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const STEPS_AUDIO = [
  { key: 'upload', label: 'Uploading audio' },
  { key: 'transcribe', label: 'Speechmatics transcription' },
  { key: 'analyze', label: 'Gemini analysis' },
];
const STEPS_TEXT = [
  { key: 'analyze', label: 'Analyzing with Gemini 2.5 Flash' },
];

export default function MeetingNotetakerTab({ token, apiUrl }) {
  const [mode, setMode] = useState('audio');
  const [audioFile, setAudioFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const fileRef = useRef(null);

  const headers = { Authorization: `Bearer ${token}` };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('audio/')) setAudioFile(f);
  };

  const handleAnalyze = async () => {
    setError('');
    setResult(null);
    setProcessing(true);
    try {
      if (mode === 'audio') {
        if (!audioFile) { setError('Please select an audio file.'); setProcessing(false); return; }
        setCurrentStep(0);
        const fd = new FormData();
        fd.append('file', audioFile);
        setCurrentStep(1);
        const res = await fetch(`${apiUrl}/transcribe/full`, { method: 'POST', headers, body: fd });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || 'Audio processing failed');
        }
        setCurrentStep(2);
        const data = await res.json();
        setResult(data);
        setShowTranscript(false);
      } else {
        if (!textInput.trim()) { setError('Please paste a transcript or meeting notes.'); setProcessing(false); return; }
        setCurrentStep(0);
        const res = await fetch(`${apiUrl}/transcribe`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ task_description: textInput }),
        });
        if (!res.ok) throw new Error('Analysis failed');
        const data = await res.json();
        setResult(data);
      }
    } catch (e) {
      setError(e.message || 'Something went wrong.');
    }
    setProcessing(false);
    setCurrentStep(null);
  };

  const sections = result ? parseSections(result.result || '') : {};
  const activeSteps = mode === 'audio' ? STEPS_AUDIO : STEPS_TEXT;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-2">Intelligence</p>
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <h1 className="text-3xl font-bold text-slate-950 tracking-tight">Meeting Notetaker</h1>
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-medium px-2 py-0.5 uppercase tracking-widest">Speechmatics</span>
        </div>
        <p className="text-slate-400 text-sm">Upload audio or paste notes — AI structures intelligence into your swarms.</p>
      </div>

      {/* Input card */}
      <div className="bg-white border border-slate-200 overflow-hidden mb-5">
        <div className="h-[2px] bg-indigo-500 w-full" />
        <div className="p-6">
          {/* Mode toggle */}
          <div className="flex border border-slate-200 p-0.5 mb-6 w-fit">
            {[
              { key: 'audio', label: 'Audio File' },
              { key: 'text',  label: 'Paste Text' },
            ].map(m => (
              <button key={m.key} onClick={() => { setMode(m.key); setError(''); setResult(null); }}
                className={`px-4 py-2 text-sm font-medium transition-all ${mode === m.key ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                {m.label}
              </button>
            ))}
          </div>

          {mode === 'audio' ? (
            <label
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`block cursor-pointer border-2 border-dashed transition-all ${dragging ? 'border-indigo-400 bg-indigo-50' : audioFile ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20'}`}
            >
              <div className="p-8 text-center">
                {audioFile ? (
                  <>
                    <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
                    </div>
                    <p className="text-sm font-semibold text-emerald-700">{audioFile.name}</p>
                    <p className="text-xs text-slate-400 mt-1">{(audioFile.size / (1024 * 1024)).toFixed(1)} MB · Click to change</p>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                    </div>
                    <p className="text-sm font-medium text-slate-600">Drop audio file or click to browse</p>
                    <p className="text-xs text-slate-400 mt-1">MP3 · WAV · M4A · up to 200 MB</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="audio/*" className="hidden"
                onChange={e => setAudioFile(e.target.files[0])} />
            </label>
          ) : (
            <textarea
              rows={7}
              className="w-full bg-slate-50 border border-slate-200 p-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white outline-none transition-all resize-none"
              placeholder={"Paste raw meeting transcript or dialogue here…\n\nSpeaker 1: We decided to launch the campaign on the 15th.\nSpeaker 2: I'll handle the social posts. Deadline Friday."}
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
            />
          )}

          {error && <p className="mt-3 text-sm text-rose-600 font-medium">{error}</p>}

          {processing && (
            <div className="mt-5 space-y-2 animate-fade-in-up">
              {activeSteps.map((s, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <div key={s.key} className={`flex items-center gap-3 transition-all ${done || active ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-5 h-5 shrink-0 flex items-center justify-center text-[10px] font-bold ${done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      {done ? '✓' : active ? <div className="w-2.5 h-2.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" /> : i + 1}
                    </div>
                    <span className={`text-sm ${active ? 'text-indigo-700 font-semibold' : done ? 'text-slate-400 line-through' : 'text-slate-400'}`}>{s.label}</span>
                    {active && <div className="flex gap-0.5 ml-auto">
                      {[0,1,2].map(d => <span key={d} className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d*0.15}s` }} />)}
                    </div>}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
              <div className="w-4 h-4 bg-slate-950 flex items-center justify-center">
                <span className="text-[8px] font-bold text-emerald-400">V</span>
              </div>
              Vultr EU · Audit logged
            </div>
            <button
              onClick={handleAnalyze}
              disabled={processing || (mode === 'audio' ? !audioFile : !textInput.trim())}
              className="bg-slate-950 text-white py-2.5 px-6 text-sm font-medium hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-2"
            >
              {processing ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing…</>
              ) : (
                <>Analyze Meeting</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-3 animate-fade-in-up">
          {/* Result header */}
          <div className="bg-white border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-sm">✓</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Meeting analyzed</p>
                  <p className="text-xs text-slate-400">{result.transcribed_by}</p>
                </div>
              </div>
              {result.filename && (
                <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-medium px-2.5 py-0.5">{result.filename} · {result.size_kb} KB</span>
              )}
            </div>
          </div>

          {/* Transcript */}
          {result.transcript && (
            <div className="bg-white border border-slate-200 overflow-hidden">
              <button onClick={() => setShowTranscript(v => !v)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Speechmatics Transcript</span>
                  {result.speechmatics_live && <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-medium px-2 py-0.5 uppercase tracking-widest">Live</span>}
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${showTranscript ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              {showTranscript && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap pt-4 max-h-48 overflow-y-auto">{result.transcript}</p>
                </div>
              )}
            </div>
          )}

          {/* Structured sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections['Key Decisions'] && <SectionCard title="Key Decisions" content={sections['Key Decisions']} accent="indigo" />}
            {sections['Action Items'] && <SectionCard title="Action Items" content={sections['Action Items']} accent="emerald" />}
            {sections['Next Steps'] && <SectionCard title="Next Steps" content={sections['Next Steps']} accent="amber" />}
            {sections['Team Brief'] && (
              <div className="md:col-span-2">
                <SectionCard title="Team Brief" content={sections['Team Brief']} accent="slate" />
              </div>
            )}
          </div>

          {Object.keys(sections).length === 0 && result.result && (
            <div className="bg-white border border-slate-200 p-5">
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{result.result}</p>
            </div>
          )}

          {/* Auto-briefed agents */}
          {result.briefed_agents?.length > 0 && (
            <div className="bg-white border border-slate-200 px-5 py-4 flex items-center gap-4 flex-wrap">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest shrink-0">Auto-briefed</p>
              <div className="flex gap-2 flex-wrap">
                {result.briefed_agents.map(a => (
                  <span key={a} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-medium px-3 py-1">✓ {a}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
