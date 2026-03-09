import KanbanBoard from '../components/KanbanBoard';
import { useApp } from '../context/AppContext';
import { kanbanColumns } from '../data/dummyData';

export default function Projects() {
  const { projects } = useApp();

  return (
    <div className="p-6 space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {kanbanColumns.map(col => {
          const count = projects.filter(p => p.column === col).length;
          return (
            <div key={col} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-xl font-bold text-slate-800 dark:text-white">{count}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{col}</p>
            </div>
          );
        })}
      </div>

      {/* Kanban */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Project Board</h2>
            <p className="text-xs text-slate-400 mt-0.5">Drag cards to update project status</p>
          </div>
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-medium">{projects.length} total projects</span>
        </div>
        <KanbanBoard />
      </div>
    </div>
  );
}
