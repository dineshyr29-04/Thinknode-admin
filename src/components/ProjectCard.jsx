import { Paperclip, Calendar, Edit3, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { emit as socketEmit } from '../socket';

const priorityMap = {
  High: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
};

const serviceColorMap = {
  'Web Development': 'bg-blue-500',
  'Frontend Development': 'bg-purple-500',
  'E-Poster Design': 'bg-pink-500',
  'n8n Automation': 'bg-emerald-500',
};

export default function ProjectCard({ project, dragHandleProps, onEdit, onDelete }) {
  const isOverdue = new Date(project.deadline) < new Date() && project.column !== 'Delivered';

  return (
    <div
      {...dragHandleProps}
      className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md dark:hover:shadow-slate-900/30 cursor-grab active:cursor-grabbing transition-all duration-150 select-none"
    >
      {/* Service badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', serviceColorMap[project.service] ?? 'bg-slate-400')} />
        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{project.service}</span>
        <span className={clsx('ml-auto text-xs px-2 py-0.5 rounded-full font-medium', priorityMap[project.priority])}>
          {project.priority}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1 leading-snug">{project.name}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{project.client}</p>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">Progress</span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all', serviceColorMap[project.service] ?? 'bg-blue-500')}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className={clsx('flex items-center gap-1', isOverdue ? 'text-red-500' : 'text-slate-400')}>
          <Calendar size={11} />
          <span>{new Date(project.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          {isOverdue && <span className="font-medium">· Overdue</span>}
        </div>
        <div className="flex items-center gap-1">
          {project.attachments > 0 && (
            <span className="flex items-center gap-0.5 text-slate-400 mr-1">
              <Paperclip size={11} />{project.attachments}
            </span>
          )}
          {onEdit && (
            <button
              onClick={e => { e.stopPropagation(); onEdit(project); }}
              className="p-1 rounded text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Edit3 size={11} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={e => { e.stopPropagation(); onDelete(project.id); try { socketEmit('project:deleted', { id: project.id }); } catch (err) {} }}
              className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
