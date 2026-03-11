import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Automations from './pages/Automations';
import Files from './pages/Files';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import InvoiceGenerator from './pages/InvoiceGenerator';
import { useApp } from './context/AppContext';
import clsx from 'clsx';

function Layout() {
  useApp();
  return (
    <div className="flex h-dvh w-full bg-violet-50 dark:bg-[#0f1117] overflow-x-hidden">
      <Sidebar />
      <div className={clsx('flex flex-col flex-1 min-w-0 transition-all duration-300')}>
        <Navbar />
        <main className="scrollbar-modern flex-1 overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/services" element={<Services />} />
            <Route path="/automations" element={<Automations />} />
            <Route path="/files" element={<Files />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/invoice" element={<InvoiceGenerator />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
