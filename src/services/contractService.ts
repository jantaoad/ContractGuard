import { Contract, ContractAnalysis } from '@/types';
import { storageService } from './storageService';

export const contractService = {
  async extractTextFromFile(file: File): Promise<string> {
    if (file.type === 'text/plain') {
      return file.text();
    } else if (file.type === 'application/pdf') {
      return this.extractTextFromPDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For DOCX, would need a library like docx-parser in production
      throw new Error('DOCX parsing requires additional library');
    }
    throw new Error('Unsupported file type');
  },

  async extractTextFromPDF(file: File): Promise<string> {
    const ab = await file.arrayBuffer();
    const u8 = new Uint8Array(ab);
    const b64 = btoa(String.fromCharCode(...u8));

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: b64,
                },
              },
              {
                type: 'text',
                text: 'Extract contract text.',
              },
            ],
          },
        ],
      }),
    });

    const d = await res.json();
    return d.content.find((c: any) => c.type === 'text')?.text || '';
  },

  async analyzeContractText(text: string): Promise<ContractAnalysis> {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Analyze this contract, return ONLY JSON (no markdown):
{"contractType":"string","vendor":"string","summary":"string","riskLevel":"Low|Medium|High","riskScore":0-100,"risks":[{"category":"string","severity":"Low|Medium|High","description":"string"}],"renewalDate":"YYYY-MM-DD","autoRenews":boolean,"noticePeriod":"string","value":"string","complianceScore":0-100}

Contract: ${text}`,
          },
        ],
      }),
    });

    const d = await res.json();
    const t = d.content.find((c: any) => c.type === 'text')?.text || '';
    const clean = t.replace(/```json|```/g, '').trim();
    return JSON.parse(clean) as ContractAnalysis;
  },

  async uploadAndAnalyzeContract(file: File): Promise<Contract> {
    const text = await this.extractTextFromFile(file);
    const analysis = await this.analyzeContractText(text);

    const contract: Contract = {
      id: Date.now().toString(),
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || 'application/pdf',
      s3Key: `contracts/${Date.now()}_${file.name}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'user-1',
      status: 'draft',
      lastModified: new Date().toISOString(),
      tags: [],
      ...analysis,
    };

    return contract;
  },

  async loadContracts(userId: string): Promise<Contract[]> {
    try {
      const c = await storageService.get(`contracts_${userId}`);
      return c ? JSON.parse(c.value) : [];
    } catch {
      return [];
    }
  },

  async saveContracts(userId: string, contracts: Contract[]): Promise<void> {
    if (!userId) return;
    try {
      await storageService.set(`contracts_${userId}`, JSON.stringify(contracts));
    } catch (err) {
      console.error('Save failed:', err);
      throw err;
    }
  },

  calculateStats(contracts: Contract[]) {
    return {
      total: contracts.length,
      high: contracts.filter((c) => c.riskLevel === 'High').length,
      medium: contracts.filter((c) => c.riskLevel === 'Medium').length,
      low: contracts.filter((c) => c.riskLevel === 'Low').length,
      avgRisk: contracts.length
        ? Math.round(contracts.reduce((s, c) => s + (c.riskScore || 0), 0) / contracts.length)
        : 0,
      avgComp: contracts.length
        ? Math.round(contracts.reduce((s, c) => s + (c.overallComplianceScore || 0), 0) / contracts.length)
        : 0,
    };
  },

  getChartData(contracts: Contract[]) {
    const stats = this.calculateStats(contracts);

    const pieData = [
      { name: 'High', value: stats.high, color: '#ef4444' },
      { name: 'Medium', value: stats.medium, color: '#f59e0b' },
      { name: 'Low', value: stats.low, color: '#10b981' },
    ];

    const barData = contracts.map((c) => ({
      name: c.fileName.substring(0, 12),
      risk: c.riskScore || 0,
      comp: c.overallComplianceScore || 0,
    }));

    return { pieData, barData };
  },
};
