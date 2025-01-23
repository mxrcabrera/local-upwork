"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '@/app/utils/types';

// Define el tipo del contexto
interface UserContextType {
    user: User | null;
    loading: boolean;
    error: Error | null;
    setUser: (user: User | null) => void;
}

// Crea el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
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
        // Aquí puedes añadir lógica para mantener el usuario actualizado
        // Por ejemplo, suscribirte a cambios de autenticación TODO
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