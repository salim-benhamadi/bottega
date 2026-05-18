import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import Dashboard from './views/Dashboard';
import Onboarding from './views/Onboarding';

const API_URL = "http://localhost:8000/api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const onboardingDone = localStorage.getItem('bottega_onboarding_done') === 'true';

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
        <Routes>
          <Route path="/" element={<Home token={token} />} />
          <Route path="/login" element={<Login setToken={setToken} apiUrl={API_URL} />} />
          <Route path="/register" element={<Register setToken={setToken} apiUrl={API_URL} />} />
          <Route path="/onboarding" element={
            !token ? <Navigate to="/login" /> :
            onboardingDone ? <Navigate to="/dashboard" /> :
            <Onboarding />
          } />
          <Route path="/dashboard/*" element={token ? <Dashboard token={token} setToken={setToken} apiUrl={API_URL} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
