import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.duration === 0) return;
    const timer = setTimeout(() => onClose(toast.id), toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  }[toast.type];

  const textColor = {
    success: 'text-green-700',
    error: 'text-red-700',
    info: 'text-blue-700',
  }[toast.type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: AlertCircle,
  }[toast.type];

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${bgColor} ${textColor} animate-slide-in`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
