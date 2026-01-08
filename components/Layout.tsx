import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Search, ShieldCheck, BrainCircuit, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Layout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', icon: Activity, label: 'Tableau de Bord' },
        { path: '/audit', icon: Search, label: 'Audit Historique' },
        { path: '/rules', icon: ShieldCheck, label: 'Règles & Modèles' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex overflow-hidden font-sans">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <BrainCircuit className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">
                        Sentinel<span className="text-blue-500">AI</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-slate-800 text-blue-400 border border-blue-900/50'
                                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-slate-800 space-y-3">
                    <div className="px-3 py-2 bg-slate-900/50 rounded-lg">
                        <div className="text-xs text-slate-500 mb-1">Connecté en tant que</div>
                        <div className="text-sm font-medium text-white">{user?.name}</div>
                        <div className="text-xs text-slate-400">{user?.role}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 bg-red-950/30 hover:bg-red-950/50 text-red-400 rounded-lg transition-colors border border-red-900/50"
                    >
                        <LogOut size={16} />
                        <span className="font-medium">Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-slate-900/50 backdrop-blur border-b border-slate-800 flex items-center justify-between px-8 z-10">
                    <h2 className="text-lg font-medium text-slate-200">
                        {navItems.find(item => item.path === location.pathname)?.label || 'SentinelAI'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-900/50 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Système Actif
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600"></div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
