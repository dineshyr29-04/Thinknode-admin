import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Users, FolderKanban, Layers, Zap,
  Files, CreditCard, Settings, ChevronLeft, ChevronRight, Code2
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/services', label: 'Services', icon: Layers },
  { to: '/automations', label: 'Automations', icon: Zap },
  { to: '/files', label: 'Files', icon: Files },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <aside className={clsx(
      'h-screen sticky top-0 flex flex-col bg-slate-900 dark:bg-slate-950 border-r border-slate-700/50 transition-all duration-300 z-40',
      sidebarOpen ? 'w-60' : 'w-16'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-700/50">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Code2 size={16} className="text-white" />
        </div>
        {sidebarOpen && (
          <span className="font-bold text-white text-sm tracking-wide">THINKNODE</span>
        )}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className={clsx(
            'ml-auto text-slate-400 hover:text-white transition-colors p-1 rounded',
            !sidebarOpen && 'hidden'
          )}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Collapsed toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="mx-auto mt-2 text-slate-400 hover:text-white transition-colors p-2 rounded"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1 px-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            TN
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">ThinkNode</p>
              <p className="text-slate-400 text-xs truncate">Freelancer</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
