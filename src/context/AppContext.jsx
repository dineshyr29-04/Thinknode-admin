import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { on as socketOn, off as socketOff, emit as socketEmit } from '../socket';
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
const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { } };

const loadUserData = (userId, key, fallback) => {
  const userKey = `tn_user_${userId}_${key}`;
  return load(userKey, fallback);
};

const saveUserData = (userId, key, value) => {
  const userKey = `tn_user_${userId}_${key}`;
  save(userKey, value);
};

export function AppProvider({ children }) {
  // ── AUTHENTICATION ─────────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!load('tn_activeSession', null));
  const [currentUser, setCurrentUser] = useState(() => load('tn_activeSession', null));
  
  // Initialize demo user on first load
  useEffect(() => {
    const users = load('tn_users', {});
    if (Object.keys(users).length === 0) {
      const demoUser = {
        id: Date.now(),
        email: 'vicky@example.com',
        password: 'password123',
        name: 'Vicky',
        company: 'ThinkNode',
        role: 'admin',
        createdAt: new Date().toISOString(),
        avatar: 'https://ui-avatars.com/api/?name=Vicky&background=8b5cf6',
      };
      users['vicky@example.com'] = demoUser;
      save('tn_users', users);
    }
  }, []);

  const login = useCallback((user) => {
    const userWithDefaults = {
      ...user,
      name: user.name || user.email.split('@')[0],
      role: user.role || 'user',
    };
    setCurrentUser(userWithDefaults);
    setIsAuthenticated(true);
    save('tn_activeSession', userWithDefaults);
    
    // Initialize user-specific data if not exists
    if (!loadUserData(user.id, 'initialized', null)) {
      saveUserData(user.id, 'clients', initialClients);
      saveUserData(user.id, 'projects', initialProjects);
      saveUserData(user.id, 'workflows', initialWorkflows);
      saveUserData(user.id, 'webProjects', initialWebProjects);
      saveUserData(user.id, 'frontendApps', initialFrontendApps);
      saveUserData(user.id, 'posterProjects', initialPosterProjects);
      saveUserData(user.id, 'videoProjects', initialVideoProjects);
      saveUserData(user.id, 'payments', initialPayments);
      saveUserData(user.id, 'files', initialFiles);
      saveUserData(user.id, 'darkMode', true);
      saveUserData(user.id, 'initialized', true);
    }
  }, []);

  const signup = useCallback((user) => {
    login(user);
  }, [login]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('tn_activeSession');
  }, []);

  const isAdmin = currentUser?.role === 'admin';

  // Load user-specific data
  const userId = currentUser?.id;
  const [clients, setClients] = useState(() => loadUserData(userId, 'clients', initialClients));
  const [projects, setProjects] = useState(() => loadUserData(userId, 'projects', initialProjects));
  const [workflows, setWorkflows] = useState(() => loadUserData(userId, 'workflows', initialWorkflows));
  const [webProjects, setWebProjects] = useState(() => loadUserData(userId, 'webProjects', initialWebProjects));
  const [frontendApps, setFrontendApps] = useState(() => loadUserData(userId, 'frontendApps', initialFrontendApps));
  const [posterProjects, setPosterProjects] = useState(() => loadUserData(userId, 'posterProjects', initialPosterProjects));
  const [videoProjects, setVideoProjects] = useState(() => loadUserData(userId, 'videoProjects', initialVideoProjects));
  const [payments, setPayments] = useState(() => loadUserData(userId, 'payments', initialPayments));
  const [files, setFiles] = useState(() => loadUserData(userId, 'files', initialFiles));
  const [darkMode, setDarkMode] = useState(() => loadUserData(userId, 'darkMode', true));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [syncLog, setSyncLog] = useState([]);

  const toggleDark = () => {
    setDarkMode(d => !d);
    document.documentElement.classList.toggle('dark');
  };

  if (darkMode) document.documentElement.classList.add('dark');

  // ── PERSISTENCE ────────────────────────────────────────────────────────────────
  useEffect(() => { if (userId) saveUserData(userId, 'clients', clients); }, [clients, userId]);
  useEffect(() => { if (userId) saveUserData(userId, 'projects', projects); }, [projects, userId]);
  useEffect(() => { if (userId) saveUserData(userId, 'workflows', workflows); }, [workflows, userId]);
  useEffect(() => { if (userId) saveUserData(userId, 'webProjects', webProjects); }, [webProjects, userId]);
  useEffect(() => { if (userId) saveUserData(userId, 'frontendApps', frontendApps); }, [frontendApps, userId]);
  useEffect(() => { if (userId) saveUserData(userId, 'posterProjects', posterProjects); }, [posterProjects, userId]);
  useEffect(() => { if (userId) saveUserData(userId, 'videoProjects', videoProjects); }, [videoProjects, userId]);
  useEffect(() => { if (userId) saveUserData(userId, 'payments', payments); }, [payments, userId]);
  useEffect(() => { if (userId) saveUserData(userId, 'files', files); }, [files, userId]);
  useEffect(() => { if (userId) saveUserData(userId, 'darkMode', darkMode); }, [darkMode, userId]);

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

  useEffect(() => {
    const handleSync = (payload) => {
      pushLog(payload?.message || `sync:${JSON.stringify(payload)}`, 'sync');
    };
    const handleNotification = (payload) => {
      addNotification(payload?.text || JSON.stringify(payload), payload?.type || 'info');
    };

    socketOn('sync', handleSync);
    socketOn('notification', handleNotification);
    socketOn('connect', () => pushLog('Connected to sync server', 'success'));
    socketOn('disconnect', () => pushLog('Disconnected from sync server', 'warning'));

    return () => {
      socketOff('sync', handleSync);
      socketOff('notification', handleNotification);
      socketOff('connect');
      socketOff('disconnect');
    };
  }, [pushLog, addNotification]);

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
    const serviceChanged = data.service && old.service !== data.service;

    if (nameChanged) {
      setProjects(prev => prev.map(p => p.clientId === id ? { ...p, client: data.name } : p));
      setPayments(prev => prev.map(p => p.client === old.name ? { ...p, client: data.name } : p));
      setWebProjects(prev => prev.map(p => p.client === old.name ? { ...p, client: data.name } : p));
      setFrontendApps(prev => prev.map(p => p.client === old.name ? { ...p, client: data.name } : p));
      setPosterProjects(prev => prev.map(p => p.client === old.name ? { ...p, client: data.name } : p));
      setVideoProjects(prev => prev.map(p => p.client === old.name ? { ...p, client: data.name } : p));
      setWorkflows(prev => prev.map(p => p.client === old.name ? { ...p, client: data.name } : p));
      pushLog(`Client renamed "${old.name}" → "${data.name}" · All records updated`, 'sync');
    }

    if (serviceChanged) {
      const oldSvc = old.service;
      const newSvc = data.service;
      const clientName = data.name || old.name; // Use new name if provided, otherwise old
      
      // Remove from old service category
      if (oldSvc === 'Web Development') {
        setWebProjects(prev => prev.filter(p => p.client !== clientName));
      } else if (oldSvc === 'Frontend Development') {
        setFrontendApps(prev => prev.filter(p => p.client !== clientName));
      } else if (oldSvc === 'E-Poster Design') {
        setPosterProjects(prev => prev.filter(p => p.client !== clientName));
      } else if (oldSvc === 'Video Editing') {
        setVideoProjects(prev => prev.filter(p => p.client !== clientName));
      } else if (oldSvc === 'n8n Automation') {
        setWorkflows(prev => prev.filter(p => p.client !== clientName));
      }

      // Add to new service category
      const clientProjects = currentProjects.filter(p => p.clientId === id);
      clientProjects.forEach(proj => {
        if (newSvc === 'Web Development') {
          setWebProjects(prev => [...prev, { id: proj.id, name: proj.name, client: clientName, status: 'In Progress', domain: '', hosting: '' }]);
        } else if (newSvc === 'Frontend Development') {
          setFrontendApps(prev => [...prev, { id: proj.id, name: proj.name, client: clientName, uiStatus: 'In Progress', framework: 'React', deployLink: '' }]);
        } else if (newSvc === 'E-Poster Design') {
          setPosterProjects(prev => [...prev, { id: proj.id, name: proj.name, client: clientName, preview: '', versions: 1, files: [], approvalStatus: 'Pending' }]);
        } else if (newSvc === 'Video Editing') {
          setVideoProjects(prev => [...prev, { id: proj.id, name: proj.name, client: clientName, status: 'In Progress', format: 'MP4', duration: '' }]);
        } else if (newSvc === 'n8n Automation') {
          setWorkflows(prev => [...prev, { id: proj.id, name: `${clientName} · Automation`, trigger: 'Webhook', client: clientName, status: 'Active', successRate: 100, logs: [] }]);
        }
      });

      pushLog(`Client "${old.name}"'s service updated to "${newSvc}" · Services page synced`, 'sync');
    }

    if (!nameChanged && !serviceChanged) {
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
    pushLog(`Invoice ${payment.id} added for ${payment.client} (${payment.service})`, 'success');
  }, [pushLog]);

  const updatePayment = useCallback((id, data, currentPayments) => {
    const old = currentPayments.find(p => p.id === id);
    if (!old) return;

    if (data.status && data.status !== old.status) {
      setClients(prev => prev.map(c => c.name === old.client ? { ...c, paymentStatus: data.status } : c));
      pushLog(`Invoice ${id} → "${data.status}" · ${old.client}'s payment synced · Charts updating`, 'sync');
    } else {
      pushLog(`Invoice ${id} updated`, 'info');
    }
    
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, [pushLog]);

  const deletePayment = useCallback((id, currentPayments) => {
    const payment = currentPayments.find(p => p.id === id);
    if (payment) pushLog(`⚠ Invoice ${id} for "${payment.client}" deleted · Charts recalculated`, 'warning');
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
      pushLog(`✅ Payment marked as "${newStatus}" for ${client.name} · Revenue graph updating instantly!`, 'success');
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
      pushLog(`✅ Payment ₹${paymentDetails.paidAmount.toLocaleString()} recorded for ${client.name} · Charts updating live!`, 'success');
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
      // Authentication
      isAuthenticated,
      currentUser,
      login,
      signup,
      logout,

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
      socketEmit,
      stats,
      serviceBreakdown,
      revenueData,
      isAdmin,
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
