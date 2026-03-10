import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Users, FolderKanban, Layers, Zap,
  Files, CreditCard, Settings, X
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
  const [hovered, setHovered] = useState(false);

  // Labels animate in when hovered on desktop OR when mobile drawer is open
  const showLabels = hovered || sidebarOpen;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={clsx(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 lg:hidden',
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />

      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={clsx(
          // Layout
          'fixed lg:sticky top-0 left-0 h-screen flex flex-col z-40 overflow-hidden',
          // Background & border
          'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950',
          'border-r border-white/[0.06] shadow-[4px_0_24px_rgba(0,0,0,0.3)]',
          // Smooth transition for width and slide
          'transition-[width,transform] duration-300 ease-in-out',
          // Mobile: slide in via transform; desktop: always visible
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          // Width: mobile=256px always; desktop=72px collapsed, 256px on hover
          showLabels ? 'w-64' : 'w-64 lg:w-[72px]',
        )}
      >
        {/* ── Logo ─────────────────────────────── */}
        <div className="flex items-center gap-3 h-16 px-[18px] border-b border-white/[0.06] flex-shrink-0">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-blue-500/40 bg-slate-800">
            <img src="/logo.jpeg" alt="ThinkNode" className="w-full h-full object-cover" />
          </div>

          {/* Title — fades in with labels */}
          <div className={clsx(
            'overflow-hidden transition-all duration-200',
            showLabels ? 'opacity-100 w-36' : 'opacity-0 w-0'
          )}>
            <span className="block text-white text-sm font-bold tracking-widest whitespace-nowrap">
              THINKNODE
            </span>
            <span className="block text-blue-400/60 text-[9px] tracking-[0.15em] uppercase whitespace-nowrap mt-0.5">
              Dashboard
            </span>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Section label ─────────────────────── */}
        <div className={clsx(
          'overflow-hidden transition-all duration-200 flex-shrink-0 px-5',
          showLabels ? 'max-h-10 opacity-100 pt-5 pb-1' : 'max-h-0 opacity-0 py-0'
        )}>
          <span className="text-[9px] font-bold text-slate-600 tracking-[0.2em] uppercase">
            Main Menu
          </span>
        </div>

        {/* ── Nav ──────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin py-3">
          <ul className="space-y-0.5 px-2.5">
            {navItems.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => clsx(
                    'group relative flex items-center gap-3.5 px-3 py-[11px] rounded-xl text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-black-600/90 text-white shadow-lg shadow-blue-600/30'
                      : 'text-violet-100 hover:text-white hover:bg-white/[0.07]'
                  )}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active accent bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-200 rounded-r-full" />
                      )}

                      <Icon size={18} className="flex-shrink-0" />

                      <span className={clsx(
                        'whitespace-nowrap transition-all duration-200 overflow-hidden leading-none',
                        showLabels ? 'opacity-100 max-w-[140px]' : 'opacity-0 max-w-0'
                      )}>
                        {label}
                      </span>

                      {/* Tooltip — only visible briefly before hover expands sidebar */}
                      {!showLabels && (
                        <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 border border-white/10 text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                          {label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Footer / User ─────────────────────── */}
        <div className="p-3 border-t border-white/[0.06] flex-shrink-0">
          <Link to="/settings" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.07] cursor-pointer transition-colors">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md">
              TN
            </div>
            <div className={clsx(
              'overflow-hidden transition-all duration-200',
              showLabels ? 'opacity-100 w-32' : 'opacity-0 w-0'
            )}>
              <p className="text-white text-xs font-semibold whitespace-nowrap">ThinkNode</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
                <p className="text-slate-400 text-[11px] whitespace-nowrap">Online</p>
              </div>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
