import React from 'react';
import { XCircle, Mail } from 'lucide-react';
import { Alert } from '@/types';

interface AlertsModalProps {
  alerts: Alert[];
  onClose: () => void;
  onSendAlert: (alertId: string) => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({ alerts, onClose, onSendAlert }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 md:p-6">
      <div className="bg-white rounded-t-2xl md:rounded-lg shadow-2xl w-full md:max-w-2xl md:w-full h-[90vh] md:max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-white sticky top-0 z-10">
          <h2 className="text-xl sm:text-2xl font-bold">Email Alerts</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <XCircle className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{a.message}</p>
                  <p className="text-xs sm:text-sm text-gray-500 capitalize">{a.type}</p>
                </div>
                {!a.sent ? (
                  <button
                    onClick={() => onSendAlert(a.id)}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0 w-full sm:w-auto"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span>Send</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-green-600 font-medium text-sm whitespace-nowrap">
                    <span>Sent</span>
                    <span>✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 sm:p-6 bg-white sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
