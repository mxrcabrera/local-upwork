'use client'

import { ThemeProvider } from "./ThemeProvider";
import SessionProvider from "./SessionProvider"
import React from "react";

export default function Providers({ children, session, initialTheme }: any) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider initialTheme={initialTheme}>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}