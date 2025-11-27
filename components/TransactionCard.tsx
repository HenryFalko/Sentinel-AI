import React from 'react';
import { Transaction, RiskLevel } from '../types';
import { AlertTriangle, CheckCircle, ShieldAlert, Clock } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  onClick: (t: Transaction) => void;
  isSelected: boolean;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onClick, isSelected }) => {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'border-red-500 bg-red-950/20';
      case 'flagged': return 'border-orange-500 bg-orange-950/20';
      case 'cleared': return 'border-emerald-500 bg-emerald-950/20';
      default: return 'border-slate-700 bg-slate-800';
    }
  };

  const getRiskIcon = (level?: RiskLevel) => {
    if (level === RiskLevel.CRITICAL || level === RiskLevel.HIGH) return <ShieldAlert className="w-5 h-5 text-red-500" />;
    if (level === RiskLevel.MEDIUM) return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    return <CheckCircle className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <div 
      onClick={() => onClick(transaction)}
      className={`
        p-4 rounded-lg border cursor-pointer transition-all duration-200
        ${getStatusColor(transaction.status)}
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : 'hover:border-slate-500'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {transaction.status === 'analyzing' ? (
            <Clock className="w-5 h-5 text-blue-400 animate-spin" />
          ) : (
            getRiskIcon(transaction.riskLevel)
          )}
          <span className="font-semibold text-slate-100">{transaction.merchant}</span>
        </div>
        <span className="font-mono font-bold text-slate-200">
          {transaction.amount.toFixed(2)} {transaction.currency}
        </span>
      </div>
      
      <div className="flex justify-between text-xs text-slate-400">
        <span>{transaction.type}</span>
        <span>{transaction.timestamp.toLocaleTimeString()}</span>
      </div>
      
      <div className="mt-2 text-xs text-slate-500 truncate">
         📍 {transaction.location}
      </div>

      {transaction.riskScore !== undefined && (
        <div className="mt-3 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${transaction.riskScore > 80 ? 'bg-red-500' : transaction.riskScore > 50 ? 'bg-orange-500' : 'bg-emerald-500'}`}
            style={{ width: `${transaction.riskScore}%` }}
          />
        </div>
      )}
    </div>
  );
};
