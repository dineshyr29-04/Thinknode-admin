import { createContext, useContext, useState } from 'react';
import {
  clients as initialClients,
  projects as initialProjects,
  workflows as initialWorkflows,
  payments as initialPayments,
  files as initialFiles,
} from '../data/dummyData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [clients, setClients] = useState(initialClients);
  const [projects, setProjects] = useState(initialProjects);
  const [workflows] = useState(initialWorkflows);
  const [payments] = useState(initialPayments);
  const [files] = useState(initialFiles);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState([
    { id: 1, text: 'Invoice INV-002 is overdue', type: 'warning', time: '2h ago' },
    { id: 2, text: 'Workflow "Form Submit → Slack" paused', type: 'error', time: '5h ago' },
    { id: 3, text: 'New client Meena Pillai added', type: 'info', time: '1d ago' },
  ]);

  const toggleDark = () => {
    setDarkMode(d => !d);
    document.documentElement.classList.toggle('dark');
  };

  // Init dark mode on first load
  if (darkMode) document.documentElement.classList.add('dark');

  const addClient = (client) => {
    setClients(prev => [...prev, { ...client, id: Date.now(), avatar: client.name.split(' ').map(n => n[0]).join('').toUpperCase(), color: 'bg-indigo-500', projects: [] }]);
  };
  const updateClient = (id, data) => setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  const deleteClient = (id) => setClients(prev => prev.filter(c => c.id !== id));

  const moveProject = (projectId, toColumn) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, column: toColumn } : p));
  };

  const stats = {
    totalClients: clients.length,
    activeProjects: projects.filter(p => p.column !== 'Delivered').length,
    pendingTasks: projects.filter(p => ['Lead', 'Planning'].includes(p.column)).length,
    monthlyRevenue: payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0),
    activeAutomations: workflows.filter(w => w.status === 'Active').length,
  };

  return (
    <AppContext.Provider value={{
      clients, addClient, updateClient, deleteClient,
      projects, moveProject,
      workflows, payments, files,
      darkMode, toggleDark,
      sidebarOpen, setSidebarOpen,
      notifications, stats,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
