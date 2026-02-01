import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Helpers pour gérer le stockage (localStorage ou sessionStorage)
const getStorage = () => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    return rememberMe ? localStorage : sessionStorage;
};

const getStoredData = (key) => {
    // Vérifier d'abord localStorage, puis sessionStorage
    return localStorage.getItem(key) || sessionStorage.getItem(key);
};

const clearAllStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getStoredData('token');
        const savedUser = getStoredData('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password, rememberMe = false) => {
        const response = await authAPI.login({ email, password });
        const { token, user } = response.data;

        // Nettoyer les deux stockages d'abord
        clearAllStorage();

        // Choisir le stockage en fonction de "Se souvenir de moi"
        const storage = rememberMe ? localStorage : sessionStorage;

        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }

        storage.setItem('token', token);
        storage.setItem('user', JSON.stringify(user));
        setUser(user);

        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await authAPI.register({ name, email, password });
        const { token, user } = response.data;

        // Par défaut, utiliser sessionStorage pour les inscriptions
        clearAllStorage();
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return response.data;
    };

    const logout = () => {
        clearAllStorage();
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
