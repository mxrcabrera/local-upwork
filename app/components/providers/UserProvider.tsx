"use client";

import { createContext, useContext, ReactNode } from 'react';

// Define the shape of the session context
interface UserContextType {
    session: string | null;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}

export default function UserProvider({ children, session }: { children: ReactNode, session: any }) {
    return (
        <UserContext.Provider value={{ session }}>
            {children}
        </UserContext.Provider>
    );
}
