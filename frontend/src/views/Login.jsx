import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

function AuthLayout({ children, title, subtitle, quote, author }) {
  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-between p-12">
        <Link to="/" className="relative z-10 inline-block max-w-min">
          <Logo size="small" dark />
        </Link>
        <div className="relative z-10 max-w-lg mb-10">
          <div className="w-8 h-px bg-emerald-500 mb-6" />
          <p className="text-2xl font-medium text-white mb-6 leading-snug">{quote}</p>
          <p className="text-white font-semibold text-sm">{author.name}</p>
          <p className="text-slate-500 text-xs mt-0.5">{author.role}</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="mb-10 animate-fade-in-up">
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-3">Bottega</p>
            <h2 className="text-3xl font-bold text-slate-950 mb-2 tracking-tight">{title}</h2>
            <p className="text-slate-400 text-sm">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Login({ setToken, apiUrl }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const fd = new URLSearchParams();
    fd.append('username', email);
    fd.append('password', password);
    try {
      const res = await fetch(`${apiUrl}/login`, { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        navigate('/dashboard');
      } else {
        setError(data.detail);
      }
    } catch {
      setError('Login failed');
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to manage your AI workforce."
      quote="Since we hired our first AI agents, our efficiency doubled in two weeks."
      author={{ name: "Sarah Jenkins", role: "VP of Operations, Acme Corp" }}>
      {error && (
        <div className="bg-rose-50 text-rose-600 px-4 py-3 mb-6 text-sm font-medium border border-rose-100">{error}</div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">Email</label>
          <input
            className="w-full bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white outline-none transition-all"
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            required placeholder="name@company.com"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">Password</label>
          <input
            className="w-full bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white outline-none transition-all"
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            required placeholder="••••••••"
          />
        </div>
        <button
          className="w-full bg-slate-950 text-white py-3 text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all mt-2"
          type="submit">
          Sign In
        </button>
      </form>
      <p className="mt-8 text-sm text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-slate-900 font-semibold hover:text-emerald-600 transition-colors">Register here</Link>
      </p>
    </AuthLayout>
  );
}
