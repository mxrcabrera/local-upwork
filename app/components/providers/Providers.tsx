'use client'
import UserProvider from "./UserProvider"
import React from "react";

export default function Providers({ children, session }: any) {
  return (
    <UserProvider session={session}>
      {children}
    </UserProvider>
  );
}