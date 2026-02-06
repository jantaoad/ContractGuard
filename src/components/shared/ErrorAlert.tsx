import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorAlertProps {
  error: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss, onRetry }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold mb-1">Error</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
        <button onClick={onDismiss} className="text-red-400 hover:text-red-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      {onRetry && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={onRetry}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-red-700"
          >
            Retry
          </button>
          <button
            onClick={onDismiss}
            className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-semibold hover:bg-red-200"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
