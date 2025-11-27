export enum TransactionType {
  ONLINE = 'En ligne',
  POS = 'Terminal Point de Vente',
  ATM = 'Retrait Distributeur',
  TRANSFER = 'Virement'
}

export enum RiskLevel {
  LOW = 'Faible',
  MEDIUM = 'Moyen',
  HIGH = 'Élevé',
  CRITICAL = 'Critique'
}

export interface Transaction {
  id: string;
  timestamp: Date;
  amount: number;
  currency: string;
  merchant: string;
  location: string;
  type: TransactionType;
  cardHolder: string;
  isSimulated: boolean;
  // Analysis results
  riskScore?: number; // 0-100
  riskLevel?: RiskLevel;
  anomalies?: string[];
  aiReasoning?: string;
  status: 'pending' | 'analyzing' | 'cleared' | 'flagged' | 'blocked';
}

export interface FraudAnalysisResult {
  riskScore: number;
  riskLevel: string;
  isFraud: boolean;
  anomalies: string[];
  modelConfidence: number;
  explanation: string;
  recommendedAction: 'ALLOW' | 'REVIEW' | 'BLOCK';
}
