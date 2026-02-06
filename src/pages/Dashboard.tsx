import React, { useState } from 'react';
import { FileText, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { User, Contract, Alert } from '@/types';
import { contractService } from '@/services/contractService';
import { Navigation } from '@/components/Navigation';
import { MobileNav } from '@/components/MobileNav';
import { StatCard } from '@/components/StatCard';
import { RiskDistributionChart } from '@/components/RiskDistributionChart';
import { ContractPerformanceChart } from '@/components/ContractPerformanceChart';
import { ContractUpload } from '@/components/ContractUpload';
import { ContractTable } from '@/components/ContractTable';
import { AlertsModal } from '@/components/AlertsModal';
import { ContractDetailsModal } from '@/components/ContractDetailsModal';
import { ErrorAlert } from '@/components/ErrorAlert';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface DashboardProps {
  user: User;
  contracts: Contract[];
  alerts: Alert[];
  onLogout: () => void;
  onAddContract: (contract: Contract) => void;
  onMarkAlertSent: (alertId: string) => void;
  onError: (error: string) => void;
  error: string | null;
  onDismissError: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  contracts,
  alerts,
  onLogout,
  onMarkAlertSent,
  onError,
  error,
  onDismissError,
}: DashboardProps) => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingContracts] = useState(false);

  const stats = contractService.calculateStats(contracts);
  const { pieData, barData } = contractService.getChartData(contracts);

  const handleUploadSuccess = async () => {
    // Data will be added by parent component
  };

  const handleSendAlert = (alertId: string) => {
    onMarkAlertSent(alertId);
    alerts.map((a) => (a.id === alertId ? { ...a, sent: true } : a));
    alert('Email sent! (Demo mode)');
  };

  const handleRetryLastAction = () => {
    // This would retry the last failed action - implement based on context
    onDismissError();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNav
          user={user}
          alerts={alerts}
          onAlertsClick={() => setShowAlerts(!showAlerts)}
          onLogout={onLogout}
        />
      </div>

      {/* Desktop Navigation */}
      <Navigation
        user={user}
        alerts={alerts}
        onAlertsClick={() => setShowAlerts(!showAlerts)}
        onLogout={onLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Error Alert */}
        {error && (
          <ErrorAlert
            error={error}
            onDismiss={onDismissError}
            onRetry={handleRetryLastAction}
          />
        )}

        {/* Loading Spinner - shown while contracts are loading */}
        {loadingContracts && (
          <div className="flex justify-center py-8">
            <LoadingSpinner message="Loading contracts..." />
          </div>
        )}

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={FileText}
            title="Total Contracts"
            value={stats.total}
            iconColor="text-blue-600"
          />
          <StatCard
            icon={AlertTriangle}
            title="High Risk"
            value={stats.high}
            iconColor="text-red-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Avg Risk Score"
            value={stats.avgRisk}
            iconColor="text-green-600"
          />
          <StatCard
            icon={CheckCircle}
            title="Compliance"
            value={`${stats.avgComp}%`}
            iconColor="text-purple-600"
          />
        </div>

        {/* Charts - Stack on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <RiskDistributionChart data={pieData} />
          <ContractPerformanceChart data={barData} />
        </div>

        {/* Upload Section */}
        <ContractUpload
          onUploadSuccess={handleUploadSuccess}
          onError={onError}
          uploading={uploading}
          onUploadStart={() => setUploading(true)}
          onUploadEnd={() => setUploading(false)}
        />

        {/* Contracts Table */}
        <ContractTable contracts={contracts} onSelectContract={setSelectedContract} />

        {/* Alerts Modal */}
        {showAlerts && alerts.length > 0 && (
          <AlertsModal
            alerts={alerts}
            onClose={() => setShowAlerts(false)}
            onSendAlert={handleSendAlert}
          />
        )}

        {/* Contract Details Modal */}
        {selectedContract && (
          <ContractDetailsModal
            contract={selectedContract}
            onClose={() => setSelectedContract(null)}
          />
        )}
      </div>
    </div>
  );
};
