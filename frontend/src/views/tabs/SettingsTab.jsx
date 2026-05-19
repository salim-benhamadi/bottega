import React from 'react';

export default function SettingsTab({
  userInfo,
  settingsForm,
  setSettingsForm,
  passwordForm,
  setPasswordForm,
  settingsMsg,
  topupAmount,
  setTopupAmount,
  showDeleteConfirm,
  setShowDeleteConfirm,
  handleSaveProfile,
  handleTopup,
  handleChangePassword,
  handleDeleteAccount,
  creditHistory = []
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-2">Configure</p>
        <h1 className="text-3xl font-bold text-slate-950 mb-2 tracking-tight">Account Settings</h1>
        <p className="text-slate-400 text-sm">Manage your organization profile, credits ledger, and authentication.</p>
      </div>

      {settingsMsg && (
        <div className={`mb-6 px-5 py-4 text-sm font-medium border animate-fade-in-up ${
          settingsMsg.includes('incorrect') || settingsMsg.includes('match')
            ? 'bg-rose-50 text-rose-600 border-rose-200'
            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
        }`}>
          {settingsMsg}
        </div>
      )}

      <div className="space-y-4">
        {/* Profile */}
        <div className="bg-white border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">Profile</p>
            <h3 className="text-base font-semibold text-slate-900">Organization Profile</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 px-4 py-3 text-sm font-medium text-slate-400 cursor-not-allowed"
                  value={userInfo?.email || ''}
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">Company Name</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white outline-none transition-all"
                  value={settingsForm.company_name}
                  onChange={e => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                  placeholder="Acme Corp"
                />
              </div>
              <button type="submit"
                className="bg-slate-950 text-white px-5 py-2.5 text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all">
                Save Profile
              </button>
            </form>
          </div>
        </div>

        {/* Credits */}
        <div className="bg-white border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">Balance</p>
            <h3 className="text-base font-semibold text-slate-900">Credit Balance</h3>
          </div>
          <div className="p-6">
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-4xl font-bold text-emerald-600 tracking-tight">{userInfo?.credit_balance ?? '—'}</span>
              <span className="text-sm text-slate-400">credits available</span>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 transition-all cursor-pointer"
                value={topupAmount}
                onChange={e => setTopupAmount(Number(e.target.value))}
              >
                {[25, 50, 100, 200, 500].map(v => <option key={v} value={v}>+{v} credits</option>)}
              </select>
              <button onClick={handleTopup}
                className="bg-slate-950 text-white px-5 py-2.5 text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all">
                Top Up
              </button>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">Security</p>
            <h3 className="text-base font-semibold text-slate-900">Authentication</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleChangePassword} className="space-y-4">
              {[
                { label: 'Current Password', key: 'current_password' },
                { label: 'New Password',     key: 'new_password' },
                { label: 'Confirm Password', key: 'confirm' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">{label}</label>
                  <input
                    type="password"
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white outline-none transition-all"
                    value={passwordForm[key]}
                    onChange={e => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              ))}
              <button type="submit"
                className="bg-slate-950 text-white px-5 py-2.5 text-sm font-medium hover:bg-emerald-600 active:scale-95 transition-all">
                Update Credentials
              </button>
            </form>
          </div>
        </div>

        {/* Credit History */}
        <div className="bg-white border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">Ledger</p>
            <h3 className="text-base font-semibold text-slate-900">Credit History</h3>
          </div>
          <div className="p-6">
            {creditHistory.length === 0 ? (
              <p className="text-sm text-slate-400">No transactions yet.</p>
            ) : (
              <div className="space-y-0 max-h-72 overflow-y-auto">
                {creditHistory.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{tx.description}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`text-sm font-bold tabular-nums ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} cr
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white border border-rose-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-rose-100">
            <p className="text-[10px] font-medium text-rose-400 uppercase tracking-widest mb-0.5">Irreversible</p>
            <h3 className="text-base font-semibold text-rose-600">Danger Zone</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-500 mb-5">
              Permanently purge your organization profile, agent hires, swarm histories, and all Dossier memory. This cannot be reversed.
            </p>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="border border-rose-200 text-rose-600 bg-rose-50 px-5 py-2.5 text-sm font-medium hover:bg-rose-500 hover:text-white hover:border-transparent active:scale-95 transition-all">
                Delete Account
              </button>
            ) : (
              <div className="bg-rose-50 border border-rose-100 p-5">
                <p className="text-sm font-semibold text-rose-700 mb-4">Are you absolutely sure? This will delete all active operational nodes.</p>
                <div className="flex gap-3">
                  <button onClick={handleDeleteAccount}
                    className="bg-rose-500 text-white px-5 py-2.5 text-sm font-medium hover:bg-rose-600 active:scale-95 transition-all">
                    Yes, delete everything
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)}
                    className="bg-white text-slate-600 border border-slate-200 px-5 py-2.5 text-sm font-medium hover:border-slate-300 active:scale-95 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
