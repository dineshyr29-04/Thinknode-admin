import { useApp } from '../context/AppContext';
import WorkflowStatus from '../components/WorkflowStatus';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { activityData } from '../data/dummyData';
import { Play, Pause, RefreshCw, Terminal } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function Automations() {
  const { workflows } = useApp();
  const [selectedWf, setSelectedWf] = useState(workflows[0]);

  const active = workflows.filter(w => w.status === 'Active').length;
  const totalExec = workflows.reduce((s, w) => s + w.executions, 0);
  const avgSuccess = Math.round(workflows.reduce((s, w) => s + w.successRate, 0) / workflows.length);

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Workflows', value: workflows.length, color: 'text-blue-500' },
          { label: 'Active', value: active, color: 'text-emerald-500' },
          { label: 'Total Executions', value: totalExec, color: 'text-purple-500' },
          { label: 'Avg Success Rate', value: `${avgSuccess}%`, color: 'text-yellow-500' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow list */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Workflows</h2>
          {workflows.map(w => (
            <div
              key={w.id}
              onClick={() => setSelectedWf(w)}
              className={clsx(
                'cursor-pointer rounded-xl border transition-all',
                selectedWf?.id === w.id
                  ? 'border-blue-500 ring-1 ring-blue-500/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              )}
            >
              <WorkflowStatus workflow={w} />
            </div>
          ))}
        </div>

        {/* Detail pane */}
        <div className="lg:col-span-2 space-y-4">
          {selectedWf && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-800 dark:text-white">{selectedWf.name}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Trigger: {selectedWf.trigger} · Client: {selectedWf.client}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors">
                      <RefreshCw size={14} />
                    </button>
                    <button className={clsx('p-2 rounded-lg border transition-colors text-white', selectedWf.status === 'Active' ? 'bg-yellow-500 border-yellow-500 hover:bg-yellow-600' : 'bg-emerald-500 border-emerald-500 hover:bg-emerald-600')}>
                      {selectedWf.status === 'Active' ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: 'Status', value: selectedWf.status },
                    { label: 'Executions', value: selectedWf.executions },
                    { label: 'Success Rate', value: `${selectedWf.successRate}%` },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white mt-1">{s.value}</p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">Last run: {selectedWf.lastRun}</p>
              </div>

              {/* Execution Logs */}
              <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-5 border border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal size={14} className="text-slate-400" />
                  <span className="text-xs font-semibold text-slate-300">Execution Logs</span>
                </div>
                <div className="space-y-2 font-mono">
                  {selectedWf.logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-slate-600 text-xs select-none">{String(i + 1).padStart(2, '0')}</span>
                      <p className={`text-xs ${log.includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>{log}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity chart */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Weekly Execution Activity</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }} />
                    <Bar dataKey="executions" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
