import { useApp } from '../context/AppContext';
import StatsCard from '../components/StatsCard';
import WorkflowStatus from '../components/WorkflowStatus';
import {
  Users, FolderKanban, Clock, IndianRupee, Zap,
  RefreshCw, X, CheckCircle2, AlertTriangle, Info, Sparkles, TrendingUp
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { activityData } from '../data/dummyData';
import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';

const logIcons = {
  sync: <RefreshCw size={12} className="text-blue-400" />,
  success: <CheckCircle2 size={12} className="text-emerald-400" />,
  warning: <AlertTriangle size={12} className="text-amber-400" />,
  info: <Info size={12} className="text-slate-400" />,
};
const logBorder = {
  sync: 'border-l-blue-500',
  success: 'border-l-emerald-500',
  warning: 'border-l-amber-500',
  info: 'border-l-slate-400',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
        <p className="font-medium">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.value > 1000 ? `₹${(p.value / 1000).toFixed(0)}K` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieRevenueTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="min-w-[148px] rounded-xl border border-slate-200/80 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{point.name}</p>
      <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">₹{point.value.toLocaleString()}</p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400">{point.percent}% of revenue</p>
    </div>
  );
};

export default function Dashboard() {
  const { stats, workflows, projects, clients, syncLog, dismissLog, clearLog, serviceBreakdown, revenueData } = useApp();
  const [chartUpdating, setChartUpdating] = useState(false);
  const chartTimeoutRef = useRef(null);
  const prevRevenueRef = useRef(revenueData);
  const prevBreakdownRef = useRef(serviceBreakdown);

  // Show visual feedback when charts update
  useEffect(() => {
    const revenueChanged = JSON.stringify(prevRevenueRef.current) !== JSON.stringify(revenueData);
    const breakdownChanged = JSON.stringify(prevBreakdownRef.current) !== JSON.stringify(serviceBreakdown);
    
    if (revenueChanged || breakdownChanged) {
      setChartUpdating(true);
      prevRevenueRef.current = revenueData;
      prevBreakdownRef.current = serviceBreakdown;
      
      clearTimeout(chartTimeoutRef.current);
      chartTimeoutRef.current = setTimeout(() => {
        setChartUpdating(false);
      }, 800);
    }
    
    return () => clearTimeout(chartTimeoutRef.current);
  }, [revenueData, serviceBreakdown]);

  const statsCards = [
    { title: 'Total Clients', value: stats.totalClients, icon: Users, color: 'blue', trend: 12, subtitle: 'All time' },
    { title: 'Active Projects', value: stats.activeProjects, icon: FolderKanban, color: 'purple', trend: 8, subtitle: 'In progress' },
    { title: 'Pending Tasks', value: stats.pendingTasks, icon: Clock, color: 'orange', trend: -3, subtitle: 'Lead + Planning' },
    { title: 'Monthly Revenue', value: stats.monthlyRevenue, icon: IndianRupee, color: 'green', trend: 0, subtitle: 'This month (paid)' },
    { title: 'Active Automations', value: stats.activeAutomations, icon: Zap, color: 'pink', trend: 0, subtitle: 'Running workflows' },
  ];

  const recentProjects = projects.slice(0, 5);
  const recentClients = clients.slice(0, 4);

  const warnings = syncLog.filter(e => e.type === 'warning');

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* ── Sync Warning Banner ── */}
      {warnings.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl px-5 py-4 animate-fade-in">
          <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Attention Required</p>
            <ul className="mt-1 space-y-0.5">
              {warnings.map(w => (
                <li key={w.id} className="text-xs text-amber-700 dark:text-amber-400">{w.message}</li>
              ))}
            </ul>
          </div>
          <button onClick={() => warnings.forEach(w => dismissLog(w.id))} className="text-amber-400 hover:text-amber-600 transition-colors flex-shrink-0"><X size={16} /></button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {statsCards.map(card => <StatsCard key={card.title} {...card} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className={clsx('lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 transition-all', chartUpdating && 'ring-2 ring-blue-400 ring-opacity-50')}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Revenue Overview</h2>
              <p className="text-xs text-slate-400">Last 6 months</p>
            </div>
            <div className="flex items-center gap-2">
              {chartUpdating && (
                <span className="flex items-center gap-1.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg animate-pulse-glow">
                  <TrendingUp size={12} className="animate-spin-slow" />
                  Updating...
                </span>
              )}
              <span className="text-xs text-emerald-500 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                Total Earned: ₹{((stats.totalEarned ?? 0) / 1000).toFixed(0)}K
              </span>
            </div>
          </div>
          <div className={clsx('h-[220px] sm:h-[240px] transition-opacity', chartUpdating && 'opacity-75')}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Breakdown Pie */}
        <div className={clsx('bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 transition-all', chartUpdating && 'ring-2 ring-blue-400 ring-opacity-50')}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Service Revenue</h2>
              <p className="text-xs text-slate-400">Breakdown by service type</p>
            </div>
            {chartUpdating && (
              <RefreshCw size={12} className="text-blue-500 animate-spin" />
            )}
          </div>
          <div className="mt-4">
            {serviceBreakdown.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[160px] gap-2">
                <div className="relative w-[110px] h-[110px]">
                  <div className="w-full h-full rounded-full border-[10px] border-dashed border-slate-200 dark:border-slate-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IndianRupee size={22} className="text-slate-300 dark:text-slate-600" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-5">
                  No paid invoices yet<br />
                  Chart updates when income is added
                </p>
              </div>
            ) : (
              <>
                <div className={clsx('h-[190px] sm:h-[210px] transition-opacity', chartUpdating && 'opacity-75')}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        activeOuterRadius={78}
                        dataKey="value"
                        paddingAngle={3}
                      >
                        {serviceBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip content={<PieRevenueTooltip />} wrapperStyle={{ zIndex: 30 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {serviceBreakdown.map(s => (
                    <div key={s.name} className="flex items-center gap-1.5 min-w-0 animate-slide-in-up">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{s.name}: ₹{(s.value / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Workflow Activity + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Workflow Activity</h2>
          <p className="text-xs text-slate-400 mb-4">Executions this week</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="executions" fill="#10b981" radius={[4, 4, 0, 0]} name="Executions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Recent Projects</h2>
          {recentProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[130px] gap-2">
              <FolderKanban size={28} className="text-slate-300 dark:text-slate-600" />
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center leading-5">
                No projects yet<br />
                Add a project to see it here
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentProjects.map(p => (
                <li key={p.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{p.progress}%</p>
                    <div className="w-12 h-1 bg-slate-100 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Workflow Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Automation Status</h2>
          {workflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[130px] gap-2">
              <Zap size={28} className="text-slate-300 dark:text-slate-600" />
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center leading-5">
                No automations yet<br />
                Create a workflow to see status here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {workflows.map(w => (
                <div key={w.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{w.name}</p>
                    <p className="text-xs text-slate-400">{w.trigger}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    w.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>{w.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Sync Activity Log ── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-blue-500" />
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Cross-Page Sync Activity</h2>
            {syncLog.length > 0 && (
              <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">{syncLog.length}</span>
            )}
          </div>
          {syncLog.length > 0 && (
            <button onClick={clearLog} className="text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1">
              <X size={12} /> Clear all
            </button>
          )}
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
          {syncLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <CheckCircle2 size={28} className="text-emerald-400 opacity-60" />
              <p className="text-sm text-slate-400">All systems synced — no recent activity</p>
            </div>
          ) : (
            syncLog.map(entry => (
              <div
                key={entry.id}
                className={clsx(
                  'flex items-start gap-3 px-5 py-3 border-l-2 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors',
                  logBorder[entry.type] ?? 'border-l-slate-300'
                )}
              >
                <span className="mt-0.5 flex-shrink-0">{logIcons[entry.type] ?? logIcons.info}</span>
                <p className="flex-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{entry.message}</p>
                <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">{entry.time}</span>
                <button onClick={() => dismissLog(entry.id)} className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5">
                  <X size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
