import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Printer, RotateCcw, Save, AlertTriangle, X } from 'lucide-react';

const SERVICE_PRESETS = [
  { label: 'Web Development',  rate: 20000 },
  { label: 'Frontend',         rate: 2000  },
  { label: 'Automation',       rate: 3000  },
  { label: 'Poster Design',    rate: 100   },
  { label: 'Custom / Other',   rate: 0     },
];

const CURRENCIES = [
  { symbol: '₹', label: 'INR — Indian Rupee' },
  { symbol: '$', label: 'USD — US Dollar' },
  { symbol: '€', label: 'EUR — Euro' },
  { symbol: '£', label: 'GBP — British Pound' },
  { symbol: '¥', label: 'JPY — Japanese Yen' },
  { symbol: 'AED ', label: 'AED — UAE Dirham' },
];

const ACCENTS = [
  '#0f172a', '#2563eb', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#7c3aed', '#db2777',
];

// ── Persistent invoice counter ─────────────────────────────────────────────
const COUNTER_KEY = 'thinknode_inv_counter';

const getNextNumber = () => {
  const n = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10) + 1;
  return n;
};

const saveCounter = (n) => localStorage.setItem(COUNTER_KEY, String(n));

const fmtNumber = (n) => `INV-${String(n).padStart(3, '0')}`;

const todayStr = () => new Date().toISOString().split('T')[0];
const addDays = (d, n) => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().split('T')[0];
};


const makeDefault = (counter) => ({
  _counter: counter,
  number: fmtNumber(counter),
  date: todayStr(),
  dueDate: addDays(todayStr(), 30),
  from: {
    name: 'ThinkNode Studio',
    email: 'hello@thinknode.in',
    phone: '+91 98765 43210',
    address: '123 Creator Lane, Koramangala\nBengaluru, Karnataka 560001',
    gstin: '',
  },
  to: { name: '', email: '', phone: '', address: '', gstin: '' },
  items: [{ id: 1, desc: 'Web Design & Development', qty: 1, rate: 15000 }],
  notes: 'Payment due within 30 days.\nBank: HDFC Bank  |  A/C: 1234567890  |  IFSC: HDFC0001234\n\nThank you for your business!',
  tax: 18,
  discount: 0,
  currency: '₹',
  accent: '#6366f1',
});

const iCls =
  'w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition';

const FormInput = ({ label, className = '', ...props }) => (
  <div className={className}>
    {label && (
      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </label>
    )}
    <input className={iCls} {...props} />
  </div>
);

