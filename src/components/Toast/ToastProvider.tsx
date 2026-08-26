import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@iconify/react';

type ToastType = 'success' | 'error' | 'info';
type Toast = { id: number; message: string; type: ToastType };
type ToastContextValue = { showToast: (message: string, type?: ToastType) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles: Record<ToastType, { icon: string; iconClass: string }> = {
  success: { icon: 'solar:check-circle-bold', iconClass: 'text-emerald-600' },
  error: { icon: 'solar:danger-circle-bold', iconClass: 'text-red-600' },
  info: { icon: 'solar:info-circle-bold', iconClass: 'text-primary' },
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current.slice(-2), { id, message, type }]);
    window.setTimeout(() => dismissToast(id), 4000);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 top-4 z-[200] mx-auto flex max-w-sm flex-col gap-3 sm:left-auto sm:right-5 sm:mx-0" aria-live="polite" aria-atomic="true">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const style = toastStyles[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 36, scale: 0.96 }}
                className="pointer-events-auto flex items-start gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-lg"
                role={toast.type === 'error' ? 'alert' : 'status'}
              >
                <Icon icon={style.icon} className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconClass}`} />
                <p className="flex-1 text-sm font-medium leading-5 text-secondary">{toast.message}</p>
                <button type="button" aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)} className="-mr-1 -mt-1 rounded p-1 text-gray-400 transition hover:bg-stone-100 hover:text-secondary">
                  <Icon icon="solar:close-circle-linear" className="h-5 w-5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider.');
  return context;
};
