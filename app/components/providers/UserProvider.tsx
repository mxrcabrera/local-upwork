"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '@/app/utils/types';

interface UserContextType {
    user: User | null;
    loading: boolean;
    error: Error | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe ser usado dentro de un UserProvider');
    }
    return context;
}

interface UserProviderProps {
    children: ReactNode;
    initialUser?: User | null;
}

export default function UserProvider({ children, initialUser }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(initialUser || null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
            // Here you can add logic to keep the user updated
            // For example, subscribe to authentication changes TODO
    }, []);


    const value = {
        user,
        loading,
        error,
        setUser
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}