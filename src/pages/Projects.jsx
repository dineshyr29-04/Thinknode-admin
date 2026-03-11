import { useState } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import { useApp } from '../context/AppContext';
import { kanbanColumns } from '../data/dummyData';
import { Plus, X, Trash2 } from 'lucide-react';

const priorityColors = {
  High: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  Medium: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  Low: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
};

function ProjectModal({ project, clients, onClose, onSave }) {
  const [form, setForm] = useState(project || {
    name: '', client: '', clientId: '', service: 'Web Development',
    column: 'Lead', progress: 0, deadline: '', priority: 'Medium',
    notes: '', color: 'bg-blue-500',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">{project ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Project Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Nexus Website Redesign"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Client</label>
              <select value={form.clientId || ''} onChange={e => {
                const c = clients.find(c => c.id === Number(e.target.value));
                set('clientId', c?.id || ''); set('client', c?.name || '');
              }} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">— Select Client —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Stage</label>
              <select value={form.column} onChange={e => set('column', e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                {kanbanColumns.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Progress ({form.progress}%)</label>
            <input type="range" min="0" max="100" value={form.progress} onChange={e => set('progress', Number(e.target.value))}
              className="w-full accent-blue-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Notes</label>
            <textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={() => { if (form.name.trim()) { onSave(form); onClose(); } }} className="flex-1 px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
            {project ? 'Save Changes' : 'Add Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject, clients, isAdmin } = useApp();
  const [modal, setModal] = useState(null); // null | 'add' | project obj

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Summary row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 flex-1">
          {kanbanColumns.map(col => {
            const count = projects.filter(p => p.column === col).length;
            return (
              <div key={col} className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-xl font-bold text-slate-800 dark:text-white">{count}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{col}</p>
              </div>
            );
          })}
        </div>
        {isAdmin && (
          <button
            onClick={() => setModal('add')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex-shrink-0"
          >
            <Plus size={15} /> Add Project
          </button>
        )}
      </div>

      {/* Kanban */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Project Board</h2>
            <p className="text-xs text-slate-400 mt-0.5">Drag cards · status syncs to client automatically</p>
          </div>
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-medium">{projects.length} total</span>
        </div>
        <KanbanBoard onEdit={isAdmin ? p => setModal(p) : null} onDelete={isAdmin ? id => deleteProject(id) : null} />
      </div>

      {modal && (
        <ProjectModal
          project={modal === 'add' ? null : modal}
          clients={clients}
          onClose={() => setModal(null)}
          onSave={data => modal === 'add' ? addProject(data) : updateProject(modal.id, data)}
        />
      )}
    </div>
  );
}
