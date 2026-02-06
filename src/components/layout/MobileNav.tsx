import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { User, Alert } from '@/types';

interface MobileNavProps {
  user: User;
  alerts: Alert[];
  onAlertsClick: () => void;
  onLogout: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  user,
  alerts,
  onAlertsClick,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unsentAlerts = alerts.filter((a) => !a.sent).length;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-indigo-600">ContractGuard</h2>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Alerts Button */}
            <button
              onClick={onAlertsClick}
              className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
              aria-label="Alerts"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unsentAlerts > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unsentAlerts}
                </span>
              )}
            </button>

            {/* Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-indigo-600"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 animate-slide-in">
            <div className="px-2 py-2 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Logged in as</p>
              <p className="font-semibold text-gray-900 break-all">{user.email}</p>
            </div>

            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
