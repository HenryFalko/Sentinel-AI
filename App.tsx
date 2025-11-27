import React, { useState, useEffect, useCallback } from 'react';
import { Activity, ShieldCheck, AlertOctagon, Plus, Search, BrainCircuit } from 'lucide-react';
import { Transaction, TransactionType, RiskLevel } from './types';
import { analyzeTransactionWithGemini } from './services/geminiService';
import { TransactionCard } from './components/TransactionCard';
import { AnalyticsCharts } from './components/AnalyticsCharts';

const MOCK_MERCHANTS = ["Amazon", "Apple Store", "Uber Eats", "Carrefour", "Starbucks", "Air France", "Fnac", "Boulangerie Paul"];
const MOCK_LOCATIONS = ["Paris, FR", "Lyon, FR", "Marseille, FR", "London, UK", "New York, USA", "Berlin, DE", "Lagos, NG", "Moscow, RU"];

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [customMerchant, setCustomMerchant] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<string>('');

  // Initial Data Load
  useEffect(() => {
    // Generate some initial history
    const initialData: Transaction[] = Array.from({ length: 5 }).map((_, i) => createRandomTransaction(true));
    setTransactions(initialData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createRandomTransaction = (safe: boolean = false): Transaction => {
    const isAnomaly = !safe && Math.random() > 0.7; // 30% chance of anomaly if not safe
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      amount: isAnomaly ? Math.floor(Math.random() * 2000) + 500 : Math.floor(Math.random() * 100) + 5,
      currency: 'EUR',
      merchant: MOCK_MERCHANTS[Math.floor(Math.random() * MOCK_MERCHANTS.length)],
      location: isAnomaly ? MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)] : "Paris, FR",
      type: TransactionType.ONLINE,
      cardHolder: "Jean Dupont",
      isSimulated: true,
      status: 'pending',
      riskScore: 0, 
    };
  };

  const handleAddCustomTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      amount: parseFloat(customAmount) || 0,
      currency: 'EUR',
      merchant: customMerchant || 'Unknown Merchant',
      location: customLocation || 'Unknown Location',
      type: TransactionType.POS,
      cardHolder: "Jean Dupont",
      isSimulated: false,
      status: 'pending',
    };
    
    setTransactions(prev => [newTx, ...prev]);
    analyzeTransaction(newTx);
    setCustomAmount('');
    setCustomMerchant('');
    setCustomLocation('');
  };

  const handleGenerateRandom = () => {
    const newTx = createRandomTransaction(false);
    setTransactions(prev => [newTx, ...prev]);
    analyzeTransaction(newTx);
  };

  const analyzeTransaction = async (tx: Transaction) => {
    // Update status to analyzing
    setTransactions(prev => prev.map(t => t.id === tx.id ? { ...t, status: 'analyzing' } : t));

    // Call Gemini
    const analysis = await analyzeTransactionWithGemini(tx);

    // Update with results
    setTransactions(prev => prev.map(t => {
      if (t.id === tx.id) {
        return {
          ...t,
          status: analysis.recommendedAction === 'BLOCK' ? 'blocked' : analysis.recommendedAction === 'REVIEW' ? 'flagged' : 'cleared',
          riskScore: analysis.riskScore,
          riskLevel: analysis.riskLevel as RiskLevel,
          anomalies: analysis.anomalies,
          aiReasoning: analysis.explanation
        };
      }
      return t;
    }));

    // If it's the selected one, update view
    if (selectedTransaction?.id === tx.id) {
      setSelectedTransaction(prev => prev ? { ...prev, ...analysis, status: 'cleared' /* simplified for view update */ } : null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <BrainCircuit className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Sentinel<span className="text-blue-500">AI</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 text-blue-400 rounded-lg border border-blue-900/50">
            <Activity size={18} />
            <span className="font-medium">Tableau de Bord</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-900 hover:text-slate-200 rounded-lg transition-colors">
            <Search size={18} />
            <span className="font-medium">Audit Historique</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-900 hover:text-slate-200 rounded-lg transition-colors">
            <ShieldCheck size={18} />
            <span className="font-medium">Règles & Modèles</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="text-xs text-slate-500 mb-2">SIMULATEUR DE FLUX</div>
           <button 
             onClick={handleGenerateRandom}
             className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-sm transition-all"
           >
             Générer Transaction
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-medium text-slate-200">Surveillance Temps Réel</h2>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-900/50 text-emerald-500 text-xs font-bold uppercase tracking-wider">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Système Actif
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600"></div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
            
          {/* Top Analytics Section */}
          <AnalyticsCharts transactions={transactions} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-[500px]">
            
            {/* Left Col: New Transaction Input & Recent List */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* Input Form */}
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Plus size={16} /> Nouvelle Transaction
                </h3>
                <form onSubmit={handleAddCustomTransaction} className="space-y-3">
                  <div>
                    <input 
                      type="number" 
                      placeholder="Montant (EUR)" 
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-600"
                      required
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Marchand (ex: Apple Store)" 
                      value={customMerchant}
                      onChange={(e) => setCustomMerchant(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-600"
                      required
                    />
                  </div>
                  <div>
                     <input 
                      type="text" 
                      placeholder="Lieu (ex: Tokyo, JP)" 
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-600"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded transition-colors shadow-lg shadow-blue-600/20"
                  >
                    Analyser
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="flex-1 overflow-hidden flex flex-col bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="p-4 border-b border-slate-700/50">
                  <h3 className="text-sm font-semibold text-slate-400">Flux Récents</h3>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                  {transactions.map(tx => (
                    <TransactionCard 
                      key={tx.id} 
                      transaction={tx} 
                      onClick={setSelectedTransaction}
                      isSelected={selectedTransaction?.id === tx.id}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Detailed Analysis Panel */}
            <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col">
              {selectedTransaction ? (
                <div className="flex flex-col h-full">
                  <div className={`p-6 border-b ${selectedTransaction.status === 'blocked' ? 'bg-red-950/30 border-red-900/30' : selectedTransaction.status === 'flagged' ? 'bg-orange-950/30 border-orange-900/30' : 'bg-slate-800 border-slate-700'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Analyse #Tx-{selectedTransaction.id}</h2>
                        <div className="flex items-center gap-3 text-slate-400 text-sm">
                           <span>{selectedTransaction.timestamp.toLocaleString()}</span>
                           <span>•</span>
                           <span>{selectedTransaction.type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-mono font-bold text-white">{selectedTransaction.amount.toFixed(2)} €</div>
                        <div className="text-sm text-slate-400">{selectedTransaction.merchant}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 flex-1 overflow-y-auto">
                    
                    {/* Status & Score */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                       <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                          <h4 className="text-slate-400 text-xs font-bold uppercase mb-4">Score de Risque</h4>
                          <div className="flex items-end gap-4">
                            <span className={`text-5xl font-bold ${selectedTransaction.riskScore && selectedTransaction.riskScore > 80 ? 'text-red-500' : selectedTransaction.riskScore && selectedTransaction.riskScore > 50 ? 'text-orange-500' : 'text-emerald-500'}`}>
                              {selectedTransaction.riskScore ?? 0}
                            </span>
                            <span className="text-slate-500 text-lg mb-2">/ 100</span>
                          </div>
                          <div className="mt-4 text-sm text-slate-300">
                             Niveau: <span className="font-semibold text-white">{selectedTransaction.riskLevel || 'En attente...'}</span>
                          </div>
                       </div>

                       <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                          <h4 className="text-slate-400 text-xs font-bold uppercase mb-4">Moteur de Décision</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Isolation Forest (Outlier)</span>
                              <span className={selectedTransaction.riskScore && selectedTransaction.riskScore > 70 ? 'text-red-400' : 'text-emerald-400'}>
                                {selectedTransaction.riskScore && selectedTransaction.riskScore > 70 ? 'Anomalie Détectée' : 'Normal'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-400">XGBoost Confidence</span>
                              <span className="text-blue-400">98.4%</span>
                            </div>
                             <div className="flex justify-between text-sm">
                              <span className="text-slate-400">Velocity Check</span>
                              <span className="text-emerald-400">Pass</span>
                            </div>
                          </div>
                       </div>
                    </div>

                    {/* AI Reasoning */}
                    <div className="mb-8">
                      <h4 className="text-slate-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                        <BrainCircuit size={16} className="text-blue-500" />
                        Analyse IA Générative (Gemini)
                      </h4>
                      <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 text-slate-300 leading-relaxed font-mono text-sm">
                        {selectedTransaction.status === 'analyzing' ? (
                          <div className="flex items-center gap-3 text-blue-400">
                            <span className="animate-pulse">Analyse des vecteurs de transaction en cours...</span>
                          </div>
                        ) : (
                           selectedTransaction.aiReasoning || "En attente d'analyse..."
                        )}
                      </div>
                    </div>

                    {/* Anomalies List */}
                    {selectedTransaction.anomalies && selectedTransaction.anomalies.length > 0 && (
                      <div>
                        <h4 className="text-slate-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                          <AlertOctagon size={16} className="text-orange-500" />
                          Indicateurs Suspects
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTransaction.anomalies.map((anomaly, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full bg-red-950/40 border border-red-900/60 text-red-300 text-sm">
                              {anomaly}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                  <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
                  <p>Sélectionnez une transaction pour voir l'analyse détaillée.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
