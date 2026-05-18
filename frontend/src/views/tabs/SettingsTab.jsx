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
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1.5">Configure</p>
        <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-2">Account Settings</h1>
        <p className="text-slate-500 font-medium text-lg">Manage your organization profile, credits ledger, and authentication.</p>
      </div>

      {settingsMsg && (
        <div className={`mb-6 px-5 py-4 rounded-2xl text-sm font-semibold border animate-fade-in-up ${
          settingsMsg.includes('incorrect') || settingsMsg.includes('match')
            ? 'bg-rose-50 text-rose-600 border-rose-100'
            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
        }`}>
          {settingsMsg}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
          <div className="p-8">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Organization Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 p-4 rounded-2xl font-medium text-slate-400 cursor-not-allowed"
                  value={userInfo?.email || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                <input
                  className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                  value={settingsForm.company_name}
                  onChange={e => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                  placeholder="Acme Corp"
                />
              </div>
              <button type="submit"
                className="bg-slate-900 text-white py-4 px-8 rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all">
                Save Profile
              </button>
            </form>
          </div>
        </div>

        {/* Credits */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
          <div className="p-8">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Credit Balance</h3>
            <p className="text-slate-500 font-medium mb-6">
              Available reserves:
              <span className="text-emerald-600 font-extrabold text-3xl font-display ml-2">{userInfo?.credit_balance ?? '—'}</span>
              <span className="text-slate-400 text-sm ml-1">credits</span>
            </p>
            <div className="flex items-center gap-3">
              <select
                className="bg-white border border-slate-200 p-4 rounded-2xl font-bold text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer"
                value={topupAmount}
                onChange={e => setTopupAmount(Number(e.target.value))}
              >
                {[25, 50, 100, 200, 500].map(v => <option key={v} value={v}>+{v} credits</option>)}
              </select>
              <button onClick={handleTopup}
                className="bg-emerald-500 text-white py-4 px-8 rounded-2xl font-bold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all">
                Top Up Balance
              </button>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
          <div className="p-8">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Security & Authentication</h3>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                <input type="password"
                  className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                  value={passwordForm.current_password}
                  onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                <input type="password"
                  className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                  value={passwordForm.new_password}
                  onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                <input type="password"
                  className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-slate-900 placeholder-slate-400"
                  value={passwordForm.confirm}
                  onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <button type="submit"
                className="bg-slate-900 text-white py-4 px-8 rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all">
                Update Credentials
              </button>
            </form>
          </div>
        </div>

        {/* Credit History */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
          <div className="p-8">
            <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Credit History</h3>
            <p className="text-slate-500 font-medium mb-5">Last 50 transactions on your account.</p>
            {creditHistory.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium">No transactions yet.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {creditHistory.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{tx.description}</p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`text-sm font-extrabold tabular-nums ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} cr
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 via-rose-400 to-transparent" />
          <div className="p-8">
            <h3 className="text-xl font-display font-bold text-rose-600 mb-2">Danger Zone</h3>
            <p className="text-slate-500 font-medium mb-6">
              Permanently purge your organization profile, agent hires, swarm histories, and all Dossier memory. This cannot be reversed.
            </p>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="bg-rose-50 text-rose-600 border border-rose-200 py-4 px-8 rounded-2xl font-bold hover:bg-rose-500 hover:text-white hover:border-transparent hover:shadow-lg active:scale-95 transition-all">
                Delete Account
              </button>
            ) : (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
                <p className="text-rose-700 font-bold mb-5">Are you absolutely sure? This will delete all active operational nodes.</p>
                <div className="flex gap-3">
                  <button onClick={handleDeleteAccount}
                    className="bg-rose-500 text-white py-4 px-6 rounded-2xl font-bold hover:bg-rose-600 hover:shadow-lg active:scale-95 transition-all">
                    Yes, delete everything
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)}
                    className="bg-white text-slate-600 border border-slate-200 py-4 px-6 rounded-2xl font-bold hover:border-slate-300 active:scale-95 transition-all">
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
