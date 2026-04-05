import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, Sun, Moon, Search, X, Menu, Shield, Eye, LogOut } from 'lucide-react';


const pageTitles = {
  '/': 'Dashboard',
  '/clients': 'Clients',
  '/projects': 'Projects',
  '/services': 'Services',
  '/automations': 'Automations',
  '/files': 'Files',
  '/payments': 'Payments',
  '/invoice': 'Invoice Generator',
  '/settings': 'Settings',
};

export default function Navbar() {
  const { darkMode, toggleDark, notifications, setSidebarOpen, currentUser, logout, isAdmin } = useApp();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [search, setSearch] = useState('');

  const title = pageTitles[location.pathname] ?? 'ThinkNode Dash';
  const unread = notifications.length;

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-4 px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700/50">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-2 -ml-1 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h1>
        <p className="text-xs text-slate-400">Welcome, {currentUser?.name || 'User'}</p>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 w-56">
        <Search size={14} className="text-slate-400 flex-shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 outline-none w-full"
        />
        {search && (
          <button onClick={() => setSearch('')}>
            <X size={12} className="text-slate-400" />
          </button>
        )}
      </div>

      {/* Role indicator */}
      {isAdmin && (
        <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700/50`}
        >
          <Shield size={13} />
          Admin
        </span>
      )}

      {/* Dark mode */}
      <button
        onClick={toggleDark}
        className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Toggle theme"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotif(s => !s)}
          className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        {showNotif && (
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[80vh] flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800 dark:text-white">Notifications</span>
              <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full">{unread} new</span>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-700 overflow-y-auto">
              {notifications.map(n => (
                <li key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      n.type === 'warning' ? 'bg-yellow-500' :
                      n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                      
                      {n.data && (n.data.customer_name || n.data.project_title) && (
                        <div className="mt-2 p-2.5 rounded-lg bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50">
                          {n.data.customer_name && (
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {n.data.customer_name}
                              </span>
                              {n.data.email && <span className="text-[10px] text-slate-500 truncate">{n.data.email}</span>}
                            </div>
                          )}
                          {n.data.project_title && (
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium line-clamp-1 mb-1">
                              {n.data.project_title}
                            </p>
                          )}
                          {(n.data.budget || n.data.service_type) && (
                            <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                              {n.data.service_type && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-bold uppercase tracking-wider">
                                  {n.data.service_type.replace('_', ' ')}
                                </span>
                              )}
                              {n.data.budget && (
                                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                  ${n.data.budget}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
              {notifications.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  <Bell size={24} className="mx-auto mb-2 opacity-50" />
                  No new notifications
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold hover:shadow-lg transition-shadow cursor-pointer"
          title={currentUser?.name}
        >
          {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
        </button>

        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{currentUser?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser?.email}</p>
            </div>
            <Link to="/settings">
              <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                ⚙️ Settings
              </button>
            </Link>
            <button
              onClick={() => {
                logout();
                setShowUserMenu(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 border-t border-slate-200 dark:border-slate-700"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

