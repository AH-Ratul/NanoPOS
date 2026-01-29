import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/instance';
import { useLocation } from 'react-router-dom';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const checkAuth = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setUser(null)
        }
    }

    useEffect(() => {
        if (location.pathname !== "/login") {
            checkAuth()
        } else {
            setLoading(false);
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.log(error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
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
