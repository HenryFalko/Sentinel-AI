import React, { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, BrainCircuit, Zap } from 'lucide-react';

interface Rule {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    threshold: number;
    category: 'velocity' | 'amount' | 'location' | 'behavior';
}

interface Model {
    id: string;
    name: string;
    type: string;
    accuracy: number;
    lastTrained: Date;
    status: 'active' | 'training' | 'inactive';
}

const MOCK_RULES: Rule[] = [
    {
        id: 'r1',
        name: 'Montant Inhabituel',
        description: 'Détecte les transactions dont le montant dépasse 3x la moyenne',
        enabled: true,
        threshold: 300,
        category: 'amount'
    },
    {
        id: 'r2',
        name: 'Vélocité Élevée',
        description: 'Plus de 5 transactions en moins de 10 minutes',
        enabled: true,
        threshold: 5,
        category: 'velocity'
    },
    {
        id: 'r3',
        name: 'Localisation Suspecte',
        description: 'Transaction depuis un pays à haut risque',
        enabled: false,
        threshold: 0,
        category: 'location'
    },
    {
        id: 'r4',
        name: 'Changement de Comportement',
        description: 'Déviation significative du profil utilisateur',
        enabled: true,
        threshold: 80,
        category: 'behavior'
    }
];

const MOCK_MODELS: Model[] = [
    {
        id: 'm1',
        name: 'Isolation Forest',
        type: 'Détection d\'anomalies',
        accuracy: 94.2,
        lastTrained: new Date('2026-01-01'),
        status: 'active'
    },
    {
        id: 'm2',
        name: 'XGBoost Classifier',
        type: 'Classification supervisée',
        accuracy: 96.8,
        lastTrained: new Date('2026-01-03'),
        status: 'active'
    },
    {
        id: 'm3',
        name: 'LSTM Neural Network',
        type: 'Analyse séquentielle',
        accuracy: 91.5,
        lastTrained: new Date('2025-12-28'),
        status: 'training'
    },
    {
        id: 'm4',
        name: 'Gemini AI',
        type: 'IA Générative',
        accuracy: 98.1,
        lastTrained: new Date('2026-01-06'),
        status: 'active'
    }
];

export const RulesModelsPage: React.FC = () => {
    const [rules, setRules] = useState<Rule[]>(MOCK_RULES);
    const [models] = useState<Model[]>(MOCK_MODELS);

    const toggleRule = (id: string) => {
        setRules(rules.map(rule =>
            rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
        ));
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'amount': return 'bg-blue-950/50 text-blue-400 border-blue-900/50';
            case 'velocity': return 'bg-purple-950/50 text-purple-400 border-purple-900/50';
            case 'location': return 'bg-orange-950/50 text-orange-400 border-orange-900/50';
            case 'behavior': return 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50';
            default: return 'bg-slate-950/50 text-slate-400 border-slate-900/50';
        }
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Règles & Modèles</h1>
                <p className="text-slate-400">Configurez les règles de détection et gérez les modèles d'IA</p>
            </div>

            {/* Rules Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Shield className="text-blue-500" size={24} />
                        Règles de Détection
                    </h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-600/20">
                        <Plus size={18} />
                        Nouvelle Règle
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {rules.map((rule) => (
                        <div key={rule.id} className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-slate-600 transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-1">{rule.name}</h3>
                                    <p className="text-sm text-slate-400">{rule.description}</p>
                                </div>
                                <button
                                    onClick={() => toggleRule(rule.id)}
                                    className="ml-3"
                                >
                                    {rule.enabled ? (
                                        <ToggleRight className="text-emerald-500 w-8 h-8" />
                                    ) : (
                                        <ToggleLeft className="text-slate-600 w-8 h-8" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(rule.category)}`}>
                                    {rule.category.toUpperCase()}
                                </span>

                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-blue-400">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {rule.threshold > 0 && (
                                <div className="mt-3 text-xs text-slate-500">
                                    Seuil: <span className="text-white font-semibold">{rule.threshold}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Models Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <BrainCircuit className="text-purple-500" size={24} />
                        Modèles d'IA
                    </h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors shadow-lg shadow-purple-600/20">
                        <Zap size={18} />
                        Entraîner Nouveau Modèle
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {models.map((model) => (
                        <div key={model.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">{model.name}</h3>
                                    <p className="text-sm text-slate-400">{model.type}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${model.status === 'active' ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50' :
                                        model.status === 'training' ? 'bg-blue-950/50 text-blue-400 border-blue-900/50' :
                                            'bg-slate-950/50 text-slate-400 border-slate-900/50'
                                    }`}>
                                    {model.status === 'active' ? 'Actif' : model.status === 'training' ? 'Entraînement' : 'Inactif'}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-400">Précision</span>
                                    <span className="text-lg font-bold text-white">{model.accuracy}%</span>
                                </div>

                                <div className="w-full bg-slate-900 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                                        style={{ width: `${model.accuracy}%` }}
                                    />
                                </div>

                                <div className="flex justify-between items-center text-xs text-slate-500">
                                    <span>Dernier entraînement</span>
                                    <span>{model.lastTrained.toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-700 flex gap-2">
                                <button className="flex-1 px-3 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
                                    Détails
                                </button>
                                <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors">
                                    Ré-entraîner
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
