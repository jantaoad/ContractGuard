import { Alert, Contract } from '@/types';
import { storageService } from './storageService';

export const alertService = {
  async loadAlerts(userId: string): Promise<Alert[]> {
    try {
      const a = await storageService.get(`alerts_${userId}`);
      return a ? JSON.parse(a.value) : [];
    } catch {
      return [];
    }
  },

  async saveAlerts(userId: string, alerts: Alert[]): Promise<void> {
    if (!userId) return;
    try {
      await storageService.set(`alerts_${userId}`, JSON.stringify(alerts));
    } catch (err) {
      console.error('Save failed:', err);
      throw err;
    }
  },

  checkContractAlerts(contract: Contract): Alert[] {
    if (!contract.renewalDate) return [];

    const rd = new Date(contract.renewalDate);
    const days = Math.ceil((rd.getTime() - new Date().getTime()) / 86400000);
    const newAlerts: Alert[] = [];

    if (days <= 30 && days > 0) {
      newAlerts.push({
        id: Date.now().toString(),
        contractId: contract.id,
        organizationId: 'org-1',
        type: 'renewal',
        severity: 'Medium',
        title: 'Contract Renewal Upcoming',
        message: `"${contract.fileName}" renews in ${days} days`,
        sent: false,
        createdAt: new Date().toISOString(),
      });
    }

    if (contract.riskLevel === 'High') {
      newAlerts.push({
        id: (Date.now() + 1).toString(),
        contractId: contract.id,
        organizationId: 'org-1',
        type: 'risk',
        severity: 'High',
        title: 'High-Risk Contract',
        message: `High risk in "${contract.fileName}"`,
        sent: false,
        createdAt: new Date().toISOString(),
      });
    }

    return newAlerts;
  },

  sendAlert(alertId: string, alerts: Alert[]): Alert[] {
    return alerts.map((a) => (a.id === alertId ? { ...a, sent: true } : a));
  },
};
