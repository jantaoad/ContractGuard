// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

export type UserRole = 'operator' | 'ceo' | 'counsel' | 'admin';
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organizationId: string;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ORGANIZATION & TEAM TYPES
// ============================================================================

export interface Organization {
  id: string;
  name: string;
  industry: string;
  size: 'startup' | 'smb' | 'enterprise';
  subscription: SubscriptionTier;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// CLAUSE & RISK TYPES
// ============================================================================

export type RiskLevel = 'Low' | 'Medium' | 'High';
export type ClauseCategory =
  | 'liability'
  | 'termination'
  | 'renewal'
  | 'payment'
  | 'confidentiality'
  | 'intellectual_property'
  | 'warranty'
  | 'indemnification'
  | 'compliance'
  | 'other';

export interface Clause {
  id: string;
  category: ClauseCategory;
  text: string;
  pageNumber: number;
  startOffset: number;
  endOffset: number;
  riskLevel: RiskLevel;
  explanation: string;
  suggestedAction?: string;
}

export interface Risk {
  id: string;
  category: ClauseCategory;
  severity: RiskLevel;
  description: string;
  impact: string;
  likelihood: 'Low' | 'Medium' | 'High';
  mitigation?: string;
  relatedClauses: string[]; // clauseIds
}

// ============================================================================
// CONTRACT ANALYSIS TYPES
// ============================================================================

export interface ContractAnalysis {
  contractType: string;
  vendor: string;
  counterparty: string;
  summary: string;
  executiveSummary: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  overallComplianceScore: number; // 0-100
  risks: Risk[];
  clauses: Clause[];
  keyDates: KeyDate[];
  obligations: Obligation[];
  permissions: string[];
  restrictions: string[];
  renewalDate?: string;
  renewalWindowStart?: string;
  renewalWindowEnd?: string;
  autoRenews: boolean;
  noticePeriod: string;
  terminationClauses: TerminationClause[];
  value?: string;
  currency?: string;
  paymentTerms?: string;
  complianceRequirements: ComplianceRequirement[];
  legalJurisdiction: string;
  governingLaw: string;
  aiConfidence: number; // 0-1
  extractionMethod: 'ocr' | 'pdf-native' | 'manual';
}

export type ContractStatus = 'draft' | 'active' | 'expired' | 'terminated' | 'archived';

export interface Contract extends ContractAnalysis {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  s3Key: string;
  uploadedAt: string;
  uploadedBy: string;
  status: ContractStatus;
  lastModified: string;
  lastReviewedAt?: string;
  reviewedBy?: string;
  tags: string[];
  customMetadata?: Record<string, unknown>;
}

// ============================================================================
// KEY DATES & OBLIGATIONS
// ============================================================================

export type DateType = 'renewal' | 'termination' | 'notice_required' | 'payment_due' | 'audit' | 'other';

export interface KeyDate {
  id: string;
  type: DateType;
  date: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  daysUntil?: number;
}

export interface Obligation {
  id: string;
  party: 'vendor' | 'customer' | 'both';
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
}

export interface TerminationClause {
  id: string;
  triggerEvent: string;
  noticeDaysRequired: number;
  penalties?: string;
  dataReturn?: string;
  liabilityAfterTermination?: string;
}

export interface ComplianceRequirement {
  id: string;
  requirement: string;
  standard: string; // e.g., 'GDPR', 'HIPAA', 'SOC2'
  riskIfNotMet: string;
  dueDate?: string;
}

// ============================================================================
// ALERT & NOTIFICATION TYPES
// ============================================================================

export type AlertType =
  | 'renewal'
  | 'risk'
  | 'compliance'
  | 'obligation_due'
  | 'termination_window'
  | 'manual';

export interface Alert {
  id: string;
  contractId: string;
  organizationId: string;
  type: AlertType;
  severity: RiskLevel;
  title: string;
  message: string;
  actionUrl?: string;
  sent: boolean;
  sentAt?: string;
  sentVia?: 'email' | 'in-app' | 'both';
  createdAt: string;
  dismissedAt?: string;
}

// ============================================================================
// RAG & VECTOR DATABASE TYPES
// ============================================================================

export interface VectorChunk {
  id: string;
  contractId: string;
  content: string;
  embedding: number[]; // Vector embedding
  metadata: {
    pageNumber: number;
    clauseCategory?: ClauseCategory;
    riskLevel?: RiskLevel;
  };
  createdAt: string;
}

export interface RetrievalResult {
  contractId: string;
  clauseId?: string;
  relevanceScore: number; // 0-1
  text: string;
  clauseCategory?: ClauseCategory;
}

// ============================================================================
// DASHBOARD & STATISTICS TYPES
// ============================================================================

export interface ContractStats {
  total: number;
  high: number;
  medium: number;
  low: number;
  avgRisk: number;
  avgComp: number;
  expiringSoon: number;
  archivedCount: number;
}

export interface ComplianceMetrics {
  criticalNonCompliances: number;
  highRiskClauses: number;
  obligations: number;
  obligationsCompleted: number;
  complianceScore: number;
}

export interface DashboardMetrics {
  contractStats: ContractStats;
  complianceMetrics: ComplianceMetrics;
  recentAlerts: Alert[];
  upcomingRenewals: KeyDate[];
  performanceMetrics: {
    avgProcessingTime: number;
    apiLatency: number;
    llmAccuracy: number;
    userSatisfaction: number;
  };
}

// ============================================================================
// CHART DATA TYPES
// ============================================================================

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface BarChartData {
  name: string;
  risk: number;
  comp: number;
}

export interface TimeSeriesData {
  date: string;
  contracts: number;
  alerts: number;
  avgRiskScore: number;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface UploadContractRequest {
  file: File;
  tags?: string[];
  customMetadata?: Record<string, unknown>;
}

export interface AnalysisResponse {
  contractId: string;
  analysis: ContractAnalysis;
  processingTimeMs: number;
  vectorChunksCreated: number;
}

export interface AlertResponse {
  ids: string[];
  count: number;
  created: string;
}

// ============================================================================
// FEATURE FLAGS & CONFIGURATION
// ============================================================================

export interface FeatureFlags {
  ragRetrieval: boolean;
  clauseComparison: boolean;
  negotiationSuggestions: boolean;
  googleDriveSync: boolean;
  docusignIntegration: boolean;
  multiLanguage: boolean;
  advancedAnalytics: boolean;
}
