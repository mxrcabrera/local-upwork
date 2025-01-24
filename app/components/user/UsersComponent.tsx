"use client";

import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../utils/repositories/userRepository';
import { UserType } from '../../utils/types/enums';
import { User } from '../../utils/types/userTypes';
import { Timestamp } from 'firebase/firestore';
import { Dialog } from '@headlessui/react';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    userType: '',
    location: '',
    registerDate: Timestamp.fromDate(new Date()),
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    if (newUser.name && newUser.email && newUser.userType) {
      try {
        const userToCreate: User = {
          ...newUser,
          userType: newUser.userType as UserType,
          lastLoginDate: Timestamp.fromDate(new Date()),
          registerDate: Timestamp.fromDate(new Date()),
          id: '', // Generate or set an ID accordingly
        };
        await createUser(userToCreate);
        setUsers([...users, userToCreate]);
        setNewUser({
          name: '',
          email: '',
          userType: '' as UserType,
          location: '',
          registerDate: Timestamp.fromDate(new Date()),
        });
        setShowCreateForm(false);
      } catch (error) {
        console.error("Error al crear el usuario:", error);
      }
    } else {
      console.error("Por favor, completa todos los campos requeridos.");
    }
  };

  const handleEdit = async (id: string) => {
    const updatedUser = users.find(user => user.id === id);
    if (updatedUser) {
      updatedUser.name = "Nombre Actualizado"; // Update example
      await updateUser(id, updatedUser); // Implement update function
      setUsers(users.map(user => (user.id === id ? updatedUser : user)));
    }
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id); // Implement delete function
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 rounded">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-violet-500 to-green-400 bg-clip-text text-transparent">
        Usuarios
      </h1>
      {showCreateForm ? (
        <Dialog open={showCreateForm} onClose={() => {}} className="fixed inset-0 z-10 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true"></div>
          <Dialog.Panel className="relative z-20 max-w-md w-full mx-auto bg-gray-800 p-6 rounded shadow-lg">
            <Dialog.Title as="h2" className="text-3xl font-bold text-white text-center mb-8 bg-gradient-to-r from-violet-500 to-green-400 bg-clip-text text-transparent">
              Crear Nuevo Usuario
            </Dialog.Title>
            <div className="flex flex-col space-y-6">
              <input
                type="text"
                placeholder="Nombre del Usuario"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white border border-gray-600"
              />
              <input
                type="email"
                placeholder="Email del Usuario"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white border border-gray-600"
              />
              <input
                type="text"
                placeholder="Tipo de Usuario"
                value={newUser.userType}
                onChange={(e) => setNewUser({ ...newUser, userType: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white border border-gray-600"
              />
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleCreate}
                  className="w-full bg-gradient-to-r from-violet-400 to-green-300 hover:from-violet-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow"
                >
                  Crear Usuario
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="w-full bg-gradient-to-r from-violet-400 to-green-300 hover:from-violet-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow"
                >
                  Volver
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      ) : (
        <div>
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setShowCreateForm(true)} 
              className="bg-gradient-to-r from-violet-400 to-green-300 hover:from-violet-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow"
            >
              Nuevo Usuario
            </button>
          </div>
          <div className="overflow-x-auto rounded-md">
            <table className="min-w-full bg-gray-800 shadow-md rounded-md">
              <thead>
                <tr className="bg-gray-700 text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Nombre</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Tipo</th>
                  <th className="py-3 px-6 text-left">Fecha de Registro</th>
                  <th className="py-3 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm font-light">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No hay usuarios disponibles en este momento.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{user.name}</td>
                      <td className="py-3 px-6 text-left">{user.email}</td>
                      <td className="py-3 px-6 text-left">{user.userType}</td>
                      <td className="py-3 px-6 text-left">
                        {user.registerDate instanceof Timestamp
                          ? user.registerDate.toDate().toLocaleDateString()
                          : new Date(user.registerDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button onClick={() => handleEdit(user.id)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded mr-2 shadow">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded shadow">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;