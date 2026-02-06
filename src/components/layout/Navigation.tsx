import React from 'react';
import { Shield, Bell, User, LogOut } from 'lucide-react';
import { User as UserType, Alert } from '@/types';

interface NavigationProps {
  user: UserType;
  alerts: Alert[];
  onAlertsClick: () => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  user,
  alerts,
  onAlertsClick,
  onLogout,
}) => {
  const unsentAlerts = alerts.filter((a) => !a.sent).length;

  return (
    // Desktop Navigation - Hidden on mobile
    <nav className="hidden md:block bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-indigo-600 flex-shrink-0" />
          <div>
            <h1 className="text-xl font-bold">ContractGuard</h1>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={onAlertsClick}
            className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            aria-label="Alerts"
          >
            <Bell className="w-6 h-6" />
            {unsentAlerts > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                {unsentAlerts > 9 ? '9+' : unsentAlerts}
              </span>
            )}
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
