import React, { useState, useRef } from 'react';

// Parse Gemini's ## Section\n... output into a map
function parseSections(text) {
  const sections = {};
  const pattern = /##\s+(.+?)\n([\s\S]*?)(?=\n##\s|\s*$)/g;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    sections[m[1].trim()] = m[2].trim();
  }
  return sections;
}

function SectionCard({ icon, title, content, accent }) {
  const lines = content.split('\n').filter(l => l.trim());
  const isParagraph = !lines[0]?.startsWith('-') && !lines[0]?.startsWith('•');
  const colors = {
    indigo: 'border-indigo-100 bg-indigo-50/40',
    emerald: 'border-emerald-100 bg-emerald-50/40',
    amber: 'border-amber-100 bg-amber-50/40',
    slate: 'border-slate-100 bg-slate-50/40',
  };
  const dotColors = {
    indigo: 'bg-indigo-400', emerald: 'bg-emerald-400',
    amber: 'bg-amber-400', slate: 'bg-slate-400',
  };
  const headingColors = {
    indigo: 'text-indigo-700', emerald: 'text-emerald-700',
    amber: 'text-amber-700', slate: 'text-slate-600',
  };

  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`rounded-2xl border p-5 ${colors[accent]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${dotColors[accent]}`} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${headingColors[accent]}`}>{title}</span>
        </div>
        <button onClick={copy} className="text-[10px] text-slate-400 hover:text-slate-600 font-bold transition-colors">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      {isParagraph ? (
        <p className="text-sm text-slate-700 font-medium leading-relaxed">{content}</p>
      ) : (
        <ul className="space-y-1.5">
          {lines.map((line, i) => (
            <li key={i} className="text-sm text-slate-700 font-medium leading-snug flex gap-2">
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
  const [mode, setMode] = useState('audio'); // 'audio' | 'text'
  const [audioFile, setAudioFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(null); // index into active steps
  const [result, setResult] = useState(null); // { transcript?, result, transcribed_by, briefed_agents, speechmatics_live? }
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

        setCurrentStep(0); // uploading
        const fd = new FormData();
        fd.append('file', audioFile);

        setCurrentStep(1); // transcribing
        const res = await fetch(`${apiUrl}/transcribe/full`, {
          method: 'POST', headers, body: fd,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || 'Audio processing failed');
        }
        setCurrentStep(2); // analyzing (already done server-side, just UI)
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
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Intelligence</p>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-4xl font-display font-extrabold text-slate-900">Meeting Notetaker</h1>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Speechmatics</span>
          </div>
          <p className="text-slate-500 font-medium text-lg">Upload audio or paste notes — AI structures intelligence into your swarms.</p>
        </div>
      </div>

      {/* Input card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden mb-5">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-emerald-400 to-transparent" />
        <div className="p-7">
          {/* Mode toggle */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 mb-6 w-fit">
            {[
              { key: 'audio', label: '🎙 Audio File' },
              { key: 'text',  label: '📝 Paste Text' },
            ].map(m => (
              <button key={m.key} onClick={() => { setMode(m.key); setError(''); setResult(null); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === m.key ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                {m.label}
              </button>
            ))}
          </div>

          {mode === 'audio' ? (
            <div>
              <label
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`block cursor-pointer border-2 border-dashed rounded-2xl transition-all ${dragging ? 'border-indigo-400 bg-indigo-50' : audioFile ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20'}`}
              >
                <div className="p-8 text-center">
                  {audioFile ? (
                    <>
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
                      </div>
                      <p className="text-sm font-bold text-emerald-700">{audioFile.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{(audioFile.size / (1024 * 1024)).toFixed(1)} MB · Click to change</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                      </div>
                      <p className="text-sm font-bold text-slate-600">Drop audio file or click to browse</p>
                      <p className="text-xs text-slate-400 mt-1">MP3 · WAV · M4A · up to 200 MB</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="audio/*" className="hidden"
                  onChange={e => setAudioFile(e.target.files[0])} />
              </label>

              {false && (
                <div className="mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                  <span className="text-amber-500 text-sm mt-0.5">⚠</span>
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    <strong>Demo mode:</strong> No <code>SPEECHMATICS_API_KEY</code> found. Audio will be processed with a stub transcript. Add your key to <code>.env</code> for real speech-to-text.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <textarea
              rows={7}
              className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400 resize-none"
              placeholder="Paste raw meeting transcript or dialogue here…&#10;&#10;Speaker 1: We decided to launch the campaign on the 15th.&#10;Speaker 2: I'll handle the social posts. Deadline Friday."
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
            />
          )}

          {error && (
            <p className="mt-3 text-sm text-rose-600 font-medium">{error}</p>
          )}

          {/* Processing steps */}
          {processing && (
            <div className="mt-5 space-y-2 animate-fade-in-up">
              {activeSteps.map((s, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <div key={s.key} className={`flex items-center gap-3 transition-all ${done || active ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-5 h-5 rounded-md shrink-0 flex items-center justify-center text-[10px] font-bold ${done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      {done ? '✓' : active ? <div className="w-2.5 h-2.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" /> : i + 1}
                    </div>
                    <span className={`text-sm font-medium ${active ? 'text-indigo-700 font-bold' : done ? 'text-slate-400 line-through' : 'text-slate-400'}`}>{s.label}</span>
                    {active && <div className="flex gap-0.5 ml-auto">
                      {[0,1,2].map(d => <span key={d} className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d*0.15}s` }} />)}
                    </div>}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <div className="w-4 h-4 bg-slate-900 rounded flex items-center justify-center">
                <span className="text-[8px] font-bold text-emerald-400">V</span>
              </div>
              Vultr EU · Audit logged
            </div>
            <button
              onClick={handleAnalyze}
              disabled={processing || (mode === 'audio' ? !audioFile : !textInput.trim())}
              className="bg-slate-900 text-white py-3.5 px-7 rounded-2xl font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-2"
            >
              {processing ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing…</>
              ) : (
                <>{mode === 'audio' ? '🎙' : '✦'} Analyze Meeting</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Result header */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-emerald-400 to-transparent" />
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <span className="text-base">✓</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Meeting analyzed</p>
                  <p className="text-xs text-slate-400 font-medium">{result.transcribed_by}</p>
                </div>
              </div>
              {result.filename && (
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">{result.filename} · {result.size_kb} KB</span>
              )}
            </div>
          </div>

          {/* Transcript (audio mode only) */}
          {result.transcript && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button onClick={() => setShowTranscript(v => !v)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">🎙 Speechmatics Transcript</span>
                  {result.speechmatics_live && <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest">Live</span>}
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${showTranscript ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              {showTranscript && (
                <div className="px-6 pb-5 border-t border-slate-100">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed whitespace-pre-wrap pt-4 max-h-48 overflow-y-auto">{result.transcript}</p>
                </div>
              )}
            </div>
          )}

          {/* Structured sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections['Key Decisions'] && (
              <SectionCard icon="⚡" title="Key Decisions" content={sections['Key Decisions']} accent="indigo" />
            )}
            {sections['Action Items'] && (
              <SectionCard icon="✅" title="Action Items" content={sections['Action Items']} accent="emerald" />
            )}
            {sections['Next Steps'] && (
              <SectionCard icon="→" title="Next Steps" content={sections['Next Steps']} accent="amber" />
            )}
            {sections['Team Brief'] && (
              <div className="md:col-span-2">
                <SectionCard icon="📋" title="Team Brief" content={sections['Team Brief']} accent="slate" />
              </div>
            )}
          </div>

          {/* Fallback: raw output if sections didn't parse */}
          {Object.keys(sections).length === 0 && result.result && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-sm text-slate-700 font-medium whitespace-pre-wrap leading-relaxed">{result.result}</p>
            </div>
          )}

          {/* Auto-briefed agents */}
          {result.briefed_agents?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 flex items-center gap-4 flex-wrap">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Auto-briefed</p>
              <div className="flex gap-2 flex-wrap">
                {result.briefed_agents.map(a => (
                  <span key={a} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold px-3 py-1.5 rounded-full">✓ {a}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
