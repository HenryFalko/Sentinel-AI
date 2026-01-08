import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const success = await login(email, password);

        if (success) {
            navigate('/dashboard');
        } else {
            setError('Email ou mot de passe incorrect');
        }

        setIsLoading(false);
    };

    const fillDemoCredentials = () => {
        setEmail('demo@sentinelai.com');
        setPassword('demo123');
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
                        <BrainCircuit className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Sentinel<span className="text-blue-500">AI</span>
                    </h1>
                    <p className="text-slate-400">Détection de Fraude Bancaire</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Connexion</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded-lg flex items-center gap-2 text-red-300 text-sm">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="demo@sentinelai.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>

                    {/* Demo Account Info */}
                    <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <p className="text-xs text-slate-400 mb-2">Compte de démonstration :</p>
                        <div className="text-sm text-slate-300 space-y-1">
                            <p><span className="text-slate-500">Email:</span> demo@sentinelai.com</p>
                            <p><span className="text-slate-500">Mot de passe:</span> demo123</p>
                        </div>
                        <button
                            type="button"
                            onClick={fillDemoCredentials}
                            className="mt-3 w-full text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            Remplir automatiquement
                        </button>
                    </div>
                </div>

                <p className="text-center text-slate-500 text-sm mt-6">
                    © 2026 SentinelAI - Tous droits réservés
                </p>
            </div>
        </div>
    );
};
