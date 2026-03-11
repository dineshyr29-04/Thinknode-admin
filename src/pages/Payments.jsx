import { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Clock, CheckCircle, Plus, X, ChevronDown, Trash2, CreditCard, Banknote, Wifi, HelpCircle } from 'lucide-react';

import clsx from 'clsx';

const STATUSES = ['Paid', 'Delayed', 'Yet to Pay'];
const SERVICE_OPTIONS = ['Web Development', 'Frontend Development', 'E-Poster Design', 'n8n Automation', 'Video Editing'];

const statusItemStyles = {
  'Paid':       { dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20', active: 'bg-emerald-50 dark:bg-emerald-900/20' },
  'Delayed':    { dot: 'bg-red-500',     text: 'text-red-600 dark:text-red-400',         hover: 'hover:bg-red-50 dark:hover:bg-red-900/20',         active: 'bg-red-50 dark:bg-red-900/20' },
  'Yet to Pay': { dot: 'bg-yellow-400',  text: 'text-yellow-700 dark:text-yellow-400',   hover: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20',   active: 'bg-yellow-50 dark:bg-yellow-900/20' },
};

const statusBadge = {
  'Paid': 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50',
  'Delayed': 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-700/50',
  'Yet to Pay': 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700/50',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-xl border border-slate-100 dark:border-slate-700">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-semibold text-blue-600">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

function StatusDropdown({ paymentId, current, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        panelRef.current && !panelRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
    }
    setOpen(o => !o);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className={clsx('flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-all hover:opacity-80', statusBadge[current])}
      >
        {current}
        <ChevronDown size={10} className={clsx('transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: `${pos.top}px`, right: `${pos.right}px`, zIndex: 9999 }}
          className="w-36 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1 overflow-hidden"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 px-3 pt-2 pb-1">Select status</p>
          {STATUSES.map(s => {
            const st = statusItemStyles[s];
            return (
              <button
                key={s}
                onClick={() => { onUpdate(paymentId, { status: s }); setOpen(false); }}
                className={clsx(
                  'w-full text-left text-xs px-3 py-2 flex items-center gap-2 transition-colors',
                  s === current
                    ? clsx('font-semibold', st.active, st.text)
                    : clsx('text-slate-500 dark:text-slate-400', st.hover)
                )}
              >
                <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', st.dot)} />
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ClientStatusDropdown({ clientId, current, onUpdate, onSelectPaid }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        panelRef.current && !panelRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
    }
    setOpen(o => !o);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        onClick={handleToggle}
        className={clsx('flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-all hover:opacity-80', statusBadge[current])}
      >
        {current}
        <ChevronDown size={10} className={clsx('transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: `${pos.top}px`, right: `${pos.right}px`, zIndex: 9999 }}
          className="w-36 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1 overflow-hidden"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 px-3 pt-2 pb-1">Client status</p>
          {STATUSES.map(s => {
            const st = statusItemStyles[s];
            return (
              <button
                key={s}
                onClick={() => {
                  if (s === 'Paid') { onSelectPaid?.(clientId); }
                  else { onUpdate(clientId, s); }
                  setOpen(false);
                }}
                className={clsx(
                  'w-full text-left text-xs px-3 py-2 flex items-center gap-2 transition-colors',
                  s === current
                    ? clsx('font-semibold', st.active, st.text)
                    : clsx('text-slate-500 dark:text-slate-400', st.hover)
                )}
              >
                <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', st.dot)} />
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const PAYMENT_METHODS = [
  { label: 'Cash',   icon: Banknote,  color: 'emerald' },
  { label: 'Online', icon: Wifi,      color: 'blue' },
  { label: 'Card',   icon: CreditCard, color: 'violet' },
  { label: 'Others', icon: HelpCircle, color: 'slate' },
];

function MarkClientPaidModal({ clientName, onClose, onConfirm }) {
  const [form, setForm] = useState({ amount: '', method: 'Cash', cardName: '', bankName: '', othersText: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleConfirm = () => {
    if (!form.amount) return;
    let detail = '';
    if (form.method === 'Card')   detail = [form.cardName, form.bankName].filter(Boolean).join(' · ');
    if (form.method === 'Others') detail = form.othersText;
    onConfirm({ amount: Number(form.amount), method: form.method, detail });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Mark as Paid</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{clientName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Amount */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 block mb-1.5">Amount Received (₹)</label>
            <input
              type="number" min="0"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="e.g. 25000"
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Payment method */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 block mb-2">Payment Method</label>
            <div className="grid grid-cols-4 gap-2">
              {PAYMENT_METHODS.map(({ label, icon: Icon, color }) => (
                <button
                  key={label}
                  onClick={() => set('method', label)}
                  className={clsx(
                    'flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-semibold transition-all',
                    form.method === label
                      ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20 text-${color}-700 dark:text-${color}-400`
                      : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                  )}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Card fields */}
          {form.method === 'Card' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 block mb-1.5">Card Name</label>
                <input
                  value={form.cardName}
                  onChange={e => set('cardName', e.target.value)}
                  placeholder="VISA / Mastercard"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 block mb-1.5">Bank Name</label>
                <input
                  value={form.bankName}
                  onChange={e => set('bankName', e.target.value)}
                  placeholder="HDFC / SBI"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          )}

          {/* Others field */}
          {form.method === 'Others' && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 block mb-1.5">Specify Payment Method</label>
              <input
                value={form.othersText}
                onChange={e => set('othersText', e.target.value)}
                placeholder="e.g. Cheque, Crypto, Bank Transfer…"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={!form.amount}
            className="flex-1 px-4 py-2 text-sm rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}

function AddPaymentModal({ clients, onClose, onSave }) {
  const [form, setForm] = useState({ id: '', client: '', service: 'Web Development', amount: '', status: 'Yet to Pay', date: new Date().toISOString().split('T')[0], due: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Add Invoice</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Invoice #</label>
              <input value={form.id} onChange={e => set('id', e.target.value)} placeholder="INV-007"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Client</label>
              <select value={form.client} onChange={e => set('client', e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">— Select —</option>
                {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Amount (₹)</label>
              <input type="number" value={form.amount} onChange={e => set('amount', Number(e.target.value))} placeholder="25000"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Service Type</label>
            <select value={form.service} onChange={e => set('service', e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
              {SERVICE_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Invoice Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">Due Date</label>
              <input type="date" value={form.due} onChange={e => set('due', e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={() => { if (form.id && form.client) { onSave(form); onClose(); } }} className="flex-1 px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">Add Invoice</button>
        </div>
      </div>
    </div>
  );
}

export default function Payments() {
  const { payments, updatePayment, deletePayment, addPayment, clients, isAdmin, revenueData, updateClientPaymentStatus, updateClient } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [addModal, setAddModal] = useState(false);
  const [paidClientTarget, setPaidClientTarget] = useState(null); // clientId waiting for paid confirmation

  const handleClientPaidConfirm = ({ amount, method, detail }) => {
    updateClientPaymentStatus(paidClientTarget, 'Paid');
    updateClient(paidClientTarget, { paymentMode: method, paymentDetail: detail, paidAmount: amount });
    setPaidClientTarget(null);
  };

  const clientMap = useMemo(() => {
    const map = new Map();
    clients.forEach(c => map.set(c.name, c));
    return map;
  }, [clients]);

  const filtered = payments.filter(p => {
    const matchSearch = p.client.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search);
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const totalInvoiced = payments.reduce((s, p) => s + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + p.amount, 0);
  const totalDelayed = payments.filter(p => p.status === 'Delayed').reduce((s, p) => s + p.amount, 0);
  const totalYetToPay = payments.filter(p => p.status === 'Yet to Pay').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Invoiced', value: totalInvoiced, icon: <DollarSign size={18} />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Total Paid', value: totalPaid, icon: <CheckCircle size={18} />, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Delayed', value: totalDelayed, icon: <Clock size={18} />, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
          { label: 'Yet to Pay', value: totalYetToPay, icon: <TrendingUp size={18} />, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center mb-3', s.bg)}>
              <span className={s.color}>{s.icon}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">₹{(s.value / 1000).toFixed(0)}K</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Client Payment Controls */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Client Payment Status</h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage paid / unpaid status directly from client details</p>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
          {clients.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">No clients added yet.</div>
          )}
          {clients.map(c => (
            <div key={c.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{c.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.company || 'No company'} · {c.email || 'No email'}</p>
              </div>
              <div className="text-right">
                {isAdmin
                  ? <ClientStatusDropdown clientId={c.id} current={c.paymentStatus || 'Yet to Pay'} onUpdate={updateClientPaymentStatus} onSelectPaid={id => setPaidClientTarget(id)} />
                  : <span className={clsx('text-xs px-2.5 py-1 rounded-full font-medium', statusBadge[c.paymentStatus] ?? statusBadge['Yet to Pay'])}>{c.paymentStatus || 'Yet to Pay'}</span>
                }
                {c.paymentStatus === 'Paid' && c.paymentMode && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                    via {c.paymentMode}{c.paymentDetail ? ` · ${c.paymentDetail}` : ''}
                    {c.paidAmount ? ` · ₹${Number(c.paidAmount).toLocaleString()}` : ''}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Invoices</h3>
          <div className="flex gap-2 flex-wrap items-center">
            {['All', 'Paid', 'Delayed', 'Yet to Pay'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={clsx('text-xs px-3 py-1.5 rounded-lg font-medium transition-colors', filter === s ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600')}
              >
                {s}
              </button>
            ))}
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 outline-none placeholder-slate-400 border border-transparent focus:border-blue-500"
            />
            {isAdmin && (
              <button
                onClick={() => setAddModal(true)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                <Plus size={12} /> Add
              </button>
            )}
          </div>
        </div>
        {/* ── Mobile card view (xs → sm) ── */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700/50">
          {filtered.map(p => {
            const linked = clientMap.get(p.client);
            return (
            <div key={p.id} className="px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">{p.id}</span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5 truncate">{p.client}</p>
                  {linked?.email && <p className="text-[11px] text-slate-400 truncate">{linked.email}</p>}
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{p.service}</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => deletePayment(p.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-bold text-slate-800 dark:text-white">₹{p.amount.toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  {p.due && <span className="text-[11px] text-slate-400">Due {p.due}</span>}
                  {isAdmin
                    ? <StatusDropdown paymentId={p.id} current={p.status} onUpdate={updatePayment} />
                    : <span className={clsx('text-xs px-2.5 py-1 rounded-full font-medium', statusBadge[p.status])}>{p.status}</span>
                  }
                </div>
              </div>
            </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">No invoices found.</div>
          )}
        </div>

        {/* ── Desktop table (md+) ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase border-b border-slate-100 dark:border-slate-700">
                <th className="text-left px-5 py-3 font-medium">Invoice</th>
                <th className="text-left px-5 py-3 font-medium">Client</th>
                <th className="text-left px-5 py-3 font-medium">Service</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Due Date</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {filtered.map(p => {
                const linked = clientMap.get(p.client);
                return (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">{p.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-slate-700 dark:text-slate-200 font-medium">{p.client}</p>
                    <p className="text-[11px] text-slate-400">{linked?.company || 'No company'}{linked?.email ? ` · ${linked.email}` : ''}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">{p.service}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-white">₹{p.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">{p.due}</td>
                  <td className="px-5 py-3.5">
                    {isAdmin
                      ? <StatusDropdown paymentId={p.id} current={p.status} onUpdate={updatePayment} />
                      : <span className={clsx('text-xs px-2.5 py-1 rounded-full font-medium', statusBadge[p.status])}>{p.status}</span>
                    }
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {isAdmin && (
                      <button
                        onClick={() => deletePayment(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">No invoices found.</div>
          )}
        </div>
      </div>

      {addModal && (
        <AddPaymentModal clients={clients} onClose={() => setAddModal(false)} onSave={addPayment} />
      )}
      {paidClientTarget && (
        <MarkClientPaidModal
          clientName={clients.find(c => c.id === paidClientTarget)?.name ?? ''}
          onClose={() => setPaidClientTarget(null)}
          onConfirm={handleClientPaidConfirm}
        />
      )}
    </div>
  );
}
