import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';

const API_URL = "http://localhost:8000/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
        <Routes>
          <Route path="/" element={<Home token={token} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route path="/dashboard/*" element={token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

/* ── Logo ── */
function Logo({ size = "normal" }) {
  const iconClass = size === "small" ? "w-6 h-6 rounded-lg" : "w-8 h-8 rounded-xl";
  const textClass = size === "small" ? "text-xl" : "text-2xl";
  const dotSize   = size === "small" ? "w-1.5 h-1.5" : "w-2.5 h-2.5";
  return (
    <div className={`flex items-center gap-2 font-display font-extrabold tracking-tight text-slate-900 ${textClass}`}>
      <div className={`flex items-center justify-center bg-slate-900 relative overflow-hidden shadow-md ${iconClass}`}>
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-emerald-500 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-teal-400 rounded-tr-full" />
        <div className={`absolute bg-lime-300 rounded-full shadow-sm z-10 ${dotSize}`} />
      </div>
      bottega
    </div>
  );
}

/* ── TopNav ── */
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

/* ── Home ── */
function Home({ token }) {
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
    </div>
  );
}

/* ── AuthLayout ── */
function AuthLayout({ children, title, subtitle, quote, author }) {
  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-slate-900 z-0" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] z-0" />
        <Link to="/" className="relative z-10 inline-block max-w-min bg-white p-2 rounded-2xl"><Logo size="small" /></Link>
        <div className="relative z-10 max-w-lg mb-10">
          <div className="text-emerald-400 text-6xl font-serif leading-none mb-4">"</div>
          <p className="text-3xl font-display font-medium text-white mb-6 leading-tight">{quote}</p>
          <p className="text-white font-bold">{author.name}</p>
          <p className="text-slate-400 text-sm font-medium">{author.role}</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="mb-10 animate-fade-in-up">
            <h2 className="text-4xl font-display font-extrabold text-slate-900 mb-2">{title}</h2>
            <p className="text-slate-500 font-medium text-lg">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Login ── */
function Login({ setToken }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const fd = new URLSearchParams(); fd.append('username', email); fd.append('password', password);
    try {
      const res = await fetch(`${API_URL}/login`, { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) { localStorage.setItem('token', data.access_token); setToken(data.access_token); navigate('/dashboard'); }
      else setError(data.detail);
    } catch { setError('Login failed'); }
  };
  return (
    <AuthLayout title="Welcome back" subtitle="Log in to manage your AI workforce."
      quote="Since we hired our first AI agents, our efficiency doubled in two weeks."
      author={{ name: "Sarah Jenkins", role: "VP of Operations, Acme Corp" }}>
      {error && <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold border border-rose-100">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-5">
        <div><label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
          <input className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@company.com" /></div>
        <div><label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
          <input className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" /></div>
        <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all text-lg" type="submit">Sign In</button>
      </form>
      <p className="mt-8 text-sm text-slate-500">Don't have an account? <Link to="/register" className="text-emerald-600 font-bold">Register here</Link></p>
    </AuthLayout>
  );
}

/* ── Register ── */
function Register({ setToken }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState(''); const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, company_name: companyName }) });
      const data = await res.json();
      if (res.ok) { localStorage.setItem('token', data.access_token); setToken(data.access_token); navigate('/dashboard'); }
      else setError(data.detail);
    } catch { setError('Registration failed'); }
  };
  return (
    <AuthLayout title="Build your team" subtitle="Create your free Bottega workspace."
      quote="I used to spend 15 hours a week on proposals. Now my AI agent does it in seconds."
      author={{ name: "Marcus Cole", role: "Founder, Zenith Agency" }}>
      {error && <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold border border-rose-100">{error}</div>}
      <form onSubmit={handleRegister} className="space-y-5">
        <div><label className="block text-sm font-bold text-slate-700 mb-2">Company</label>
          <input className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400" type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required placeholder="Acme Corp" /></div>
        <div><label className="block text-sm font-bold text-slate-700 mb-2">Work Email</label>
          <input className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="jane@company.com" /></div>
        <div><label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
          <input className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" /></div>
        <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all text-lg" type="submit">Create Workspace</button>
      </form>
      <p className="mt-8 text-sm text-slate-500">Already have an account? <Link to="/login" className="text-emerald-600 font-bold">Sign in</Link></p>
    </AuthLayout>
  );
}

