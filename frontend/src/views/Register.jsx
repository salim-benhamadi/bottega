import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

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

export default function Register({ setToken, apiUrl }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, company_name: companyName })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        navigate('/dashboard');
      } else {
        setError(data.detail);
      }
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <AuthLayout title="Build your team" subtitle="Create your free Bottega workspace."
      quote="I used to spend 15 hours a week on proposals. Now my AI agent does it in seconds."
      author={{ name: "Marcus Cole", role: "Founder, Zenith Agency" }}>
      {error && <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold border border-rose-100">{error}</div>}
      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Company</label>
          <input className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400" type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required placeholder="Acme Corp" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Work Email</label>
          <input className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="jane@company.com" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
          <input className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
        </div>
        <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all text-lg" type="submit">Create Workspace</button>
      </form>
      <p className="mt-8 text-sm text-slate-500">Already have an account? <Link to="/login" className="text-emerald-600 font-bold">Sign in</Link></p>
    </AuthLayout>
  );
}
