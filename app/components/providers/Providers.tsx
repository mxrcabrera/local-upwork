'use client'

import { ThemeProvider } from "./ThemeProvider";
import UserProvider from "./UserProvider"
import React from "react";

export default function Providers({ children, session, initialTheme}: any) {
  return (
    <UserProvider session={session}>
      <ThemeProvider initialTheme={initialTheme}>
        {children}
      </ThemeProvider>
    </UserProvider>
  );
}