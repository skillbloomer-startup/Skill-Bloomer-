import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id}
            className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-2 fade-in duration-300 pointer-events-auto border border-border border-l-4 bg-card text-foreground min-w-[300px]",
              t.type === 'success' ? "border-l-emerald-500" :
              t.type === 'error' ? "border-l-red-500" :
              t.type === 'warning' ? "border-l-yellow-500" : "border-l-primary"
            )}
          >
            <div className={cn(
              "shrink-0",
              t.type === 'success' ? "text-emerald-500" :
              t.type === 'error' ? "text-red-500" :
              t.type === 'warning' ? "text-yellow-500" : "text-primary"
            )}>
              {t.type === 'success' && <CheckCircle2 size={18} />}
              {t.type === 'error' && <XCircle size={18} />}
              {t.type === 'warning' && <AlertTriangle size={18} />}
              {t.type === 'info' && <Info size={18} />}
            </div>
            <span className="text-sm font-semibold flex-1">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
