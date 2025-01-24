'use client'

import { ThemeProvider } from "./ThemeProvider";
import SessionProvider from "./SessionProvider";
import UserProvider from "./UserProvider";
import React from "react";

export default function Providers({ children, session, initialTheme, initialUser }: any) {
  return (
    <SessionProvider session={session}>
      <UserProvider initialUser={initialUser}>
        <ThemeProvider initialTheme={initialTheme}>
          {children}
        </ThemeProvider>
      </UserProvider>
    </SessionProvider>
  );
}