/* ── Star Rating ── */
function StarRating({ value, onChange, readonly = false, size = "text-xl" }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(star => (
        <button key={star} type="button"
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${size} transition-colors ${star <= (hover || value) ? 'text-amber-400' : 'text-slate-200'} ${!readonly ? 'hover:scale-110 transition-transform cursor-pointer' : 'cursor-default'}`}
          disabled={readonly}>★</button>
      ))}
    </div>
  );
}

/* ── AI Act Modal ── */
function AIActModal({ agent, onClose }) {
  const risk = agent.compliance?.risk_level || "Low";
  const riskStyle = risk === "Low" ? "text-emerald-700 border-emerald-200 bg-emerald-50"
    : risk === "Medium" ? "text-amber-700 border-amber-200 bg-amber-50"
    : "text-rose-700 border-rose-200 bg-rose-50";

  const exportPDF = () => {
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>AI Act Compliance — ${agent.name}</title>
    <style>body{font-family:Georgia,serif;padding:48px;max-width:640px;margin:0 auto;color:#1e293b}h1{font-size:28px;margin-bottom:4px}h2{font-size:18px;color:#64748b;font-weight:normal;margin-bottom:32px}table{width:100%;border-collapse:collapse}td{padding:12px 8px;border-bottom:1px solid #e2e8f0;font-size:15px}td:first-child{color:#64748b;width:45%}.badge{display:inline-block;padding:6px 16px;border-radius:999px;font-size:13px;font-weight:bold;margin-bottom:24px}.low{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}.medium{background:#fffbeb;color:#92400e;border:1px solid #fde68a}.footer{margin-top:48px;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:16px}</style>
    </head><body>
    <h1>EU AI Act Compliance Card</h1><h2>${agent.name} · ${agent.role}</h2>
    <div class="badge ${risk.toLowerCase()}">${risk} Risk</div>
    <table>
      <tr><td>Underlying Model</td><td><strong>${agent.compliance?.underlying_model}</strong></td></tr>
      <tr><td>Data Processed</td><td><strong>${agent.compliance?.data_processed}</strong></td></tr>
      <tr><td>EU Data Residency</td><td><strong>${agent.compliance?.eu_data_residency ? '✅ Confirmed' : '❌ Not guaranteed'}</strong></td></tr>
      <tr><td>Audit Log</td><td><strong>${agent.compliance?.audit_log ? '✅ Full audit trail' : '❌ Not available'}</strong></td></tr>
      <tr><td>Exportable Compliance Doc</td><td><strong>✅ Generated on demand</strong></td></tr>
    </table>
    <div class="footer">Generated by Bottega · Infrastructure: Vultr EU · ${new Date().toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric'})}</div>
    </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 max-w-md w-full shadow-[0_30px_60px_-10px_rgba(0,0,0,0.25)] animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">EU AI Act Compliance Card</div>
            <h3 className="text-2xl font-display font-bold text-slate-900">{agent.name}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-2xl leading-none">&times;</button>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-6 ${riskStyle}`}>
          <span className="w-2 h-2 rounded-full bg-current" />Risk Level: {risk}
        </div>
        <div className="space-y-3 mb-6">
          {[
            ["Underlying Model", agent.compliance?.underlying_model],
            ["Data Processed", agent.compliance?.data_processed],
            ["EU Data Residency", agent.compliance?.eu_data_residency ? "✅ Confirmed" : "❌ Not guaranteed"],
            ["Audit Log", agent.compliance?.audit_log ? "✅ Full audit trail" : "❌ Not available"],
            ["Exportable Compliance Doc", "✅ One-click PDF export"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4 py-2 border-b border-slate-100">
              <span className="text-sm text-slate-500 font-medium shrink-0">{label}</span>
              <span className="text-sm text-slate-900 font-semibold text-right">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#1a1a2e] rounded flex items-center justify-center"><span className="text-[9px] font-bold text-blue-400">V</span></div>
            <span className="text-xs text-slate-400">Infrastructure: Vultr EU</span>
          </div>
          <button onClick={exportPDF} className="text-xs bg-slate-900 text-white px-4 py-2 rounded-full font-bold hover:bg-emerald-600 transition-all">Export PDF</button>
        </div>
      </div>
    </div>
  );
}

/* ── Toast ── */
function Toast({ message, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-3 animate-fade-in-up ${type === 'success' ? 'bg-slate-900 text-white' : 'bg-rose-500 text-white'}`}>
      {type === 'success' ? '✓' : '✕'} {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">×</button>
    </div>
  );
}

/* ── Dashboard ── */
function Dashboard({ token, setToken }) {
  const [activeTab, setActiveTab] = useState('team');
  const [tutorialStep, setTutorialStep] = useState(1);

  // Data
  const [team, setTeam] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [standup, setStandup] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [agentTasks, setAgentTasks] = useState([]);       // tasks for the current performance agent
  const [taskHistory, setTaskHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [creatorStats, setCreatorStats] = useState(null);

  // History filters
  const [historySearch, setHistorySearch] = useState('');
  const [historyAgentFilter, setHistoryAgentFilter] = useState('all');

  // UI State
  const [complianceAgent, setComplianceAgent] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [marketplaceSearch, setMarketplaceSearch] = useState('');
  const [marketplaceFilter, setMarketplaceFilter] = useState('all'); // 'all' | 'official' | 'community'
  const [toast, setToast] = useState(null);
  const [ratingInputs, setRatingInputs] = useState({});      // { agentId: stars }
  const [reviewInputs, setReviewInputs] = useState({});      // { agentId: text }
  const [agentRatings, setAgentRatings] = useState({});      // { agentId: { user_stars, ratings } }
  const [editingDossier, setEditingDossier] = useState(null); // { agentId, idx, text }
  const [audioFile, setAudioFile] = useState(null);
  const [audioResult, setAudioResult] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  // Task state
  const [taskInputs, setTaskInputs] = useState({});
  const [taskResults, setTaskResults] = useState({});
  const [loadingTasks, setLoadingTasks] = useState({});
  const [meetingInput, setMeetingInput] = useState('');
  const [meetingResult, setMeetingResult] = useState(null);
  const [meetingLoading, setMeetingLoading] = useState(false);

  // Creator
  const [creatorForm, setCreatorForm] = useState({ name: '', role: '', skills: '', use_cases: '', price_credits: '' });

  // Settings
  const [settingsForm, setSettingsForm] = useState({ company_name: '' });
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [settingsMsg, setSettingsMsg] = useState('');
  const [topupAmount, setTopupAmount] = useState(50);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const logout = () => { localStorage.removeItem('token'); setToken(null); };
  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchWithAuth = async (endpoint, options = {}) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: { ...options.headers, 'Authorization': `Bearer ${token}` },
    });
    if (res.status === 401) logout();
    if (!res.ok && options.throwOnError) throw new Error(await res.text());
    return res.json();
  };

  const refreshUser = () => fetchWithAuth('/me').then(setUserInfo);

  // Initial load
  useEffect(() => { refreshUser(); }, []);

  // Notifications polling
  useEffect(() => {
    const fetchNotifs = () => fetchWithAuth('/notifications').then(data => { if (Array.isArray(data)) setNotifications(data); });
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'team') fetchWithAuth('/team').then(setTeam);
    if (activeTab === 'marketplace') fetchWithAuth('/marketplace').then(setMarketplace);
    if (activeTab === 'standup') { setStandup(null); fetchWithAuth('/standup').then(setStandup); }
    if (activeTab === 'history') fetchWithAuth('/tasks/history').then(data => { if (Array.isArray(data)) setTaskHistory(data); });
    if (activeTab === 'analytics') { setAnalytics(null); fetchWithAuth('/analytics').then(setAnalytics); }
    if (activeTab === 'creator') fetchWithAuth('/creator/stats').then(setCreatorStats);
    if (activeTab === 'settings' && userInfo) setSettingsForm({ company_name: userInfo.company_name || '' });
  }, [activeTab]);

  // Actions
  const handleHire = async (agentId) => {
    try {
      await fetchWithAuth(`/hire/${agentId}`, { method: 'POST', throwOnError: true });
      showToast('Agent hired successfully!');
      refreshUser();
      setActiveTab('team');
    } catch (e) {
      const msg = e.message.includes('Insufficient') ? 'Not enough credits to hire this agent.' : 'Failed to hire agent.';
      showToast(msg, 'error');
    }
  };

  const handleFire = async (agentId, agentName) => {
    if (!window.confirm(`Fire ${agentName}? Their dossier will be lost permanently.`)) return;
    await fetchWithAuth(`/team/${agentId}`, { method: 'DELETE' });
    fetchWithAuth('/team').then(setTeam);
    showToast(`${agentName} has been removed from your team.`);
  };

  const handleTaskAssign = async (agentId) => {
    const taskText = taskInputs[agentId];
    if (!taskText) return;
    setLoadingTasks(prev => ({ ...prev, [agentId]: true }));
    try {
      const res = await fetch(`${API_URL}/tasks/assign/${agentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ task_description: taskText }),
      });
      const data = await res.json();
      if (data.delegated) fetchWithAuth('/team').then(setTeam);
      setTaskResults(prev => ({ ...prev, [agentId]: data }));
    } catch (e) { console.error(e); }
    setLoadingTasks(prev => ({ ...prev, [agentId]: false }));
    setTaskInputs(prev => ({ ...prev, [agentId]: '' }));
  };

  const handleApproveTask = async (agentId) => {
    const td = taskResults[agentId];
    if (!td?.task_id) return;
    await fetchWithAuth(`/tasks/approve/${td.task_id}`, { method: 'POST' });
    setTaskResults(prev => ({ ...prev, [agentId]: { ...prev[agentId], pending_approval: false } }));
    showToast('Action approved — agent learned from this task.');
  };

  const handleEndProbation = async (agentId) => {
    await fetchWithAuth(`/probation/end/${agentId}`, { method: 'POST' });
    fetchWithAuth('/team').then(setTeam);
    showToast('Probation ended — agent now operates with full autonomy.');
  };

  const fetchPerformance = async (agentId) => {
    const [perf, tasks] = await Promise.all([
      fetchWithAuth(`/performance/${agentId}`),
      fetchWithAuth(`/tasks/history?agent_id=${agentId}&limit=20`),
    ]);
    setPerformance(perf);
    setAgentTasks(Array.isArray(tasks) ? tasks : []);
    setActiveTab('performance');
  };

  const handleRateAgent = async (agentId) => {
    const stars = ratingInputs[agentId];
    if (!stars) return;
    const res = await fetch(`${API_URL}/marketplace/${agentId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ stars, review: reviewInputs[agentId] || '' }),
    });
    const data = await res.json();
    setAgentRatings(prev => ({ ...prev, [agentId]: { ...prev[agentId], avg: data.avg_rating, count: data.rating_count } }));
    showToast('Rating submitted!');
  };

  const loadRatings = async (agentId) => {
    if (agentRatings[agentId]?.loaded) return;
    const data = await fetchWithAuth(`/marketplace/${agentId}/ratings`);
    setAgentRatings(prev => ({ ...prev, [agentId]: { ratings: data.ratings, user_stars: data.user_stars, loaded: true } }));
    setRatingInputs(prev => ({ ...prev, [agentId]: data.user_stars || 0 }));
  };

  const handleDeleteDossierEntry = async (agentId, idx) => {
    await fetchWithAuth(`/dossier/${agentId}/${idx}`, { method: 'DELETE' });
    setPerformance(prev => ({ ...prev, specializations: prev.specializations.filter((_, i) => i !== idx) }));
    showToast('Entry deleted.');
  };

  const handleSaveDossierEdit = async () => {
    if (!editingDossier) return;
    await fetch(`${API_URL}/dossier/${editingDossier.agentId}/${editingDossier.idx}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ skill_acquired: editingDossier.text }),
    });
    setPerformance(prev => ({
      ...prev,
      specializations: prev.specializations.map((s, i) =>
        i === editingDossier.idx ? { ...s, skill_acquired: editingDossier.text } : s
      ),
    }));
    setEditingDossier(null);
    showToast('Entry updated.');
  };

  const handleTranscribe = async () => {
    if (!meetingInput) return;
    setMeetingLoading(true);
    try {
      const res = await fetch(`${API_URL}/transcribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ task_description: meetingInput }),
      });
      setMeetingResult(await res.json());
    } catch (e) { console.error(e); }
    setMeetingLoading(false);
  };

  const handleAudioUpload = async () => {
    if (!audioFile) return;
    setAudioLoading(true);
    const fd = new FormData(); fd.append('file', audioFile);
    try {
      const res = await fetch(`${API_URL}/transcribe/audio`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
      setAudioResult(await res.json());
    } catch (e) { console.error(e); }
    setAudioLoading(false);
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    const payload = { name: creatorForm.name, role: creatorForm.role, skills: creatorForm.skills.split(',').map(s => s.trim()), use_cases: creatorForm.use_cases.split(',').map(s => s.trim()), price_credits: parseInt(creatorForm.price_credits) || 10 };
    await fetch(`${API_URL}/marketplace`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
    setCreatorForm({ name: '', role: '', skills: '', use_cases: '', price_credits: '' });
    fetchWithAuth('/creator/stats').then(setCreatorStats);
    showToast('Agent published to marketplace!');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await fetchWithAuth('/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ company_name: settingsForm.company_name }) });
    await refreshUser();
    setSettingsMsg('Profile updated.');
    setTimeout(() => setSettingsMsg(''), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm) { setSettingsMsg('New passwords do not match.'); return; }
    try {
      await fetchWithAuth('/me/password', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current_password: passwordForm.current_password, new_password: passwordForm.new_password }), throwOnError: true });
      setPasswordForm({ current_password: '', new_password: '', confirm: '' });
      setSettingsMsg('Password changed successfully.');
    } catch { setSettingsMsg('Current password is incorrect.'); }
    setTimeout(() => setSettingsMsg(''), 3000);
  };

  const handleTopup = async () => {
    const data = await fetchWithAuth('/credits/topup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: topupAmount }) });
    setUserInfo(prev => ({ ...prev, credit_balance: data.credit_balance }));
    showToast(`+${topupAmount} credits added!`);
  };

  const handleDeleteAccount = async () => {
    await fetchWithAuth('/me', { method: 'DELETE' });
    logout();
  };

  const markAllRead = async () => {
    await fetch(`${API_URL}/notifications/read-all`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredMarketplace = marketplace.filter(a => {
    const matchSearch = !marketplaceSearch ||
      a.name.toLowerCase().includes(marketplaceSearch.toLowerCase()) ||
      a.role.toLowerCase().includes(marketplaceSearch.toLowerCase()) ||
      a.skills.some(s => s.toLowerCase().includes(marketplaceSearch.toLowerCase()));
    const matchFilter = marketplaceFilter === 'all' || (marketplaceFilter === 'official' && a.is_official) || (marketplaceFilter === 'community' && !a.is_official);
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {complianceAgent && <AIActModal agent={complianceAgent} onClose={() => setComplianceAgent(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col pt-8 pb-6 px-4 relative z-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-slate-900 z-0" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[80px] z-0 pointer-events-none" />

        <div className="mb-6 px-4 relative z-10">
          <div className="bg-white inline-block p-2 rounded-2xl shadow-lg"><Logo size="small" /></div>
        </div>

        {/* Credits + Notifications row */}
        <div className="flex items-center gap-3 px-4 mb-4 relative z-10">
          <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-2">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Credits</p>
            <p className="text-xl font-display font-bold text-emerald-400">{userInfo?.credit_balance ?? '—'}</p>
          </div>
          {/* Notification bell */}
          <div className="relative">
            <button onClick={() => setShowNotifications(v => !v)} className="relative w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-white">
              <BellIcon />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>
            {showNotifications && (
              <div className="absolute left-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <p className="font-bold text-slate-900 text-sm">Notifications</p>
                  <button onClick={markAllRead} className="text-xs text-emerald-600 font-semibold hover:text-emerald-700">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 && <p className="text-center text-slate-400 text-sm py-8">No notifications yet</p>}
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b border-slate-50 text-sm ${n.read ? 'opacity-50' : 'bg-emerald-50/50'}`}>
                      <p className="text-slate-700 font-medium leading-snug">{n.message}</p>
                      <p className="text-slate-400 text-xs mt-1">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5 flex-1 overflow-y-auto px-2 custom-scrollbar relative z-10">
          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-3 mt-2">Getting Started</p>
          <NavButton active={activeTab==='tutorial'} onClick={()=>setActiveTab('tutorial')} icon={<BookIcon/>}>Tutorial</NavButton>

          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-3 mt-6">Workspace</p>
          <NavButton active={activeTab==='team'||activeTab==='performance'} onClick={()=>setActiveTab('team')} icon={<TeamIcon/>}>Your Team</NavButton>
          <NavButton active={activeTab==='standup'} onClick={()=>setActiveTab('standup')} icon={<ClockIcon/>}>Daily Standup</NavButton>
          <NavButton active={activeTab==='meeting'} onClick={()=>setActiveTab('meeting')} icon={<MicIcon/>}>
            <span className="flex items-center gap-2">Meeting Notetaker <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">STT</span></span>
          </NavButton>
          <NavButton active={activeTab==='history'} onClick={()=>setActiveTab('history')} icon={<HistoryIcon/>}>Task History</NavButton>
          <NavButton active={activeTab==='analytics'} onClick={()=>setActiveTab('analytics')} icon={<ChartIcon/>}>Analytics</NavButton>

          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-3 mt-6">Ecosystem</p>
          <NavButton active={activeTab==='marketplace'} onClick={()=>setActiveTab('marketplace')} icon={<ShopIcon/>}>Marketplace</NavButton>
          <NavButton active={activeTab==='creator'} onClick={()=>setActiveTab('creator')} icon={<StarIcon/>}>Creator Studio</NavButton>

          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-3 mt-6">Account</p>
          <NavButton active={activeTab==='settings'} onClick={()=>setActiveTab('settings')} icon={<GearIcon/>}>Settings</NavButton>
        </div>

        <button onClick={logout} className="mt-4 flex items-center gap-3 px-5 py-3 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all w-full relative z-10">
          <LogoutIcon/> Sign Out
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50/50" onClick={() => showNotifications && setShowNotifications(false)}>
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto p-10 pt-16 animate-fade-in-up relative z-10">

          {/* ── TUTORIAL ── */}
          {activeTab === 'tutorial' && (
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
              <div className="w-full lg:w-1/3 shrink-0 lg:sticky lg:top-10 space-y-4">
                <div className="mb-8"><h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">How Bottega Works</h1><p className="text-slate-500 font-medium text-lg">Master the AI Operating System.</p></div>
                {[1,2,3,4].map(step => (
                  <button key={step} onClick={() => setTutorialStep(step)} className={`w-full text-left p-5 rounded-2xl transition-all border-2 ${tutorialStep===step?'bg-emerald-50 border-emerald-200':'bg-transparent border-transparent hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${tutorialStep===step?'bg-emerald-500 text-white':'bg-slate-200 text-slate-500'}`}>{step}</div>
                      <span className={`font-bold text-lg ${tutorialStep===step?'text-emerald-900':'text-slate-600'}`}>{['Hire Specialists','Natural Delegation','A2A Swarms','The Growth Engine'][step-1]}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="w-full lg:w-2/3 bg-white p-12 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[500px] flex flex-col justify-center">
                {tutorialStep===1&&<div className="animate-fade-in-up"><h3 className="text-3xl font-display font-bold text-slate-900 mb-4">Build your dream team instantly</h3><p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">Browse the marketplace and hire specialized AI agents — each with their own skills, use cases, and AI Act compliance card. You start with 100 free credits.</p><button onClick={()=>setActiveTab('marketplace')} className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-400 transition-all">Browse Marketplace →</button></div>}
                {tutorialStep===2&&<div className="animate-fade-in-up"><h3 className="text-3xl font-display font-bold text-slate-900 mb-4">Assign tasks in plain English</h3><p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">No code. Go to 'Your Team' and type a task. Agents in probation require your approval before their learnings are added to their Dossier.</p><button onClick={()=>setTutorialStep(3)} className="text-emerald-600 font-bold text-lg">Next →</button></div>}
                {tutorialStep===3&&<div className="animate-fade-in-up"><h3 className="text-3xl font-display font-bold text-slate-900 mb-4">Autonomous A2A Swarms</h3><p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">If an agent needs a specialist (e.g. a German translator), it automatically hires one from the marketplace and pipelines the work — without you lifting a finger.</p><button onClick={()=>setTutorialStep(4)} className="text-emerald-600 font-bold text-lg">Next →</button></div>}
                {tutorialStep===4&&<div className="animate-fade-in-up"><h3 className="text-3xl font-display font-bold text-slate-900 mb-4">The Growth Engine</h3><p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">After every task, agents extract new facts into their private Dossier — permanent memory that makes them experts on your business over time. You can edit or delete any entry.</p><button onClick={()=>setActiveTab('marketplace')} className="bg-emerald-500 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-emerald-400 active:scale-95 transition-all text-lg">Start Hiring Now</button></div>}
              </div>
            </div>
          )}

          {/* ── YOUR TEAM ── */}
          {activeTab==='team' && (
            <div>
              <div className="mb-10"><h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Your Team</h1><p className="text-slate-500 font-medium text-lg">Assign tasks and manage your agents.</p></div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {team.length===0&&(
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white">
                    <p className="text-slate-400 text-lg font-medium mb-4">Your team is empty.</p>
                    <button onClick={()=>setActiveTab('marketplace')} className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-500 transition-all">Go to Marketplace</button>
                  </div>
                )}
                {team.map(agent => {
                  const result = taskResults[agent.id];
                  const isMeeting = agent.role === 'Meeting Analyst';
                  return (
                    <div key={agent.id} className="neo-card p-8 relative overflow-hidden group">
                      {loadingTasks[agent.id]&&<div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-pulse"/>}
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-[1rem] bg-emerald-100 flex items-center justify-center text-emerald-600 font-display font-bold text-2xl">{agent.name.charAt(0)}</div>
                          <div>
                            <h3 className="text-2xl font-display font-bold text-slate-900">{agent.name}</h3>
                            <p className="text-sm text-slate-500 font-medium">{agent.role}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {agent.probation_mode&&(
                            <div className="flex items-center gap-2">
                              <span className="bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">Probation</span>
                              <button onClick={()=>handleEndProbation(agent.id)} className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors">End</button>
                            </div>
                          )}
                          {isMeeting&&<span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold uppercase tracking-widest border border-emerald-200">Speechmatics</span>}
                          <button onClick={()=>handleFire(agent.id, agent.name)} className="text-xs text-rose-400 hover:text-rose-600 font-semibold transition-colors">Fire</button>
                        </div>
                      </div>

                      {result?.pending_approval&&(
                        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
                          <div><p className="text-amber-700 text-xs font-bold uppercase tracking-widest mb-0.5">Pending Your Approval</p><p className="text-amber-600 text-xs">Approve this action to let the agent learn from this task.</p></div>
                          <button onClick={()=>handleApproveTask(agent.id)} className="shrink-0 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-emerald-500 transition-all">Approve</button>
                        </div>
                      )}

                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all">
                        <textarea className="w-full bg-transparent resize-none outline-none text-sm text-slate-700 placeholder-slate-400 font-medium" rows="2" placeholder={`Message ${agent.name}...`} value={taskInputs[agent.id]||''} onChange={e=>setTaskInputs(prev=>({...prev,[agent.id]:e.target.value}))} />
                        <div className="flex justify-end mt-2">
                          <button onClick={()=>handleTaskAssign(agent.id)} disabled={loadingTasks[agent.id]||!taskInputs[agent.id]} className="bg-slate-900 text-white hover:bg-emerald-500 text-xs px-5 py-2.5 rounded-full font-bold transition-all disabled:opacity-30">
                            {loadingTasks[agent.id]?'Thinking...':'Assign'}
                          </button>
                        </div>
                      </div>

                      {result?.result&&(
                        <div className="mb-6 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm text-slate-700 max-h-60 overflow-y-auto shadow-inner">
                          <p className="text-emerald-700 mb-2 font-bold flex items-center gap-2 text-xs uppercase tracking-wider"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>Result</p>
                          <p className="whitespace-pre-wrap font-medium">{result.result}</p>
                          {result.delegated&&<p className="mt-3 text-xs text-emerald-600 font-semibold border-t border-emerald-100 pt-2">🔄 A2A delegation → Agent {result.delegated_to}</p>}
                        </div>
                      )}

                      <button onClick={()=>fetchPerformance(agent.id)} className="w-full text-sm font-bold bg-white border-2 border-slate-100 text-slate-600 py-3 rounded-xl hover:border-emerald-200 hover:text-emerald-600 transition-all">View Dossier & Performance Review</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── MARKETPLACE ── */}
          {activeTab==='marketplace'&&(
            <div>
              <div className="mb-8"><h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Marketplace</h1><p className="text-slate-500 font-medium text-lg">{filteredMarketplace.length} of {marketplace.length} agents</p></div>

              {/* Search + filter */}
              <div className="flex flex-wrap gap-3 mb-8">
                <input className="flex-1 min-w-48 bg-white border border-slate-200 px-4 py-3 rounded-2xl text-sm font-medium text-slate-700 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all" placeholder="Search agents, skills, roles…" value={marketplaceSearch} onChange={e=>setMarketplaceSearch(e.target.value)} />
                {['all','official','community'].map(f=>(
                  <button key={f} onClick={()=>setMarketplaceFilter(f)} className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${marketplaceFilter===f?'bg-slate-900 text-white border-slate-900':'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                    {f==='all'?'All':f==='official'?'✓ Official':'Community'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredMarketplace.map(agent=>(
                  <div key={agent.id} className="neo-card p-8 flex flex-col relative overflow-hidden group">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-[1rem] bg-indigo-50 flex items-center justify-center text-indigo-500 font-display font-bold text-xl group-hover:scale-110 group-hover:bg-indigo-100 transition-all">{agent.name.charAt(0)}</div>
                        <div className="flex flex-col items-end gap-1">
                          {agent.is_official
                            ? <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-bold uppercase tracking-widest">✓ Official</span>
                            : <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 font-bold uppercase tracking-widest">Community</span>}
                          {agent.compliance?.risk_level==='Medium'&&<span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200 font-bold uppercase tracking-widest">Medium Risk</span>}
                          {agent.id==='a5'&&<span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold uppercase tracking-widest">Speechmatics</span>}
                        </div>
                      </div>

                      <h3 className="text-2xl font-display font-bold text-slate-900 mb-1">{agent.name}</h3>
                      <p className="text-sm font-medium text-slate-500 mb-3">{agent.role}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <StarRating value={Math.round(agentRatings[agent.id]?.avg ?? agent.avg_rating ?? 0)} readonly size="text-base" />
                        <span className="text-xs text-slate-400 font-medium">
                          {(agentRatings[agent.id]?.avg ?? agent.avg_rating ?? 0).toFixed(1)} ({agentRatings[agent.id]?.count ?? agent.rating_count ?? 0})
                        </span>
                        {agent.hire_count > 0 && <span className="text-xs text-slate-400 font-medium ml-2">· {agent.hire_count} hired</span>}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">{agent.skills.map(s=><span key={s} className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600">{s}</span>)}</div>

                      <div className="mb-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Use Cases</p>
                        <ul className="space-y-1">{agent.use_cases.slice(0,3).map(uc=><li key={uc} className="text-xs text-slate-500 flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5 shrink-0">›</span>{uc}</li>)}</ul>
                      </div>

                      {/* Rate this agent */}
                      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100" onClick={()=>loadRatings(agent.id)}>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Rate this agent</p>
                        <StarRating value={ratingInputs[agent.id]||0} onChange={v=>setRatingInputs(p=>({...p,[agent.id]:v}))} />
                        {ratingInputs[agent.id]>0&&(
                          <div className="mt-2 flex gap-2">
                            <input className="flex-1 text-xs bg-white border border-slate-200 px-3 py-2 rounded-xl outline-none focus:border-emerald-500 font-medium" placeholder="Optional review…" value={reviewInputs[agent.id]||''} onChange={e=>setReviewInputs(p=>({...p,[agent.id]:e.target.value}))} />
                            <button onClick={()=>handleRateAgent(agent.id)} className="text-xs bg-slate-900 text-white px-3 py-2 rounded-xl font-bold hover:bg-emerald-500 transition-all">Submit</button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6 mt-4 flex items-center justify-between gap-3">
                      <div className="text-xl font-extrabold text-slate-900">{agent.price_credits} <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">cr/mo</span></div>
                      <div className="flex items-center gap-2">
                        <button onClick={()=>setComplianceAgent(agent)} className="text-xs px-3 py-2 rounded-full border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 transition-all font-bold">AI Act</button>
                        <button onClick={()=>handleHire(agent.id)} className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold shadow-lg hover:bg-emerald-500 hover:shadow-emerald-500/20 active:scale-95 transition-all text-sm">Hire</button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredMarketplace.length===0&&<div className="col-span-full py-20 text-center text-slate-400 text-lg font-medium border-2 border-dashed border-slate-200 rounded-[2rem] bg-white">No agents match your search.</div>}
              </div>
            </div>
          )}

          {/* ── STANDUP ── */}
          {activeTab==='standup'&&(
            <div className="max-w-4xl mx-auto">
              <div className="mb-12 text-center"><h1 className="text-4xl font-display font-extrabold text-slate-900 mb-3">Daily Briefing</h1><p className="text-slate-500 font-medium text-lg">AI-synthesized from your team's execution logs.</p></div>
              {standup?(
                <div className="bg-white rounded-[3rem] p-12 neo-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-400 to-teal-400"/>
                  <div className="mb-10">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><ClockIcon/></div>Yesterday's Execution</h3>
                    <p className="text-2xl text-slate-800 leading-snug font-display font-semibold">{standup.yesterday}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><BoltIcon/></div>Focus for Today</h3>
                      <p className="text-2xl text-slate-800 leading-snug font-display font-semibold">{standup.today}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500"><AlertIcon/></div>Blockers</h3>
                      <p className="text-2xl text-slate-800 leading-snug font-display font-semibold">{standup.blockers||"No blockers identified."}</p>
                    </div>
                  </div>
                </div>
              ):(
                <div className="text-center text-slate-400 flex flex-col items-center py-32">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-6"/>
                  <p className="font-bold tracking-wide text-lg">Synthesizing briefing…</p>
                </div>
              )}
            </div>
          )}

          {/* ── MEETING NOTETAKER ── */}
          {activeTab==='meeting'&&(
            <div className="max-w-4xl mx-auto">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-3 flex-wrap"><h1 className="text-4xl font-display font-extrabold text-slate-900">Meeting Notetaker</h1><span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">Powered by Speechmatics</span></div>
                <p className="text-slate-500 font-medium text-lg">Paste notes or upload an audio file — the agent structures and briefs your team.</p>
              </div>

              {/* Audio upload */}
              <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm mb-6">
                <p className="text-sm font-bold text-slate-700 mb-3">Upload Audio File <span className="text-slate-400 font-normal">(Speechmatics real-time transcription)</span></p>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-emerald-300 transition-colors">
                      <p className="text-sm text-slate-500 font-medium">{audioFile ? audioFile.name : 'Click to upload .mp3 / .wav / .m4a'}</p>
                    </div>
                    <input type="file" accept="audio/*" className="hidden" onChange={e=>setAudioFile(e.target.files[0])} />
                  </label>
                  <button onClick={handleAudioUpload} disabled={!audioFile||audioLoading} className="bg-slate-900 text-white px-5 py-3 rounded-full font-bold hover:bg-emerald-500 transition-all disabled:opacity-30 text-sm">
                    {audioLoading?'Uploading…':'Upload'}
                  </button>
                </div>
                {audioResult&&<div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-slate-700"><p className="font-semibold text-emerald-700 mb-1">{audioResult.transcribed_by ? '✓ ' + audioResult.transcribed_by : 'Uploaded'}</p><p>{audioResult.transcript}</p></div>}
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">Or paste transcript / notes</label>
                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 resize-none font-medium text-sm transition-all" rows="6" placeholder="Paste meeting transcript here…" value={meetingInput} onChange={e=>setMeetingInput(e.target.value)} />
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400"><div className="w-4 h-4 bg-[#1a1a2e] rounded flex items-center justify-center"><span className="text-[8px] font-bold text-blue-400">V</span></div>Audit logs on Vultr EU</div>
                  <button onClick={handleTranscribe} disabled={meetingLoading||!meetingInput} className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-30 text-sm">{meetingLoading?'Processing…':'Generate Notes'}</button>
                </div>
              </div>

              {meetingResult&&(
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 neo-shadow">
                  <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-display font-bold text-slate-900">Meeting Summary</h3><span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-semibold">{meetingResult.transcribed_by}</span></div>
                  <div className="text-slate-700 text-sm whitespace-pre-wrap font-medium leading-relaxed mb-6">{meetingResult.result}</div>
                  <div className="border-t border-slate-100 pt-4"><p className="text-xs text-slate-400 font-medium mb-2">Auto-briefed agents:</p><div className="flex gap-2 flex-wrap">{meetingResult.briefed_agents?.map(a=><span key={a} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{a}</span>)}</div></div>
                </div>
              )}
            </div>
          )}

          {/* ── TASK HISTORY ── */}
          {activeTab==='history'&&(
            <div>
              <div className="mb-8"><h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Task History</h1><p className="text-slate-500 font-medium text-lg">Search and filter all tasks across your team.</p></div>

              {/* Search + filter bar */}
              <div className="flex flex-wrap gap-3 mb-6">
                <input
                  className="flex-1 min-w-48 bg-white border border-slate-200 px-4 py-3 rounded-2xl text-sm font-medium text-slate-700 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  placeholder="Search task descriptions…"
                  value={historySearch}
                  onChange={e => setHistorySearch(e.target.value)}
                />
                <select
                  className="bg-white border border-slate-200 px-4 py-3 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 transition-all"
                  value={historyAgentFilter}
                  onChange={e => setHistoryAgentFilter(e.target.value)}
                >
                  <option value="all">All agents</option>
                  {[...new Set(taskHistory.map(t => t.agent_id))].map(id => {
                    const name = taskHistory.find(t => t.agent_id === id)?.agent_name || id;
                    return <option key={id} value={id}>{name}</option>;
                  })}
                </select>
                {(historySearch || historyAgentFilter !== 'all') && (
                  <button onClick={() => { setHistorySearch(''); setHistoryAgentFilter('all'); }} className="px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 border border-slate-200 bg-white hover:border-slate-300 transition-all">Clear</button>
                )}
              </div>

              {(() => {
                const filtered = taskHistory.filter(t => {
                  const matchSearch = !historySearch || t.task_description?.toLowerCase().includes(historySearch.toLowerCase());
                  const matchAgent  = historyAgentFilter === 'all' || t.agent_id === historyAgentFilter;
                  return matchSearch && matchAgent;
                });
                return filtered.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white">
                    <p className="text-slate-400 text-lg font-medium">{taskHistory.length === 0 ? 'No tasks yet — assign tasks to your team first.' : 'No tasks match your filters.'}</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-4">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
                    <div className="space-y-4">
                      {filtered.map(task => (
                        <div key={task.task_id} className="bg-white rounded-[1.5rem] p-6 border border-slate-100 hover:border-emerald-200 transition-all">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{task.agent_name || task.agent_id}</span>
                                {task.delegated && <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">🔄 A2A</span>}
                                {task.pending_approval && <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-lg">Pending approval</span>}
                              </div>
                              <p className="text-slate-800 font-semibold">{task.task_description}</p>
                            </div>
                            <span className="text-xs text-slate-400 font-medium shrink-0">{new Date(task.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-slate-600 font-medium line-clamp-2 bg-slate-50 rounded-xl p-3">{task.result?.slice(0, 200)}{task.result?.length > 200 ? '…' : ''}</p>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {activeTab==='analytics'&&(
            <div>
              <div className="mb-10"><h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Analytics</h1><p className="text-slate-500 font-medium text-lg">Usage, productivity, and team performance.</p></div>

              {!analytics ? (
                <div className="text-center text-slate-400 flex flex-col items-center py-32">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-6"/>
                  <p className="font-bold tracking-wide text-lg">Loading analytics…</p>
                </div>
              ) : (
                <div className="space-y-8">

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Tasks', value: analytics.total_tasks, sub: 'all time', color: 'text-emerald-600' },
                      { label: 'Active Agents', value: analytics.active_agents, sub: 'on your team', color: 'text-teal-600' },
                      { label: 'A2A Delegations', value: analytics.delegation_count, sub: 'auto-pipelines', color: 'text-indigo-600' },
                      { label: 'Credits Balance', value: analytics.credit_balance, sub: `${analytics.credits_spent_on_hires} cr in hires`, color: 'text-amber-600' },
                    ].map(({ label, value, sub, color }) => (
                      <div key={label} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                        <div className={`text-3xl font-display font-extrabold mb-1 ${color}`}>{value}</div>
                        <div className="text-sm font-bold text-slate-700 mb-0.5">{label}</div>
                        <div className="text-xs text-slate-400 font-medium">{sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Weekly activity bar chart */}
                  <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-display font-bold text-slate-900 mb-1">Weekly Activity</h3>
                    <p className="text-sm text-slate-400 font-medium mb-8">Tasks completed per week over the last 8 weeks.</p>
                    {(() => {
                      const max = Math.max(...analytics.tasks_per_week.map(w => w.count), 1);
                      return (
                        <div className="flex items-end gap-2" style={{ height: '140px' }}>
                          {analytics.tasks_per_week.map((week, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                              <span className="text-xs font-bold text-slate-700">{week.count > 0 ? week.count : ''}</span>
                              <div
                                className={`w-full rounded-t-xl transition-all ${i === analytics.tasks_per_week.length - 1 ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                style={{ height: `${Math.max((week.count / max) * 100, week.count > 0 ? 4 : 1)}%` }}
                              />
                              <span className="text-[10px] text-slate-400 font-medium">{week.label}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Tasks per agent horizontal bars */}
                  <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-display font-bold text-slate-900 mb-1">Tasks per Agent</h3>
                    <p className="text-sm text-slate-400 font-medium mb-6">Productivity breakdown across your team.</p>
                    {analytics.tasks_per_agent.length === 0 ? (
                      <p className="text-slate-400 text-sm">No tasks completed yet.</p>
                    ) : (() => {
                      const max = Math.max(...analytics.tasks_per_agent.map(a => a.count), 1);
                      return (
                        <div className="space-y-4">
                          {analytics.tasks_per_agent.map(agent => (
                            <div key={agent.agent_id} className="flex items-center gap-4">
                              <div className="w-36 shrink-0">
                                <p className="text-sm font-bold text-slate-700 truncate">{agent.agent_name}</p>
                              </div>
                              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                                  style={{ width: `${(agent.count / max) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-extrabold text-slate-900 w-8 text-right shrink-0">{agent.count}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Agent activity log — click an agent to see their last tasks */}
                  <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-display font-bold text-slate-900 mb-1">Per-Agent Activity Log</h3>
                    <p className="text-sm text-slate-400 font-medium mb-6">Expand any agent to see their recent task history.</p>
                    {analytics.tasks_per_agent.length === 0 ? (
                      <p className="text-slate-400 text-sm">No agent activity yet.</p>
                    ) : (
                      <AgentActivityAccordion agents={analytics.tasks_per_agent} token={token} logout={logout} apiUrl={API_URL} />
                    )}
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ── PERFORMANCE ── */}
          {activeTab==='performance'&&performance&&(
            <div className="max-w-4xl mx-auto">
              <button onClick={()=>setActiveTab('team')} className="text-slate-400 hover:text-slate-900 mb-8 text-sm font-bold flex items-center gap-2 transition-colors">&larr; Back to Team</button>
              <div className="bg-white rounded-[3rem] p-10 neo-shadow border border-slate-100 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-100">
                  <div><div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Performance Review</div><h2 className="text-4xl font-display font-extrabold text-slate-900">{performance.agent_name}</h2></div>
                  <div className={`px-4 py-2 rounded-full border text-sm font-bold ${performance.days_active>=30?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-amber-50 text-amber-700 border-amber-200'}`}>{performance.days_active>=30?'30-Day Review Complete ✓':`Day ${performance.days_active} of 30`}</div>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {[['Days Active',performance.days_active],['Tasks Completed',performance.task_count],['Specializations',performance.specializations.length]].map(([label,val])=>(
                    <div key={label} className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100"><div className="text-3xl font-display font-extrabold text-emerald-600 mb-1">{val}</div><div className="text-xs text-slate-400 font-semibold uppercase tracking-widest">{label}</div></div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 font-semibold mb-2"><span>Hired</span><span>Full Trust (30 days)</span></div>
                  <div className="bg-slate-100 rounded-full h-2"><div className="bg-emerald-500 rounded-full h-2 transition-all duration-1000" style={{width:`${Math.min(100,(performance.days_active/30)*100)}%`}}/></div>
                  <div className="text-right text-xs text-slate-400 mt-1">{Math.min(100,Math.round((performance.days_active/30)*100))}% to full autonomy</div>
                </div>
              </div>

              {/* Agent activity log */}
              {agentTasks.length > 0 && (
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 mb-8">
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-1">Recent Activity</h3>
                  <p className="text-slate-500 text-sm font-medium mb-6">Last {agentTasks.length} tasks completed by this agent.</p>
                  <div className="space-y-3">
                    {agentTasks.map(task => (
                      <div key={task.task_id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {task.delegated && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">🔄 A2A</span>}
                            {task.pending_approval && <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Pending</span>}
                          </div>
                          <p className="text-sm font-semibold text-slate-800 truncate">{task.task_description}</p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{new Date(task.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-[3rem] p-10 border border-slate-100">
                <h3 className="text-xl font-display font-bold text-slate-900 mb-1">Specialization Timeline</h3>
                <p className="text-slate-500 text-sm font-medium mb-8">Proprietary company knowledge — edit or delete any entry.</p>
                {performance.specializations.length===0?(
                  <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50"><p className="text-slate-400 font-medium text-lg">No specializations yet.</p></div>
                ):(
                  <div className="relative">
                    <div className="absolute left-4 top-4 bottom-4 w-px bg-emerald-100 rounded-full"/>
                    {performance.specializations.map((spec,idx)=>(
                      <div key={idx} className="flex items-start gap-6 mb-5 relative group/entry">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 z-10"><span className="text-emerald-600 text-xs font-bold">{idx+1}</span></div>
                        <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-emerald-200 transition-all">
                          {editingDossier?.agentId===performance.agent_id&&editingDossier?.idx===idx?(
                            <div className="flex gap-2">
                              <input className="flex-1 text-sm bg-white border border-emerald-300 rounded-xl px-3 py-2 outline-none font-medium text-slate-700" value={editingDossier.text} onChange={e=>setEditingDossier(p=>({...p,text:e.target.value}))} />
                              <button onClick={handleSaveDossierEdit} className="text-xs bg-emerald-500 text-white px-3 py-2 rounded-xl font-bold">Save</button>
                              <button onClick={()=>setEditingDossier(null)} className="text-xs text-slate-400 px-2">Cancel</button>
                            </div>
                          ):(
                            <div className="flex items-start justify-between gap-3">
                              <div><div className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg inline-block mb-2 uppercase tracking-widest">{spec.date}</div><div className="text-slate-700 text-sm font-medium leading-relaxed">{spec.skill_acquired}</div></div>
                              <div className="flex gap-1 opacity-0 group-hover/entry:opacity-100 transition-opacity shrink-0">
                                <button onClick={()=>setEditingDossier({agentId:performance.agent_id,idx,text:spec.skill_acquired})} className="text-xs text-slate-400 hover:text-emerald-600 font-semibold px-2 py-1 rounded transition-colors">Edit</button>
                                <button onClick={()=>handleDeleteDossierEntry(performance.agent_id,idx)} className="text-xs text-slate-400 hover:text-rose-600 font-semibold px-2 py-1 rounded transition-colors">Delete</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── CREATOR STUDIO ── */}
          {activeTab==='creator'&&(
            <div className="max-w-5xl mx-auto">
              <div className="mb-10"><h1 className="text-4xl font-display font-extrabold text-slate-900 mb-3">Creator Studio</h1><p className="text-slate-500 font-medium text-lg">Design agents and earn royalties every time they're hired.</p></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  {/* Creator earnings */}
                  {creatorStats&&(
                    <div className="bg-white rounded-[2rem] p-7 border border-slate-100 neo-shadow">
                      <h3 className="text-lg font-display font-bold text-slate-900 mb-5">Your Earnings</h3>
                      <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
                          <div className="text-2xl font-display font-extrabold text-emerald-600">{creatorStats.total_hires}</div>
                          <div className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-1">Total Hires</div>
                        </div>
                        <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
                          <div className="text-2xl font-display font-extrabold text-emerald-600">{creatorStats.total_earnings_credits}</div>
                          <div className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-1">Credits Earned</div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {[['Revenue share','15% per hire'],['Payout cycle','Monthly'],['Min payout','€10 credits']].map(([l,v])=>(
                          <div key={l} className="flex justify-between items-center py-2 border-b border-slate-100"><span className="text-sm text-slate-500">{l}</span><span className="text-sm font-bold text-emerald-600">{v}</span></div>
                        ))}
                      </div>
                      {creatorStats.published_agents?.length>0&&(
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Published Agents</p>
                          {creatorStats.published_agents.map(a=>(
                            <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                              <div><p className="text-slate-900 text-sm font-bold">{a.name}</p><p className="text-slate-400 text-xs">{a.hire_count||0} hires · {a.price_credits} cr/mo</p></div>
                              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full border border-emerald-200 font-semibold">Live</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Publish a New Agent</h3>
                  <form onSubmit={handleCreateAgent} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Agent Name</label><input required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900" value={creatorForm.name} onChange={e=>setCreatorForm({...creatorForm,name:e.target.value})} placeholder="e.g. SEO Auditor Pro"/></div>
                      <div><label className="block text-sm font-bold text-slate-700 mb-2">Role</label><input required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900" value={creatorForm.role} onChange={e=>setCreatorForm({...creatorForm,role:e.target.value})} placeholder="e.g. SEO Specialist"/></div>
                    </div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Skills <span className="text-slate-400 font-normal">(comma separated)</span></label><input required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900" value={creatorForm.skills} onChange={e=>setCreatorForm({...creatorForm,skills:e.target.value})} placeholder="Keyword Research, Analytics"/></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Use Cases <span className="text-slate-400 font-normal">(comma separated)</span></label><input required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900" value={creatorForm.use_cases} onChange={e=>setCreatorForm({...creatorForm,use_cases:e.target.value})} placeholder="Auditing websites, Writing SEO content"/></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Monthly Price <span className="text-slate-400 font-normal">(Credits)</span></label><input required type="number" min="1" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900" value={creatorForm.price_credits} onChange={e=>setCreatorForm({...creatorForm,price_credits:e.target.value})} placeholder="25"/></div>
                    <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-95 transition-all text-lg" type="submit">Publish to Marketplace</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab==='settings'&&(
            <div className="max-w-2xl mx-auto">
              <div className="mb-10"><h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Account Settings</h1><p className="text-slate-500 font-medium text-lg">Manage your profile, credits, and account.</p></div>
              {settingsMsg&&<div className={`mb-6 px-4 py-3 rounded-xl text-sm font-semibold border ${settingsMsg.includes('incorrect')||settingsMsg.includes('match')?'bg-rose-50 text-rose-600 border-rose-100':'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{settingsMsg}</div>}

              <div className="space-y-6">
                {/* Profile */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-display font-bold text-slate-900 mb-6">Profile</h3>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Email</label><input disabled className="w-full bg-slate-100 border border-slate-200 p-4 rounded-2xl font-medium text-slate-500 cursor-not-allowed" value={userInfo?.email||''} /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label><input className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900" value={settingsForm.company_name} onChange={e=>setSettingsForm({...settingsForm,company_name:e.target.value})} /></div>
                    <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-500 transition-all text-sm">Save Changes</button>
                  </form>
                </div>

                {/* Credits */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-display font-bold text-slate-900 mb-2">Credits</h3>
                  <p className="text-slate-500 text-sm mb-6">Current balance: <span className="text-emerald-600 font-bold text-lg">{userInfo?.credit_balance ?? '—'}</span> credits</p>
                  <div className="flex items-center gap-3">
                    <select className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl font-medium text-slate-700 outline-none focus:border-emerald-500 transition-all" value={topupAmount} onChange={e=>setTopupAmount(Number(e.target.value))}>
                      {[25,50,100,200,500].map(v=><option key={v} value={v}>+{v} credits</option>)}
                    </select>
                    <button onClick={handleTopup} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-400 transition-all text-sm">Top Up (Demo)</button>
                  </div>
                </div>

                {/* Change password */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-display font-bold text-slate-900 mb-6">Change Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label><input type="password" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400" value={passwordForm.current_password} onChange={e=>setPasswordForm({...passwordForm,current_password:e.target.value})} placeholder="••••••••" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">New Password</label><input type="password" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400" value={passwordForm.new_password} onChange={e=>setPasswordForm({...passwordForm,new_password:e.target.value})} placeholder="••••••••" /></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label><input type="password" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400" value={passwordForm.confirm} onChange={e=>setPasswordForm({...passwordForm,confirm:e.target.value})} placeholder="••••••••" /></div>
                    <button type="submit" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-500 transition-all text-sm">Update Password</button>
                  </form>
                </div>

                {/* Danger zone */}
                <div className="bg-white rounded-[2rem] p-8 border border-rose-100 shadow-sm">
                  <h3 className="text-lg font-display font-bold text-rose-600 mb-2">Danger Zone</h3>
                  <p className="text-slate-500 text-sm mb-5">Permanently delete your account and all associated agents, tasks, and dossier data. This cannot be undone.</p>
                  {!showDeleteConfirm?(
                    <button onClick={()=>setShowDeleteConfirm(true)} className="bg-rose-50 text-rose-600 border border-rose-200 px-6 py-3 rounded-2xl font-bold hover:bg-rose-500 hover:text-white transition-all text-sm">Delete My Account</button>
                  ):(
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
                      <p className="text-rose-700 font-bold mb-4">Are you absolutely sure? This will delete everything and cannot be undone.</p>
                      <div className="flex gap-3">
                        <button onClick={handleDeleteAccount} className="bg-rose-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-rose-600 transition-all text-sm">Yes, delete everything</button>
                        <button onClick={()=>setShowDeleteConfirm(false)} className="bg-white text-slate-600 border border-slate-200 px-6 py-3 rounded-2xl font-bold hover:border-slate-300 transition-all text-sm">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

/* ── AgentActivityAccordion ── */
function AgentActivityAccordion({ agents, token, logout, apiUrl }) {
  const [open, setOpen] = useState(null);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState({});

  const toggle = async (agentId) => {
    if (open === agentId) { setOpen(null); return; }
    setOpen(agentId);
    if (tasks[agentId]) return;
    setLoading(p => ({ ...p, [agentId]: true }));
    try {
      const res = await fetch(`${apiUrl}/tasks/history?agent_id=${agentId}&limit=10`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setTasks(p => ({ ...p, [agentId]: Array.isArray(data) ? data : [] }));
    } catch { setTasks(p => ({ ...p, [agentId]: [] })); }
    setLoading(p => ({ ...p, [agentId]: false }));
  };

  return (
    <div className="space-y-2">
      {agents.map(agent => (
        <div key={agent.agent_id} className="border border-slate-100 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggle(agent.agent_id)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">{agent.agent_name.charAt(0)}</div>
              <span className="font-bold text-slate-800 text-sm">{agent.agent_name}</span>
              <span className="text-xs text-slate-400 font-medium">{agent.count} task{agent.count !== 1 ? 's' : ''}</span>
            </div>
            <span className={`text-slate-400 text-sm transition-transform ${open === agent.agent_id ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {open === agent.agent_id && (
            <div className="px-5 pb-4 border-t border-slate-100">
              {loading[agent.agent_id] ? (
                <p className="text-sm text-slate-400 py-4 text-center">Loading…</p>
              ) : tasks[agent.agent_id]?.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No tasks found.</p>
              ) : (
                <div className="space-y-2 mt-3">
                  {tasks[agent.agent_id]?.map(t => (
                    <div key={t.task_id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{t.task_description}</p>
                        <p className="text-xs text-slate-400 font-medium">{new Date(t.timestamp).toLocaleString()}</p>
                      </div>
                      {t.delegated && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold shrink-0">A2A</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── NavButton ── */
function NavButton({ active, onClick, icon, children }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all relative z-10 ${active?'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20':'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}>
      <div className={active?'text-emerald-400':'text-slate-500'}>{icon}</div>
      <span className="tracking-wide text-sm">{children}</span>
    </button>
  );
}

/* ── Icons ── */
function BookIcon()    { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>; }
function TeamIcon()    { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>; }
function ClockIcon()   { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>; }
function MicIcon()     { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>; }
function ShopIcon()    { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>; }
function StarIcon()    { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>; }
function LogoutIcon()  { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>; }
function BoltIcon()    { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>; }
function AlertIcon()   { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>; }
function BellIcon()    { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>; }
function HistoryIcon() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>; }
function GearIcon()    { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>; }
function ChartIcon()   { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>; }

export default App;
