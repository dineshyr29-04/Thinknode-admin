import { Globe, AppWindow, Image, Zap, ExternalLink, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import { webProjects, frontendApps, posterProjects, workflows } from '../data/dummyData';
import clsx from 'clsx';

const deployStatus = {
  'In Progress': { style: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', icon: <Clock size={12} /> },
  Testing: { style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', icon: <AlertCircle size={12} /> },
  Delivered: { style: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400', icon: <CheckCircle size={12} /> },
};

function SectionHeader({ icon: Icon, color, title, count }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-xl ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white">{title}</h2>
        <p className="text-xs text-slate-400">{count} items</p>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <div className="p-6 space-y-8">

      {/* Web Development */}
      <section>
        <SectionHeader icon={Globe} color="bg-blue-600" title="Web Development" count={webProjects.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {webProjects.map(p => {
            const st = deployStatus[p.status] ?? deployStatus['In Progress'];
            return (
              <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{p.client}</p>
                  </div>
                  <span className={clsx('flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium', st.style)}>
                    {st.icon}{p.status}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Domain</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{p.domain}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Hosting</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{p.hosting}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frontend Apps */}
      <section>
        <SectionHeader icon={AppWindow} color="bg-purple-600" title="Frontend Applications" count={frontendApps.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {frontendApps.map(app => {
            const st = deployStatus[app.uiStatus] ?? deployStatus['In Progress'];
            return (
              <div key={app.id} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{app.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{app.client}</p>
                  </div>
                  <span className={clsx('flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium', st.style)}>
                    {st.icon}{app.uiStatus}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Framework</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{app.framework}</span>
                  </div>
                </div>
                <a href={app.deployLink} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 transition-colors">
                  <ExternalLink size={12} />Deployment Link
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* E-Poster Design */}
      <section>
        <SectionHeader icon={Image} color="bg-pink-600" title="E-Poster Design" count={posterProjects.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posterProjects.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all">
              <div className="flex items-center gap-4 p-5">
                <img src={p.preview} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white truncate">{p.name}</h3>
                    <span className={clsx('text-xs px-2 py-0.5 rounded-full flex-shrink-0', p.approvalStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400')}>
                      {p.approvalStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{p.client} · v{p.versions} versions</p>
                  <div className="flex flex-wrap gap-1">
                    {p.files.map(f => (
                      <span key={f} className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Download size={10} />{f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* n8n Automation */}
      <section>
        <SectionHeader icon={Zap} color="bg-emerald-600" title="n8n Automation Workflows" count={workflows.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map(w => (
            <div key={w.id} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{w.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{w.trigger} · {w.client}</p>
                </div>
                <span className={clsx('text-xs px-2 py-1 rounded-full font-medium', w.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400')}>
                  {w.status}
                </span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400">Success Rate</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{w.successRate}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${w.successRate >= 95 ? 'bg-emerald-500' : 'bg-yellow-400'}`} style={{ width: `${w.successRate}%` }} />
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 space-y-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Recent Logs</p>
                {w.logs.slice(0, 3).map((log, i) => (
                  <p key={i} className={`text-xs font-mono ${log.includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>{log}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
