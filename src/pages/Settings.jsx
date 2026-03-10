import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Bell, Palette, Moon, Sun, Check, Pencil, X, KeyRound, Eye, EyeOff, Shield, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const iCls = 'w-full bg-slate-50 dark:bg-slate-700/80 text-sm text-slate-700 dark:text-slate-200 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all';

const Card = ({ children, className = '' }) => (
  <div className={clsx('bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm overflow-hidden', className)}>
    {children}
  </div>
);

const CardHeader = ({ icon, title, action }) => (
  <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-700/60">
    <div className="flex items-center gap-2.5">
      <span className="text-blue-500">{icon}</span>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
    </div>
    {action}
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2.5 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
    <span className="text-xs font-medium text-slate-400 sm:w-28 flex-shrink-0">{label}</span>
    <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">{value}</span>
  </div>
);

export default function Settings() {
  const { darkMode, toggleDark } = useApp();

  // Profile
  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState({ name: 'Vicky Thinknode', email: 'vicky@thinknode.in', role: 'Admin', bio: 'Freelance developer & designer.' });
  const [draft, setDraft] = useState({ ...profile });

  // Password (inside edit mode)
  const [showPwSection, setShowPwSection] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  // Notifications
  const [notifs, setNotifs] = useState({ projectUpdates: true, paymentAlerts: true, automationAlerts: false, weeklyReport: true });

  const handleSaveProfile = () => {
    setProfile({ ...draft });
    setEditingProfile(false);
    setShowPwSection(false);
  };

  const handleCancelProfile = () => {
    setDraft({ ...profile });
    setEditingProfile(false);
    setShowPwSection(false);
    setPwError('');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleSavePassword = () => {
    setPwError('');
    if (!passwords.current) return setPwError('Enter your current password.');
    if (passwords.new.length < 8) return setPwError('New password must be at least 8 characters.');
    if (passwords.new !== passwords.confirm) return setPwError('Passwords do not match.');
    setPwSaved(true);
    setPasswords({ current: '', new: '', confirm: '' });
    setTimeout(() => { setPwSaved(false); setShowPwSection(false); }, 2000);
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage your account, preferences and notifications</p>
      </div>

      {/* â”€â”€ Full-width responsive grid â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* â•”â•â• LEFT COL â€” Profile (spans 2 on lg) â•â•â•— */}
        <div className="lg:col-span-2 space-y-5">

          {/* Profile Card */}
          <Card>
            <CardHeader
              icon={<User size={16} />}
              title="Profile"
              action={
                editingProfile ? (
                  <div className="flex gap-2">
                    <button onClick={handleCancelProfile} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      <X size={12} /> Cancel
                    </button>
                    <button onClick={handleSaveProfile} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20">
                      <Check size={12} /> Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setDraft({ ...profile }); setEditingProfile(true); }}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                  >
                    <Pencil size={12} /> Edit Profile
                  </button>
                )
              }
            />
            <div className="p-5">
              {/* Avatar row */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg shadow-blue-500/30">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800 dark:text-white">{profile.name}</p>
                  <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium">
                    {profile.role}
                  </span>
                </div>
              </div>

              {/* View mode */}
              {!editingProfile && (
                <div>
                  <DetailRow label="Full Name" value={profile.name} />
                  <DetailRow label="Email" value={profile.email} />
                  <DetailRow label="Role" value={profile.role} />
                  <DetailRow label="Bio" value={profile.bio} />
                </div>
              )}

              {/* Edit mode */}
              {editingProfile && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                      <input value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))} className={iCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email</label>
                      <input type="email" value={draft.email} onChange={e => setDraft(p => ({ ...p, email: e.target.value }))} className={iCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Role</label>
                      <select value={draft.role} onChange={e => setDraft(p => ({ ...p, role: e.target.value }))} className={iCls}>
                        <option>Admin</option><option>Developer</option><option>Designer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Bio</label>
                      <textarea value={draft.bio} onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))} rows={1} className={iCls + ' resize-none'} />
                    </div>
                  </div>

                  {/* â”€â”€ Change Password toggle (inside edit mode) â”€â”€ */}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => { setShowPwSection(s => !s); setPwError(''); }}
                      className="flex items-center gap-2 w-full px-4 py-3 mt-1 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-sm text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    >
                      <KeyRound size={14} />
                      <span className="flex-1 text-left font-medium">Change Password</span>
                      <ChevronDown size={14} className={clsx('transition-transform duration-200', showPwSection && 'rotate-180')} />
                    </button>

                    {/* Password fields â€” slide in */}
                    <div className={clsx('overflow-hidden transition-all duration-300', showPwSection ? 'max-h-96 mt-3' : 'max-h-0')}>
                      <div className="space-y-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        {[['current', 'Current Password'], ['new', 'New Password'], ['confirm', 'Confirm Password']].map(([key, label]) => (
                          <div key={key}>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
                            <div className="relative">
                              <input
                                type={showPw[key] ? 'text' : 'password'}
                                value={passwords[key]}
                                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                                className={iCls + ' pr-10'}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                              >
                                {showPw[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                          </div>
                        ))}
                        {pwError && (
                          <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 px-3 py-2 rounded-xl">{pwError}</p>
                        )}
                        <button
                          onClick={handleSavePassword}
                          className={clsx('flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all w-full justify-center',
                            pwSaved ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                          )}
                        >
                          {pwSaved ? <><Check size={14} /> Password Updated!</> : <><Shield size={14} /> Update Password</>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Notifications Card */}
          <Card>
            <CardHeader icon={<Bell size={16} />} title="Notifications" />
            <div className="p-5 space-y-1">
              {[
                { key: 'projectUpdates', label: 'Project Updates', desc: 'Notify when project status changes' },
                { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Notify on invoice due or payment received' },
                { key: 'automationAlerts', label: 'Automation Alerts', desc: 'Notify on workflow errors' },
                { key: 'weeklyReport', label: 'Weekly Report', desc: 'Get weekly summary via email' },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{n.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                    className={clsx('relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ml-4', notifs[n.key] ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600')}
                  >
                    <span className={clsx('absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', notifs[n.key] && 'translate-x-5')} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* â•”â•â• RIGHT COL â•â•â•— */}
        <div className="space-y-5">

          {/* Appearance */}
          <Card>
            <CardHeader icon={<Palette size={16} />} title="Appearance" />
            <div className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Dark Mode</p>
                  <p className="text-xs text-slate-400 mt-0.5">Switch between light and dark theme</p>
                </div>
                <button
                  onClick={toggleDark}
                  className={clsx('relative w-12 h-6 rounded-full transition-colors flex-shrink-0', darkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600')}
                >
                  <span className={clsx('absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform flex items-center justify-center', darkMode && 'translate-x-6')}>
                    {darkMode ? <Moon size={8} className="text-blue-500" /> : <Sun size={8} className="text-slate-400" />}
                  </span>
                </button>
              </div>
            </div>
          </Card>

          {/* Account info */}
          <Card>
            <CardHeader icon={<Shield size={16} />} title="Account" />
            <div className="p-5 space-y-3">
              {[
                { label: 'Account Type', value: 'Freelancer Pro' },
                { label: 'Member Since', value: 'Jan 2025' },
                { label: 'Last Login', value: 'Today, 9:41 AM' },
                { label: 'Status', value: 'ðŸŸ¢ Active' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                  <span className="text-xs text-slate-400">{r.label}</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{r.value}</span>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
