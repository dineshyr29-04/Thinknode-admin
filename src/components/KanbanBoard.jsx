import {
  DndContext, closestCenter, DragOverlay,
  MouseSensor, TouchSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import ProjectCard from './ProjectCard';
import { useApp } from '../context/AppContext';
import { kanbanColumns } from '../data/dummyData';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

const colColors = {
  Lead: 'border-t-slate-400',
  Planning: 'border-t-blue-400',
  Development: 'border-t-purple-500',
  Testing: 'border-t-yellow-400',
  Delivered: 'border-t-emerald-500',
};

const colCountColors = {
  Lead: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  Planning: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  Development: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  Testing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

function SortableCard({ project, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <ProjectCard project={project} dragHandleProps={{ ...attributes, ...listeners }} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

function Column({ col, projects, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: col });

  return (
    <div className={clsx(
      'flex flex-col gap-3 min-h-[200px] p-3 rounded-xl transition-colors',
      isOver ? 'bg-blue-50 dark:bg-blue-900/10' : ''
    )} ref={setNodeRef}>
      <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
        {projects.map(p => <SortableCard key={p.id} project={p} onEdit={onEdit} onDelete={onDelete} />)}
      </SortableContext>
      {projects.length === 0 && (
        <div className={clsx('border-2 border-dashed rounded-xl p-6 text-center transition-colors',
          isOver ? 'border-blue-400' : 'border-slate-200 dark:border-slate-700'
        )}>
          <p className="text-xs text-slate-400">Drop here</p>
        </div>
      )}
    </div>
  );
}

export default function KanbanBoard({ onEdit, onDelete }) {
  const { projects, moveProject } = useApp();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const activeProject = projects.find(p => p.id === activeId);

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;
    const overCol = kanbanColumns.find(c => c === over.id);
    if (overCol && overCol !== projects.find(p => p.id === active.id)?.column) {
      moveProject(active.id, overCol);
      return;
    }
    const overProject = projects.find(p => p.id === over.id);
    if (overProject && overProject.column !== projects.find(p => p.id === active.id)?.column) {
      moveProject(active.id, overProject.column);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {kanbanColumns.map(col => {
          const colProjects = projects.filter(p => p.column === col);
          return (
            <div key={col} className={clsx('bg-slate-50 dark:bg-slate-800/50 rounded-xl border-t-4 min-w-[220px]', colColors[col])}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{col}</span>
                <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full', colCountColors[col])}>
                  {colProjects.length}
                </span>
              </div>
              <Column col={col} projects={colProjects} onEdit={onEdit} onDelete={onDelete} />
            </div>
          );
        })}
      </div>
      <DragOverlay>
        {activeProject && (
          <div className="rotate-2 scale-105 shadow-2xl">
            <ProjectCard project={activeProject} dragHandleProps={{}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
