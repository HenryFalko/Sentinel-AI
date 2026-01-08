import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Compte démo
const DEMO_USER = {
    email: 'demo@sentinelai.com',
    password: 'demo123',
    name: 'Utilisateur Démo',
    role: 'Analyste Fraude'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Vérifier si l'utilisateur est déjà connecté (localStorage)
    useEffect(() => {
        const storedUser = localStorage.getItem('sentinelai_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Simulation d'une requête API
        await new Promise(resolve => setTimeout(resolve, 800));

        if (email === DEMO_USER.email && password === DEMO_USER.password) {
            const userData = {
                email: DEMO_USER.email,
                name: DEMO_USER.name,
                role: DEMO_USER.role
            };
            setUser(userData);
            localStorage.setItem('sentinelai_user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sentinelai_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
