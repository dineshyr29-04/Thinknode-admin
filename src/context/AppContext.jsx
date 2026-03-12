import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import {
  clients as initialClients,
  projects as initialProjects,
  workflows as initialWorkflows,
  webProjects as initialWebProjects,
  frontendApps as initialFrontendApps,
  posterProjects as initialPosterProjects,
  videoProjects as initialVideoProjects,
  payments as initialPayments,
  files as initialFiles,
} from '../data/dummyData';

const AppContext = createContext(null);

const load = (key, fallback) => { try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; } };

export function AppProvider({ children }) {
  const [clients, setClients] = useState(() => load('tn_clients', initialClients));
  const [projects, setProjects] = useState(() => load('tn_projects', initialProjects));
  const [workflows, setWorkflows] = useState(() => load('tn_workflows', initialWorkflows));
  const [webProjects, setWebProjects] = useState(() => load('tn_webProjects', initialWebProjects));
  const [frontendApps, setFrontendApps] = useState(() => load('tn_frontendApps', initialFrontendApps));
  const [posterProjects, setPosterProjects] = useState(() => load('tn_posterProjects', initialPosterProjects));
  const [videoProjects, setVideoProjects] = useState(() => load('tn_videoProjects', initialVideoProjects));
  const [payments, setPayments] = useState(() => load('tn_payments', initialPayments));
  const [files, setFiles] = useState(() => load('tn_files', initialFiles));
  const [darkMode, setDarkMode] = useState(() => load('tn_darkMode', true));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => load('tn_currentUser', { name: 'Vicky', role: 'admin' }));
  const isAdmin = currentUser.role === 'admin';
  const [notifications, setNotifications] = useState([]);
  const [syncLog, setSyncLog] = useState([]);

  const toggleDark = () => {
    setDarkMode(d => !d);
    document.documentElement.classList.toggle('dark');
  };

  if (darkMode) document.documentElement.classList.add('dark');

  // ── PERSISTENCE ────────────────────────────────────────────────────────────────
  useEffect(() => { localStorage.setItem('tn_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('tn_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('tn_workflows', JSON.stringify(workflows)); }, [workflows]);
  useEffect(() => { localStorage.setItem('tn_webProjects', JSON.stringify(webProjects)); }, [webProjects]);
  useEffect(() => { localStorage.setItem('tn_frontendApps', JSON.stringify(frontendApps)); }, [frontendApps]);
  useEffect(() => { localStorage.setItem('tn_posterProjects', JSON.stringify(posterProjects)); }, [posterProjects]);
  useEffect(() => { localStorage.setItem('tn_videoProjects', JSON.stringify(videoProjects)); }, [videoProjects]);
  useEffect(() => { localStorage.setItem('tn_payments', JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem('tn_files', JSON.stringify(files)); }, [files]);
  useEffect(() => { localStorage.setItem('tn_darkMode', JSON.stringify(darkMode)); }, [darkMode]);
  useEffect(() => { localStorage.setItem('tn_currentUser', JSON.stringify(currentUser)); }, [currentUser]);

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

    // Create a starter project for this client and add it to projects
    const projectId = Date.now() + 1;
    const projectName = `${client.name} · ${client.service || 'Project'}`;
    const newProject = {
      id: projectId,
      name: projectName,
      client: client.name,
      clientId: newClient.id,
      service: client.service || 'Web Development',
      column: 'Lead',
      progress: 0,
      deadline: '',
      priority: 'Medium',
      notes: '',
      color: 'bg-blue-500',
    };
    setProjects(prev => [...prev, newProject]);
    // Attach project id to client record
    setClients(prev => prev.map(c => c.id === newClient.id ? { ...c, projects: [...(c.projects || []), projectId] } : c));

    // Also add a small entry to the appropriate services list so Services page shows it
    const svc = client.service;
    if (svc === 'Web Development') {
      setWebProjects(prev => [...prev, { id: projectId, name: projectName, client: client.name, status: 'In Progress', domain: '', hosting: '' }]);
    } else if (svc === 'Frontend Development') {
      setFrontendApps(prev => [...prev, { id: projectId, name: projectName, client: client.name, uiStatus: 'In Progress', framework: 'React', deployLink: '' }]);
    } else if (svc === 'E-Poster Design') {
      setPosterProjects(prev => [...prev, { id: projectId, name: projectName, client: client.name, preview: '', versions: 1, files: [], approvalStatus: 'Pending' }]);
    } else if (svc === 'Video Editing') {
      setVideoProjects(prev => [...prev, { id: projectId, name: projectName, client: client.name, status: 'In Progress', format: 'MP4', duration: '' }]);
    } else if (svc === 'n8n Automation') {
      setWorkflows(prev => [...prev, { id: projectId, name: `${client.name} · Automation`, trigger: 'Webhook', client: client.name, status: 'Active', successRate: 100, logs: [] }]);
    }

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
    if (payment.client) {
      setClients(prev => prev.map(c => c.name === payment.client ? { ...c, paymentStatus: payment.status } : c));
    }
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

  const updateClientPaymentStatus = useCallback((clientId, newStatus, paymentDetails, currentClients, currentPayments) => {
    const client = currentClients.find(c => c.id === clientId);
    if (!client) return;
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, paymentStatus: newStatus } : c));
    const today = new Date().toISOString().split('T')[0];
    const sorted = [...currentPayments.filter(p => p.client === client.name)]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sorted.length > 0) {
      // Update the most recent invoice for this client
      setPayments(prev => prev.map(p => p.id === sorted[0].id ? {
        ...p,
        status: newStatus,
        // Only store paidDate / paidAmount when actually marking as Paid
        ...(newStatus === 'Paid' && { paidDate: today }),
        ...(paymentDetails?.paidAmount != null && { paidAmount: paymentDetails.paidAmount }),
        ...(paymentDetails?.paymentMode && { paymentMode: paymentDetails.paymentMode }),
        ...(paymentDetails?.paymentDetail !== undefined && { paymentDetail: paymentDetails.paymentDetail }),
      } : p));
      pushLog(`${client.name}'s payment → "${newStatus}" · Invoice ${sorted[0].id} synced`, 'sync');
    } else if (newStatus === 'Paid' && paymentDetails?.paidAmount) {
      // No invoice exists – create one so the money shows up in every graph
      const autoId = `INV-${Date.now()}`;
      const newPayment = {
        id: autoId,
        client: client.name,
        service: client.service || 'General',
        amount: paymentDetails.paidAmount,
        paidAmount: paymentDetails.paidAmount,
        status: 'Paid',
        date: today,
        paidDate: today,
        due: today,
        paymentMode: paymentDetails.paymentMode || '',
        paymentDetail: paymentDetails.paymentDetail || '',
      };
      setPayments(prev => [...prev, newPayment]);
      pushLog(`Payment ₹${paymentDetails.paidAmount.toLocaleString()} recorded for ${client.name} (auto-invoice ${autoId})`, 'success');
    } else {
      pushLog(`${client.name}'s payment → "${newStatus}"`, 'info');
    }
  }, [pushLog]);

  // ── SERVICE BREAKDOWN (live from payments) ────────────────────────────────────
  const serviceBreakdown = useMemo(() => {
    const colors = {
      'Web Development': '#3b82f6',
      'Frontend Development': '#8b5cf6',
      'E-Poster Design': '#ec4899',
      'n8n Automation': '#10b981',
      'Video Editing': '#f97316',
    };
    const map = {};
    payments.filter(p => p.status === 'Paid').forEach(p => {
      if (!map[p.service]) map[p.service] = 0;
      map[p.service] += (p.paidAmount || p.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value, color: colors[name] ?? '#64748b' }));
  }, [payments]);

  // ── REVENUE TREND (live from payments) ───────────────────────────────────────
  const revenueData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const map = {};
    payments.filter(p => p.status === 'Paid').forEach(p => {
      // Use paidDate (actual payment date) when available, else fall back to invoice date
      const refDate = p.paidDate || p.date;
      if (!refDate) return;
      const key = monthNames[parseInt(refDate.split('-')[1], 10) - 1];
      map[key] = (map[key] ?? 0) + (p.paidAmount || p.amount);
    });
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const key = monthNames[d.getMonth()];
      return { month: key, revenue: map[key] ?? 0 };
    });
  }, [payments]);

  // ── STATS ─────────────────────────────────────────────────────────────────────
  const _now = new Date();
  const stats = {
    totalClients: clients.length,
    activeProjects: projects.filter(p => p.column !== 'Delivered').length,
    pendingTasks: projects.filter(p => ['Lead', 'Planning'].includes(p.column)).length,
    // monthlyRevenue: money actually received THIS calendar month (uses paidDate, not invoice date)
    monthlyRevenue: payments
      .filter(p => p.status === 'Paid' && (p.paidDate || p.date) &&
        (() => { const d = new Date(p.paidDate || p.date); return d.getMonth() === _now.getMonth() && d.getFullYear() === _now.getFullYear(); })()
      )
      .reduce((s, p) => s + (p.paidAmount || p.amount), 0),
    // totalEarned: all-time money received across every paid invoice
    totalEarned: payments.filter(p => p.status === 'Paid').reduce((s, p) => s + (p.paidAmount || p.amount), 0),
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
      webProjects, setWebProjects,
      frontendApps, setFrontendApps,
      posterProjects, setPosterProjects,
      videoProjects, setVideoProjects,
      payments,
      addPayment,
      updatePayment: (id, data) => updatePayment(id, data, payments),
      deletePayment: (id) => deletePayment(id, payments),
      updateClientPaymentStatus: (clientId, status, paymentDetails) => updateClientPaymentStatus(clientId, status, paymentDetails, clients, payments),

      files, setFiles,
      darkMode, toggleDark,
      sidebarOpen, setSidebarOpen,
      notifications, addNotification,
      syncLog, dismissLog, clearLog,
      stats,
      serviceBreakdown,
      revenueData,
      currentUser, setCurrentUser, isAdmin,
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
