import { useApp } from '../context/AppContext';
import StatsCard from '../components/StatsCard';
import WorkflowStatus from '../components/WorkflowStatus';
import {
  Users, FolderKanban, Clock, IndianRupee, Zap
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { revenueData, serviceBreakdown, activityData } from '../data/dummyData';

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

export default function Dashboard() {
  const { stats, workflows, projects, clients } = useApp();

  const statsCards = [
    { title: 'Total Clients', value: stats.totalClients, icon: Users, color: 'blue', trend: 12, subtitle: 'All time' },
    { title: 'Active Projects', value: stats.activeProjects, icon: FolderKanban, color: 'purple', trend: 8, subtitle: 'In progress' },
    { title: 'Pending Tasks', value: stats.pendingTasks, icon: Clock, color: 'orange', trend: -3, subtitle: 'Lead + Planning' },
    { title: 'Monthly Revenue', value: stats.monthlyRevenue, icon: IndianRupee, color: 'green', trend: 24, subtitle: 'This month' },
    { title: 'Active Automations', value: stats.activeAutomations, icon: Zap, color: 'pink', trend: 0, subtitle: 'Running workflows' },
  ];

  const recentProjects = projects.slice(0, 5);
  const recentClients = clients.slice(0, 4);

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {statsCards.map(card => <StatsCard key={card.title} {...card} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Revenue Overview</h2>
              <p className="text-xs text-slate-400">Last 6 months</p>
            </div>
            <span className="text-xs text-emerald-500 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">↑ 24% this month</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
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

        {/* Service Breakdown Pie */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Service Revenue</h2>
          <p className="text-xs text-slate-400 mb-4">Breakdown by service type</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={serviceBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {serviceBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={v => `₹${(v / 1000).toFixed(0)}K`} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {serviceBreakdown.map(s => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{s.name}</span>
              </div>
            ))}
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
        </div>

        {/* Workflow Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Automation Status</h2>
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
        </div>
      </div>
    </div>
  );
}
