import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../types';

// Mock data pour l'historique
const MOCK_HISTORY: Transaction[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `tx-${1000 + i}`,
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    amount: Math.floor(Math.random() * 1000) + 10,
    currency: 'EUR',
    merchant: ['Amazon', 'Apple Store', 'Carrefour', 'Uber', 'Air France'][Math.floor(Math.random() * 5)],
    location: ['Paris, FR', 'Lyon, FR', 'London, UK', 'Berlin, DE'][Math.floor(Math.random() * 4)],
    type: Math.random() > 0.5 ? 'ONLINE' : 'POS',
    cardHolder: 'Jean Dupont',
    status: ['cleared', 'flagged', 'blocked'][Math.floor(Math.random() * 3)],
    riskScore: Math.floor(Math.random() * 100),
    riskLevel: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)] as any,
}));

export const AuditHistoryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredTransactions = MOCK_HISTORY.filter(tx => {
        const matchesSearch = tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || tx.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: MOCK_HISTORY.length,
        cleared: MOCK_HISTORY.filter(t => t.status === 'cleared').length,
        flagged: MOCK_HISTORY.filter(t => t.status === 'flagged').length,
        blocked: MOCK_HISTORY.filter(t => t.status === 'blocked').length,
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Audit Historique</h1>
                    <p className="text-slate-400">Consultez l'historique complet des transactions analysées</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-600/20">
                    <Download size={18} />
                    Exporter CSV
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Total</span>
                        <Calendar className="text-blue-500" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white">{stats.total}</div>
                </div>

                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Validées</span>
                        <TrendingUp className="text-emerald-500" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-emerald-500">{stats.cleared}</div>
                </div>

                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Signalées</span>
                        <TrendingDown className="text-orange-500" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-orange-500">{stats.flagged}</div>
                </div>

                <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Bloquées</span>
                        <TrendingDown className="text-red-500" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-red-500">{stats.blocked}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par marchand ou ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="text-slate-500" size={18} />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="cleared">Validées</option>
                        <option value="flagged">Signalées</option>
                        <option value="blocked">Bloquées</option>
                    </select>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-900/50 border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Marchand</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Montant</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Risque</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-300">{tx.id}</td>
                                    <td className="px-6 py-4 text-sm text-slate-300">
                                        {tx.timestamp.toLocaleDateString('fr-FR')}
                                        <br />
                                        <span className="text-xs text-slate-500">{tx.timestamp.toLocaleTimeString('fr-FR')}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-300">
                                        {tx.merchant}
                                        <br />
                                        <span className="text-xs text-slate-500">{tx.location}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-white">{tx.amount.toFixed(2)} €</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`text-sm font-bold ${tx.riskScore && tx.riskScore > 70 ? 'text-red-500' :
                                                    tx.riskScore && tx.riskScore > 40 ? 'text-orange-500' :
                                                        'text-emerald-500'
                                                }`}>
                                                {tx.riskScore}/100
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'cleared' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50' :
                                                tx.status === 'flagged' ? 'bg-orange-950/50 text-orange-400 border border-orange-900/50' :
                                                    'bg-red-950/50 text-red-400 border border-red-900/50'
                                            }`}>
                                            {tx.status === 'cleared' ? 'Validée' : tx.status === 'flagged' ? 'Signalée' : 'Bloquée'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
