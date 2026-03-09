import clsx from 'clsx';

export default function StatsCard({ title, value, subtitle, icon: Icon, color, trend }) {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-emerald-500/10 text-emerald-500',
    purple: 'bg-purple-500/10 text-purple-500',
    orange: 'bg-orange-500/10 text-orange-500',
    pink: 'bg-pink-500/10 text-pink-500',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-900/30 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={clsx('p-2.5 rounded-lg', colorMap[color] ?? colorMap.blue)}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={clsx(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            trend >= 0
              ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400'
              : 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
          )}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          {typeof value === 'number' && value >= 1000
            ? `₹${(value / 1000).toFixed(0)}K`
            : value}
        </p>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
        {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
