// export default function Tablero() {
//     return (
//         <div>
//             tablero
//         </div>
//     )
// }

import React from 'react';
import UsersComponent from '../../components/user/UsersComponent';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración de Usuarios</h1>
      <UsersComponent />
    </div>
  );
};

export default AdminPage;