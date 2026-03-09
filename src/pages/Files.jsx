import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Download, FileCode, FileImage, FileText, Package, Folder } from 'lucide-react';
import { clients } from '../data/dummyData';
import clsx from 'clsx';

const typeIcons = {
  'Design': <FileImage size={16} className="text-pink-500" />,
  'Source Code': <FileCode size={16} className="text-blue-500" />,
  'Document': <FileText size={16} className="text-yellow-500" />,
  'Asset': <Package size={16} className="text-purple-500" />,
};

const typeColors = {
  'Design': 'bg-pink-50 dark:bg-pink-900/20',
  'Source Code': 'bg-blue-50 dark:bg-blue-900/20',
  'Document': 'bg-yellow-50 dark:bg-yellow-900/20',
  'Asset': 'bg-purple-50 dark:bg-purple-900/20',
};

export default function Files() {
  const { files } = useApp();
  const [search, setSearch] = useState('');
  const [activeClient, setActiveClient] = useState('All');

  const clientNames = ['All', ...new Set(files.map(f => f.client))];

  const filtered = files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.project.toLowerCase().includes(search.toLowerCase());
    const matchClient = activeClient === 'All' || f.client === activeClient;
    return matchSearch && matchClient;
  });

  const grouped = filtered.reduce((acc, file) => {
    const key = file.client;
    if (!acc[key]) acc[key] = [];
    acc[key].push(file);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 flex-1 max-w-sm">
          <Search size={16} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none placeholder-slate-400" />
        </div>
      </div>

      {/* Client filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {clientNames.map(name => (
          <button
            key={name}
            onClick={() => setActiveClient(name)}
            className={clsx(
              'text-xs px-3 py-1.5 rounded-lg font-medium transition-colors',
              activeClient === name
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
            )}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {['Design', 'Source Code', 'Document', 'Asset'].map(type => (
          <div key={type} className={clsx('rounded-xl p-4 border border-slate-200 dark:border-slate-700', typeColors[type])}>
            <div className="flex items-center gap-2 mb-2">
              {typeIcons[type]}
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{type}</span>
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{files.filter(f => f.type === type).length}</p>
          </div>
        ))}
      </div>

      {/* File listing by client folder */}
      {Object.entries(grouped).map(([clientName, clientFiles]) => (
        <div key={clientName} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <Folder size={16} className="text-blue-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{clientName}</span>
            <span className="text-xs text-slate-400 ml-auto">{clientFiles.length} files</span>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {clientFiles.map(file => (
              <div key={file.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', typeColors[file.type])}>
                  {typeIcons[file.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400 truncate">{file.project}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{file.size}</p>
                  <p className="text-xs text-slate-400">{file.uploadDate}</p>
                </div>
                <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-lg hidden md:block">{file.type}</span>
                <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400 text-sm">No files found.</div>
      )}
    </div>
  );
}
