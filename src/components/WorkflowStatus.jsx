import { Activity, CheckCircle, XCircle, PauseCircle } from 'lucide-react';
import clsx from 'clsx';

export default function WorkflowStatus({ workflow }) {
  const statusIcon = {
    Active: <CheckCircle size={14} className="text-emerald-500" />,
    Paused: <PauseCircle size={14} className="text-yellow-500" />,
    Error: <XCircle size={14} className="text-red-500" />,
  };

  const statusStyle = {
    Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-900/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <Activity size={16} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{workflow.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{workflow.trigger}</p>
          </div>
        </div>
        <span className={clsx('flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium', statusStyle[workflow.status])}>
          {statusIcon[workflow.status]}
          {workflow.status}
        </span>
      </div>

      {/* Success rate bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">Success Rate</span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{workflow.successRate}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full', workflow.successRate >= 95 ? 'bg-emerald-500' : workflow.successRate >= 80 ? 'bg-yellow-400' : 'bg-red-500')}
            style={{ width: `${workflow.successRate}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{workflow.executions} executions</span>
        <span>Last: {workflow.lastRun}</span>
      </div>
    </div>
  );
}
