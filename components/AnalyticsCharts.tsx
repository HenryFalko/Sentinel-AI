import React from 'react';
import { Transaction } from '../types';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface AnalyticsChartsProps {
  transactions: Transaction[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ transactions }) => {
  
  const data = transactions.map(t => ({
    ...t,
    x: t.timestamp.getTime(),
    y: t.amount,
    z: t.riskScore || 0
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Chart 1: Anomaly Detection Scatter Plot */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Détection d'Anomalies (Isolation Forest Visualisation)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Time" 
                domain={['auto', 'auto']}
                tickFormatter={(unixTime) => new Date(unixTime).getHours() + 'h'}
                stroke="#94a3b8"
                fontSize={12}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Amount" 
                unit="€" 
                stroke="#94a3b8"
                fontSize={12}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <Scatter name="Transactions" data={data} fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.z > 80 ? '#ef4444' : entry.z > 50 ? '#f97316' : '#10b981'} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center items-center">
            <span className="text-slate-400 text-sm mb-2">Volume Total (1h)</span>
            <span className="text-3xl font-bold text-white">
                {transactions.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center items-center">
            <span className="text-slate-400 text-sm mb-2">Transactions Suspectes</span>
            <span className="text-3xl font-bold text-red-500">
                {transactions.filter(t => (t.riskScore || 0) > 80).length}
            </span>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center items-center">
            <span className="text-slate-400 text-sm mb-2">Taux de Fraude Est.</span>
            <span className="text-3xl font-bold text-orange-400">
                {((transactions.filter(t => (t.riskScore || 0) > 80).length / transactions.length) * 100).toFixed(1)}%
            </span>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center items-center">
            <span className="text-slate-400 text-sm mb-2">Temps Moyen Analyse</span>
            <span className="text-3xl font-bold text-blue-400">
                1.2s
            </span>
        </div>
      </div>
    </div>
  );
};
