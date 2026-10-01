import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'ROLE_DIRECTOR' | 'ROLE_HOD' | 'ROLE_FACULTY' | 'ROLE_STUDENT' | 'ROLE_EXAM_ADMIN' | 'ROLE_FINANCE' | 'ROLE_LIBRARIAN' | 'ROLE_REGISTRAR' | 'ROLE_ADMISSION_CELL';

interface User {
    id: number;
    email: string;
    roles: Role[];
    accessToken: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check local storage on initial load
        const storedUser = localStorage.getItem('isim_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('isim_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('isim_user');
    };

    const hasRole = (role: Role) => {
        return user?.roles.includes(role) || false;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasRole }}>
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
