import { useState, useEffect, useCallback } from 'react';
import { User, Contract, Alert } from '@/types';
import { contractService } from '@/services/contractService';
import { alertService } from '@/services/alertService';

export const useContractData = (user: User | null) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [c, a] = await Promise.all([
        contractService.loadContracts(user.id),
        alertService.loadAlerts(user.id),
      ]);
      setContracts(c);
      setAlerts(a);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveContracts = useCallback(
    async (newContracts: Contract[]) => {
      if (!user) return;
      setContracts(newContracts);
      await contractService.saveContracts(user.id, newContracts);
    },
    [user]
  );

  const saveAlerts = useCallback(
    async (newAlerts: Alert[]) => {
      if (!user) return;
      setAlerts(newAlerts);
      await alertService.saveAlerts(user.id, newAlerts);
    },
    [user]
  );

  const addContract = useCallback(
    async (contract: Contract) => {
      const updated = [...contracts, contract];
      await saveContracts(updated);

      // Check for alerts
      const newAlerts = alertService.checkContractAlerts(contract);
      if (newAlerts.length > 0) {
        const updatedAlerts = [...alerts, ...newAlerts];
        await saveAlerts(updatedAlerts);
      }

      return contract;
    },
    [contracts, alerts, saveContracts, saveAlerts]
  );

  const markAlertSent = useCallback(
    async (alertId: string) => {
      const updated = alertService.sendAlert(alertId, alerts);
      await saveAlerts(updated);
    },
    [alerts, saveAlerts]
  );

  return {
    contracts,
    alerts,
    loading,
    error,
    addContract,
    markAlertSent,
    setError,
  };
};
