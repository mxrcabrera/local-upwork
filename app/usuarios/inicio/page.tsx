"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import UsersComponent from '../../components/user/UsersComponent';
import { useSessionContext } from '../../components/providers/SessionProvider';

const AdminPage: React.FC = () => {
  const { session } = useSessionContext();
  const router = useRouter();

  React.useEffect(() => {
    if (!session) {
      router.push('/ingresar');
    }
  }, [session, router]);

  if (!session) {
    return null; // TODO: define what to do if no session
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* // TODO: define what to show on index
      <h1 className="text-3xl font-bold mb-6">Panel de Administración de Usuarios</h1>
      <UsersComponent /> */}
    </div>
  );
};

export default AdminPage;