"use client";

import { createContext, useContext, ReactNode } from 'react';

// Define the shape of the session context
interface UserContextType {
    session: string | null;
}

// Create the context with a default value
const SessionContext = createContext<UserContextType | undefined>(undefined);

export function useSessionContext() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSessionContext must be used within a SessionProvider');
    }
    return context;
}

export default function SessionProvider({ children, session }: { children: ReactNode, session: any }) {
    return (
        <SessionContext.Provider value={{ session }}>
            {children}
        </SessionContext.Provider>
    );
}
