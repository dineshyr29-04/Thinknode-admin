import { createContext, useContext, useState, useCallback } from 'react';
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
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [payments, setPayments] = useState(initialPayments);
  const [files, setFiles] = useState(initialFiles);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Invoice INV-002 is overdue', type: 'warning', time: '2h ago' },
    { id: 2, text: 'Workflow "Form Submit → Slack" paused', type: 'error', time: '5h ago' },
    { id: 3, text: 'New client Meena Pillai added', type: 'info', time: '1d ago' },
  ]);
  const [syncLog, setSyncLog] = useState([]);

  const toggleDark = () => {
    setDarkMode(d => !d);
    document.documentElement.classList.toggle('dark');
  };

  if (darkMode) document.documentElement.classList.add('dark');

  // ── SYNC LOG (shown on Dashboard) ────────────────────────────────────────────
  const pushLog = useCallback((message, type = 'info') => {
    const entry = {
      id: Date.now() + Math.random(),
      message,
      type,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
    setSyncLog(prev => [entry, ...prev].slice(0, 20));
  }, []);

  const dismissLog = useCallback((id) => setSyncLog(prev => prev.filter(e => e.id !== id)), []);
  const clearLog = useCallback(() => setSyncLog([]), []);

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
  const addNotification = useCallback((text, type = 'info') => {
    setNotifications(prev => [{ id: Date.now(), text, type, time: 'just now' }, ...prev]);
  }, []);

  // ── CLIENTS ─────────────────────────────────────────────────────────────────
  const addClient = useCallback((client) => {
    const newClient = {
      ...client,
      id: Date.now(),
      avatar: client.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      color: 'bg-indigo-500',
      projects: [],
    };
    setClients(prev => [...prev, newClient]);
    pushLog(`Client "${client.name}" added`, 'success');
  }, [pushLog]);

  const updateClient = useCallback((id, data, currentClients, currentProjects, currentPayments) => {
    const old = currentClients.find(c => c.id === id);
    if (!old) return;
    const nameChanged = data.name && old.name !== data.name;

    if (nameChanged) {
      setProjects(prev => prev.map(p => p.clientId === id ? { ...p, client: data.name } : p));
      setPayments(prev => prev.map(p => p.client === old.name ? { ...p, client: data.name } : p));
      pushLog(`Client renamed "${old.name}" → "${data.name}" · Projects & Invoices updated`, 'sync');
    } else {
      pushLog(`Client "${old.name}" updated`, 'info');
    }

    setClients(prev => prev.map(c => c.id === id ? {
      ...c, ...data,
      avatar: (data.name || c.name).split(' ').map(n => n[0]).join('').toUpperCase(),
    } : c));
  }, [pushLog]);

  const deleteClient = useCallback((id, currentClients, currentProjects, currentPayments) => {
    const client = currentClients.find(c => c.id === id);
    if (!client) return;

    const orphanProjects = currentProjects.filter(p => p.clientId === id);
    const orphanPayments = currentPayments.filter(p => p.client === client.name);

    if (orphanProjects.length > 0 || orphanPayments.length > 0) {
      pushLog(
        `⚠ Deleted "${client.name}" · ${orphanProjects.length} project(s) & ${orphanPayments.length} invoice(s) are now unlinked`,
        'warning'
      );
    } else {
      pushLog(`Client "${client.name}" deleted`, 'info');
    }
    setClients(prev => prev.filter(c => c.id !== id));
  }, [pushLog]);

  // ── PROJECTS ─────────────────────────────────────────────────────────────────
  const moveProject = useCallback((projectId, toColumn, currentProjects) => {
    const project = currentProjects.find(p => p.id === projectId);
    if (!project || project.column === toColumn) return;

    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, column: toColumn } : p));
    setClients(prev => prev.map(c => c.id === project.clientId ? { ...c, projectStatus: toColumn } : c));
    pushLog(`"${project.name}" moved to ${toColumn} · ${project.client}'s status synced`, 'sync');
  }, [pushLog]);

  const addProject = useCallback((project) => {
    const np = { ...project, id: Date.now() };
    setProjects(prev => [...prev, np]);
    if (project.clientId) {
      setClients(prev => prev.map(c => c.id === project.clientId ? { ...c, projects: [...(c.projects || []), np.id] } : c));
    }
    pushLog(`Project "${project.name}" created`, 'success');
  }, [pushLog]);

  const updateProject = useCallback((id, data, currentProjects) => {
    const old = currentProjects.find(p => p.id === id);
    if (!old) return;

    if (data.column && data.column !== old.column) {
      setClients(prev => prev.map(c => c.id === old.clientId ? { ...c, projectStatus: data.column } : c));
      pushLog(`"${old.name}" status → ${data.column} · ${old.client}'s profile updated`, 'sync');
    } else {
      pushLog(`Project "${old.name}" updated`, 'info');
    }
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, [pushLog]);

  const deleteProject = useCallback((id, currentProjects) => {
    const project = currentProjects.find(p => p.id === id);
    if (!project) return;
    setClients(prev => prev.map(c => c.id === project.clientId ? { ...c, projects: (c.projects || []).filter(pid => pid !== id) } : c));
    setProjects(prev => prev.filter(p => p.id !== id));
    pushLog(`⚠ Project "${project.name}" deleted · Removed from ${project.client}'s record`, 'warning');
  }, [pushLog]);

  // ── PAYMENTS ─────────────────────────────────────────────────────────────────
  const addPayment = useCallback((payment) => {
    setPayments(prev => [...prev, payment]);
    pushLog(`Invoice ${payment.id} added for ${payment.client}`, 'success');
  }, [pushLog]);

  const updatePayment = useCallback((id, data, currentPayments) => {
    const old = currentPayments.find(p => p.id === id);
    if (!old) return;

    if (data.status && data.status !== old.status) {
      setClients(prev => prev.map(c => c.name === old.client ? { ...c, paymentStatus: data.status } : c));
      pushLog(`Invoice ${id} → "${data.status}" · ${old.client}'s payment status synced`, 'sync');
    }
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, [pushLog]);

  const deletePayment = useCallback((id, currentPayments) => {
    const payment = currentPayments.find(p => p.id === id);
    if (payment) pushLog(`⚠ Invoice ${id} for "${payment.client}" deleted`, 'warning');
    setPayments(prev => prev.filter(p => p.id !== id));
  }, [pushLog]);

  // ── STATS ─────────────────────────────────────────────────────────────────────
  const stats = {
    totalClients: clients.length,
    activeProjects: projects.filter(p => p.column !== 'Delivered').length,
    pendingTasks: projects.filter(p => ['Lead', 'Planning'].includes(p.column)).length,
    monthlyRevenue: payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0),
    activeAutomations: workflows.filter(w => w.status === 'Active').length,
  };

  return (
    <AppContext.Provider value={{
      clients,
      addClient,
      updateClient: (id, data) => updateClient(id, data, clients, projects, payments),
      deleteClient: (id) => deleteClient(id, clients, projects, payments),

      projects,
      moveProject: (projectId, toColumn) => moveProject(projectId, toColumn, projects),
      addProject,
      updateProject: (id, data) => updateProject(id, data, projects),
      deleteProject: (id) => deleteProject(id, projects),

      workflows, setWorkflows,
      payments,
      addPayment,
      updatePayment: (id, data) => updatePayment(id, data, payments),
      deletePayment: (id) => deletePayment(id, payments),

      files, setFiles,
      darkMode, toggleDark,
      sidebarOpen, setSidebarOpen,
      notifications, addNotification,
      syncLog, dismissLog, clearLog,
      stats,
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
