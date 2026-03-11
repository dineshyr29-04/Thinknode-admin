import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, Edit3, Trash2, Eye, X, Mail, Phone, Building2 } from 'lucide-react';
import clsx from 'clsx';

const serviceOptions = ['Web Development', 'Frontend Development', 'E-Poster Design', 'n8n Automation'];

const statusColors = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  Planning: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  Development: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  Testing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  Delivered: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
};

const paymentColors = {
  Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  Pending: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  Partial: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
};

function Modal({ client, onClose, onSave }) {
  const [form, setForm] = useState(client || { name: '', company: '', email: '', phone: '', service: 'Web Development', projectStatus: 'Active', paymentStatus: 'Pending', notes: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white">{client ? 'Edit Client' : 'Add New Client'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[['name', 'Client Name'], ['company', 'Company'], ['email', 'Email'], ['phone', 'Phone']].map(([k, label]) => (
              <div key={k}>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">{label}</label>
                <input
                  value={form[k]}
                  onChange={e => set(k, e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Service Type</label>
            <select value={form.service} onChange={e => set('service', e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
              {serviceOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Notes</label>
            <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
            {client ? 'Save Changes' : 'Add Client'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient, isAdmin } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | client object

  const filtered = clients.filter(c =>
    [c.name, c.company, c.email, c.service].some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 flex-1 max-w-sm">
          <Search size={16} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none placeholder-slate-400" />
        </div>
        {isAdmin && (
          <button onClick={() => setModal('add')} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20">
            <Plus size={16} />
            Add Client
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: clients.length, color: 'text-blue-500' },
          { label: 'Active Projects', value: clients.filter(c => c.projectStatus === 'Active' || c.projectStatus === 'Development').length, color: 'text-purple-500' },
          { label: 'Paid', value: clients.filter(c => c.paymentStatus === 'Paid').length, color: 'text-emerald-500' },
          { label: 'Pending Payment', value: clients.filter(c => c.paymentStatus === 'Pending').length, color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3.5">Client</th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3.5 hidden md:table-cell">Contact</th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3.5">Service</th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3.5 hidden lg:table-cell">Project Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3.5">Payment</th>
                <th className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${client.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {client.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{client.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><Building2 size={10} />{client.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1"><Mail size={10} className="text-slate-400" />{client.email}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Phone size={10} className="text-slate-400" />{client.phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">{client.service}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className={clsx('text-xs px-2 py-1 rounded-full font-medium', statusColors[client.projectStatus] ?? statusColors.Active)}>{client.projectStatus}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={clsx('text-xs px-2 py-1 rounded-full font-medium', paymentColors[client.paymentStatus])}>{client.paymentStatus}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {isAdmin && (
                        <>
                          <button onClick={() => setModal(client)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => deleteClient(client.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">No clients found.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          client={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={data => modal === 'add' ? addClient(data) : updateClient(modal.id, data)}
        />
      )}
    </div>
  );
}