const FormTextarea = ({ label, className = '', rows = 2, ...props }) => (
  <div className={className}>
    {label && (
      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </label>
    )}
    <textarea rows={rows} className={iCls + ' resize-none'} {...props} />
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm overflow-hidden">
    {title && (
      <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
);

export default function InvoiceGenerator() {
  // On first load, read the last saved counter and open at next number
  const initCounter = useRef(getNextNumber());
  const [inv, setInv] = useState(() => makeDefault(initCounter.current));
  const [saved, setSaved] = useState(false);
  const [warn, setWarn] = useState(false);
  const warnTimer = useRef(null);
  const [warnProgress, setWarnProgress] = useState(100);
  const warnInterval = useRef(null);

  /* ── inject print-only styles ── */
  useEffect(() => {
    const id = 'inv-print-css';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @media print {
        @page { size: A4 portrait; margin: 10mm; }
        body * { visibility: hidden !important; }
        #inv-preview { display: block !important; }
        #inv-preview, #inv-preview * { visibility: visible !important; }
        #inv-preview {
          position: fixed !important;
          top: 0 !important; left: 0 !important;
          width: 100vw !important;
          background: white !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); el?.remove(); };
  }, []);

  /* ── Save & advance counter ── */
  const handleSave = () => {
    saveCounter(inv._counter);
    const next = inv._counter + 1;
    initCounter.current = next;
    saveCounter(next - 1); // record this one as used
    setSaved(true);
    setWarn(false);
    clearTimeout(warnTimer.current);
    clearInterval(warnInterval.current);
    setTimeout(() => setSaved(false), 2000);
  };

  /* ── Actually create next invoice ── */
  const doNewInvoice = () => {
    const next = (parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10)) + 1;
    initCounter.current = next;
    setInv(makeDefault(next));
    setSaved(false);
    setWarn(false);
    clearTimeout(warnTimer.current);
    clearInterval(warnInterval.current);
  };

  /* ── New Invoice button — warn if unsaved ── */
  const handleReset = () => {
    if (!saved) {
      setWarn(true);
      setWarnProgress(100);
      clearTimeout(warnTimer.current);
      clearInterval(warnInterval.current);
      warnTimer.current = setTimeout(() => setWarn(false), 5000);
      const start = Date.now();
      warnInterval.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.max(0, 100 - (elapsed / 5000) * 100);
        setWarnProgress(pct);
        if (pct === 0) clearInterval(warnInterval.current);
      }, 50);
    } else {
      doNewInvoice();
    }
  };

  /* ── totals ── */
  const subtotal = inv.items.reduce(
    (s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0
  );
  const discAmt = subtotal * ((Number(inv.discount) || 0) / 100);
  const taxAmt  = (subtotal - discAmt) * ((Number(inv.tax) || 0) / 100);
  const total   = subtotal - discAmt + taxAmt;

  const fmt = n =>
    `${inv.currency}${Number(n).toLocaleString('en-IN', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    })}`;

  /* ── setters ── */
  const set = (path, val) =>
    setInv(p => {
      const [k, sub] = path.split('.');
      return sub ? { ...p, [k]: { ...p[k], [sub]: val } } : { ...p, [k]: val };
    });

  const addItem = () =>
    setInv(p => ({ ...p, items: [...p.items, { id: Date.now(), desc: '', qty: 1, rate: 0 }] }));
  const removeItem = id =>
    setInv(p => ({ ...p, items: p.items.filter(i => i.id !== id) }));
  const setItem = (id, field, val) =>
    setInv(p => ({ ...p, items: p.items.map(i => i.id === id ? { ...i, [field]: val } : i) }));

  return (
    <div className="p-4 sm:p-6 min-h-screen">

      {/* ── Unsaved-warning toast (drops from top) ── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{ paddingTop: '0' }}
      >
        <div
          className="pointer-events-auto w-full max-w-md mx-4 mt-4 rounded-2xl shadow-2xl overflow-hidden border border-amber-300 dark:border-amber-600/60 transition-all duration-500"
          style={{
            transform: warn ? 'translateY(0)' : 'translateY(-140%)',
            opacity: warn ? 1 : 0,
            background: 'rgba(255,251,235,0.97)',
          }}
        >
          <div className="flex items-start gap-3 px-4 pt-4 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={16} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-amber-900">Invoice not saved!</p>
              <p className="text-xs text-amber-700 mt-0.5">Save the current invoice number first, or discard and open a new one.</p>
            </div>
            <button onClick={() => { setWarn(false); clearTimeout(warnTimer.current); clearInterval(warnInterval.current); }} className="text-amber-400 hover:text-amber-700 transition-colors flex-shrink-0"><X size={15} /></button>
          </div>
          <div className="flex gap-2 px-4 pb-4">
            <button
              onClick={() => { handleSave(); setTimeout(doNewInvoice, 100); }}
              className="flex-1 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors"
            >
              Save &amp; New Invoice
            </button>
            <button
              onClick={doNewInvoice}
              className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 transition-colors"
            >
              Discard &amp; New
            </button>
          </div>
          {/* progress bar */}
          <div className="h-1 bg-amber-100">
            <div
              className="h-full bg-amber-400 transition-none"
              style={{ width: `${warnProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Invoice Generator</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Fill the form · preview live · print or export as PDF
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw size={13} /> New Invoice
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border transition-colors ${
              saved
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Save size={13} /> {saved ? 'Saved!' : 'Save #'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-lg transition-all hover:opacity-90 active:scale-95"
            style={{ background: inv.accent }}
          >
            <Printer size={15} /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

        {/* ═══════════════ FORM ═══════════════ */}
        <div className="space-y-4">

          {/* Invoice meta */}
          <Card title="Invoice Details">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                  Invoice #
                </label>
                <input
                  value={inv.number}
                  onChange={e => set('number', e.target.value)}
                  placeholder="INV-001"
                  className={iCls + ' font-mono font-semibold'}
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Auto: <span className="font-mono text-indigo-500">{fmtNumber(inv._counter)}</span> · editable
                </p>
              </div>
              <FormInput label="Issue Date"  type="date" value={inv.date}    onChange={e => set('date',    e.target.value)} />
              <FormInput label="Due Date"    type="date" value={inv.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </div>
          </Card>

          {/* From */}
          <Card title="From — Your Details">
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Business / Name" className="col-span-2"
                value={inv.from.name}    onChange={e => set('from.name',    e.target.value)} placeholder="ThinkNode Studio" />
              <FormInput label="Email" type="email"
                value={inv.from.email}   onChange={e => set('from.email',   e.target.value)} placeholder="you@domain.com" />
              <FormInput label="Phone"
                value={inv.from.phone}   onChange={e => set('from.phone',   e.target.value)} placeholder="+91 98765 43210" />
              <FormInput label="GSTIN / Tax ID"
                value={inv.from.gstin}   onChange={e => set('from.gstin',   e.target.value)} placeholder="GSTIN or VAT No." />
              <FormTextarea label="Address" className="col-span-2" rows={2}
                value={inv.from.address} onChange={e => set('from.address', e.target.value)} placeholder="Street, City, State, PIN" />
            </div>
          </Card>

          {/* To */}
          <Card title="Bill To — Client Details">
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Client / Company" className="col-span-2"
                value={inv.to.name}    onChange={e => set('to.name',    e.target.value)} placeholder="Client Name or Company" />
              <FormInput label="Email" type="email"
                value={inv.to.email}   onChange={e => set('to.email',   e.target.value)} placeholder="client@company.com" />
              <FormInput label="Phone"
                value={inv.to.phone}   onChange={e => set('to.phone',   e.target.value)} placeholder="+91 ..." />
              <FormInput label="GSTIN / Tax ID"
                value={inv.to.gstin}   onChange={e => set('to.gstin',   e.target.value)} placeholder="Client GSTIN / VAT No." />
              <FormTextarea label="Address" className="col-span-2" rows={2}
                value={inv.to.address} onChange={e => set('to.address', e.target.value)} placeholder="Client address" />
            </div>
          </Card>

          {/* Line items */}
          <Card title="Line Items">
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_60px_96px_32px] gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Description</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Qty</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right pr-2">Rate</span>
                <span />
              </div>

              {inv.items.map((item, idx) => (
                <div key={item.id} className="space-y-1.5">
                  {/* Service preset selector */}
                  <div className="grid grid-cols-[1fr_60px_96px_32px] gap-2 items-center">
                    <select
                      value={item.preset ?? ''}
                      onChange={e => {
                        const preset = SERVICE_PRESETS.find(s => s.label === e.target.value);
                        if (preset) {
                          setItem(item.id, 'preset', preset.label);
                          setItem(item.id, 'desc',   preset.label);
                          setItem(item.id, 'rate',   preset.rate);
                        } else {
                          setItem(item.id, 'preset', '');
                        }
                      }}
                      className={iCls + ' text-slate-500'}
                    >
                      <option value="">— Pick a service —</option>
                      {SERVICE_PRESETS.map(s => (
                        <option key={s.label} value={s.label}>
                          {s.label}{s.rate ? ` (starts ₹${s.rate.toLocaleString('en-IN')})` : ''}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number" min="0"
                      value={item.qty}
                      onChange={e => setItem(item.id, 'qty', e.target.value)}
                      className={iCls + ' text-center !px-1'}
                    />
                    <input
                      type="number" min="0"
                      value={item.rate}
                      onChange={e => setItem(item.id, 'rate', e.target.value)}
                      className={iCls + ' text-right'}
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={inv.items.length === 1}
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-25 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {/* Custom description editable below the dropdown */}
                  <input
                    value={item.desc}
                    onChange={e => setItem(item.id, 'desc', e.target.value)}
                    placeholder={`Custom description for item ${idx + 1}`}
                    className={iCls + ' text-xs'}
                  />
                </div>
              ))}

              <button
                onClick={addItem}
                className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors"
              >
                <Plus size={13} /> Add Line Item
              </button>
            </div>
          </Card>

          {/* Tax / Discount / Currency */}
          <Card title="Tax, Discount & Currency">
            <div className="grid grid-cols-3 gap-3">
              <FormInput label="Discount %" type="number" min="0" max="100"
                value={inv.discount} onChange={e => set('discount', e.target.value)} placeholder="0" />
              <FormInput label="Tax / GST %" type="number" min="0" max="100"
                value={inv.tax} onChange={e => set('tax', e.target.value)} placeholder="18" />
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">Currency</label>
                <select value={inv.currency} onChange={e => set('currency', e.target.value)} className={iCls}>
                  {CURRENCIES.map(c => (
                    <option key={c.symbol} value={c.symbol}>{c.symbol} {c.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card title="Notes & Payment Info">
            <FormTextarea
              rows={4}
              value={inv.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Payment terms, bank details, thank you note…"
            />
          </Card>

          {/* Accent colour */}
          <Card title="Invoice Accent Colour">
            <div className="flex items-center gap-3 flex-wrap">
              {ACCENTS.map(c => (
                <button
                  key={c}
                  onClick={() => set('accent', c)}
                  title={c}
                  className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    background: c,
                    borderColor: inv.accent === c ? '#fff' : 'transparent',
                    outline: inv.accent === c ? `2px solid ${c}` : 'none',
                    transform: inv.accent === c ? 'scale(1.25)' : undefined,
                  }}
                />
              ))}
              {/* custom colour picker */}
              <label
                className="relative w-6 h-6 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform flex items-center justify-center text-[9px] text-slate-400"
                title="Custom colour"
              >
                <input
                  type="color"
                  value={inv.accent}
                  onChange={e => set('accent', e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                +
              </label>
            </div>
          </Card>
        </div>

        {/* ═══════════════ PREVIEW ═══════════════ */}
        <div className="xl:sticky xl:top-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Live Preview</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Prints exactly as shown</span>
          </div>

          {/* ── The printable invoice ── */}
          <div
            id="inv-preview"
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
            style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", color: '#1e293b' }}
          >
            {/* Header band */}
            <div style={{ background: inv.accent }} className="px-8 py-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-3xl font-black text-white/90 tracking-tight leading-none">INVOICE</div>
                  <div className="mt-2 text-sm font-semibold text-white/60">{inv.number || 'INV-000'}</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-white/90">{inv.from.name || 'Your Business'}</div>
                  {inv.from.email  && <div className="text-xs text-white/60 mt-0.5">{inv.from.email}</div>}
                  {inv.from.phone  && <div className="text-xs text-white/60">{inv.from.phone}</div>}
                  {inv.from.gstin  && <div className="text-xs text-white/50 mt-0.5">{inv.from.gstin}</div>}
                </div>
              </div>
            </div>

            <div className="px-8 py-6 space-y-5">

              {/* Dates */}
              <div className="flex gap-10">
                {[['Issue Date', inv.date], ['Due Date', inv.dueDate]].map(([lbl, val]) => (
                  <div key={lbl}>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{lbl}</div>
                    <div className="text-sm font-semibold text-slate-700">{val || '—'}</div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-slate-100" />

              {/* From / To */}
              <div className="grid grid-cols-2 gap-6">
                {[{ h: 'From', d: inv.from }, { h: 'Bill To', d: inv.to }].map(({ h, d }) => (
                  <div key={h}>
                    <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: inv.accent }}>{h}</div>
                    <div className="text-sm font-bold text-slate-800">{d.name || '—'}</div>
                    {d.address && <div className="text-xs text-slate-500 mt-1 whitespace-pre-line leading-relaxed">{d.address}</div>}
                    {d.email   && <div className="text-xs text-slate-500 mt-0.5">{d.email}</div>}
                    {d.phone   && <div className="text-xs text-slate-500">{d.phone}</div>}
                    {d.gstin   && <div className="text-xs text-slate-400 mt-0.5">{d.gstin}</div>}
                  </div>
                ))}
              </div>

              {/* Items table */}
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: inv.accent + '1a' }}>
                      {['#', 'Description', 'Qty', 'Rate', 'Amount'].map((h, i) => (
                        <th
                          key={h}
                          className={`py-2.5 px-3 text-[10px] font-black uppercase tracking-widest ${
                            i === 0 ? 'text-left' :
                            i === 1 ? 'text-left' :
                            i === 2 ? 'text-center' : 'text-right'
                          }`}
                          style={{ color: inv.accent }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inv.items.map((item, i) => {
                      const amt = (Number(item.qty) || 0) * (Number(item.rate) || 0);
                      return (
                        <tr key={item.id} style={{ background: i % 2 === 1 ? '#f8fafc' : '#fff' }}>
                          <td className="px-3 py-3 text-slate-400 text-xs">{i + 1}</td>
                          <td className="px-3 py-3 text-slate-700 font-medium">
                            {item.desc || <span style={{ color: '#cbd5e1', fontStyle: 'italic', fontSize: 12 }}>—</span>}
                          </td>
                          <td className="px-3 py-3 text-center text-slate-600">{item.qty}</td>
                          <td className="px-3 py-3 text-right text-slate-600">{fmt(item.rate)}</td>
                          <td className="px-3 py-3 text-right font-bold text-slate-800">{fmt(amt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-56 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span><span className="font-medium">{fmt(subtotal)}</span>
                  </div>
                  {Number(inv.discount) > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({inv.discount}%)</span>
                      <span>− {fmt(discAmt)}</span>
                    </div>
                  )}
                  {Number(inv.tax) > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Tax / GST ({inv.tax}%)</span>
                      <span>{fmt(taxAmt)}</span>
                    </div>
                  )}
                  <div className="h-px bg-slate-200 !my-3" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Total Due</span>
                    <span className="text-xl font-black" style={{ color: inv.accent }}>{fmt(total)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {inv.notes.trim() && (
                <div className="rounded-xl p-4 border border-slate-100" style={{ background: inv.accent + '08' }}>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: inv.accent }}>
                    Notes & Payment Details
                  </div>
                  <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed">{inv.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-slate-100 pt-4 pb-1 text-center">
                <p className="text-[11px] text-slate-400 tracking-wide">
                  Generated via ThinkNode · {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
