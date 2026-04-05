import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, DollarSign, User, Info, CheckCircle, AlertTriangle, Briefcase } from 'lucide-react';
import clsx from 'clsx';

const Toast = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 12000); // 12 seconds for complex data readability
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const { data, text, type, time } = toast;
  
  // Choose styles based on type
  let colorStyles = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/50';
  let icon = <Info className="text-blue-500" size={20} />;
  
  if (type === 'success') {
    icon = <CheckCircle className="text-emerald-500" size={20} />;
  } else if (type === 'error' || type === 'warning') {
    icon = <AlertTriangle className="text-amber-500" size={20} />;
  } else if (data && data.service_type) {
     icon = <Briefcase className="text-indigo-500" size={20} />;
     colorStyles = 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900/50 shadow-indigo-500/10';
  }

  return (
    <div className={clsx(
      "w-full max-w-[340px] pointer-events-auto overflow-hidden rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border backdrop-blur-xl transition-all duration-300 ease-in-out transform flex flex-col mb-3 animate-in slide-in-from-right-8 fade-in",
      colorStyles
    )}>
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-2.5">
          {icon}
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">{text}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{time}</p>
          </div>
        </div>
        <button 
          onClick={() => onRemove(toast.id)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={14} />
        </button>
      </div>

      {/* Body for Complex Data */}
      {data && (data.customer_name || data.project_title) && (
        <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/30 text-sm">
          {data.customer_name && (
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                 <User size={14} className="text-slate-400" />
                 <span className="font-medium text-xs">{data.customer_name}</span>
               </div>
               {data.email && <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{data.email}</span>}
            </div>
          )}
          {data.project_title && (
            <div className="mb-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/50">
               <p className="text-slate-800 dark:text-slate-200 font-semibold text-xs tracking-wide">{data.project_title}</p>
               {data.description && <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-2 mt-1">{data.description}</p>}
               
               {data.customization && Object.keys(data.customization).length > 0 && (
                 <div className="flex flex-wrap gap-1 mt-2">
                   {Object.entries(data.customization).map(([k, v]) => (
                     <span key={k} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                       {k}: {v}
                     </span>
                   ))}
                 </div>
               )}
            </div>
          )}
          
          {/* Quick stats row */}
          {(data.budget || data.deadline || data.service_type) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
               {data.service_type && (
                 <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 uppercase">
                   {data.service_type.replace('_', ' ')}
                 </span>
               )}
               {data.budget && (
                 <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                   <DollarSign size={12} className="text-emerald-500" />
                   {data.budget}
                 </span>
               )}
               {data.deadline && (
                 <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                   <Calendar size={12} className="text-rose-500" />
                   {new Date(data.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                 </span>
               )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col pointer-events-none sm:top-6 sm:right-6 w-full max-w-[340px] pr-4 sm:pr-0">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
