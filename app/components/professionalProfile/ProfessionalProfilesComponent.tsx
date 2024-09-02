"use client";

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { getProfiles, createProfile, updateProfile, deleteProfile } from '../../utils/repositories/professionalProfileRepository';
import { ProfessionalProfile } from '../../utils/types/professionalProfileTypes';
import AvailabilityComponent from '../availability/AvailabilityComponent';

const ProfessionalProfilesComponent: React.FC = () => {
  const [profiles, setProfiles] = useState<ProfessionalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfile, setNewProfile] = useState({
    userId: '',
    skills: [''],
    rating: 0,
    biography: '',
    availability: [],
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const fetchedProfiles = await getProfiles();
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Error al obtener los perfiles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleCreate = async () => {
    if (newProfile.userId && newProfile.skills.length > 0 && newProfile.biography) {
      try {
        const profileToCreate: ProfessionalProfile = {
          ...newProfile,
          id: '',
          jobsDone: [],
          verifiedPremium: false,
          offeredServices: [],
        };
        const createdProfile = await createProfile(profileToCreate);
        if (createdProfile) {
          setProfiles([...profiles, createdProfile]);
        }
        setNewProfile({
          userId: '',
          skills: [''],
          rating: 0,
          biography: '',
          availability: [],
        });
        setShowCreateForm(false);
      } catch (error) {
        console.error("Error al crear el perfil:", error);
      }
    } else {
      console.error("Por favor, completa todos los campos requeridos.");
    }
  };

  const handleEdit = async (id: string) => {
    const updatedProfile = profiles.find(profile => profile.id === id);
    if (updatedProfile) {
      updatedProfile.rating = 5; // Ejemplo de actualización
      await updateProfile(id, updatedProfile);
      setProfiles(profiles.map(profile => (profile.id === id ? updatedProfile : profile)));
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProfile(id);
    setProfiles(profiles.filter(profile => profile.id !== id));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 rounded">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
        Perfiles Profesionales
      </h1>
      {showCreateForm ? (
        <Dialog open={showCreateForm} onClose={() => {}} className="fixed inset-0 z-10 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true"></div>
          <Dialog.Panel className="relative z-20 max-w-md w-full mx-auto bg-gray-800 p-6 rounded shadow-lg">
            <Dialog.Title as="h2" className="text-3xl font-bold text-white text-center mb-8 bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
              Crear Nuevo Perfil
            </Dialog.Title>
            <div className="flex flex-col space-y-6">
              <input
                type="text"
                placeholder="ID del Usuario"
                value={newProfile.userId}
                onChange={(e) => setNewProfile({ ...newProfile, userId: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white border border-gray-600"
              />
              <input
                type="text"
                placeholder="Habilidades"
                value={newProfile.skills.join(', ')}
                onChange={(e) => setNewProfile({ ...newProfile, skills: e.target.value.split(', ') })}
                className="p-3 rounded bg-gray-700 text-white border border-gray-600"
              />
              <textarea
                placeholder="Biografía"
                value={newProfile.biography}
                onChange={(e) => setNewProfile({ ...newProfile, biography: e.target.value })}
                className="p-3 rounded bg-gray-700 text-white border border-gray-600"
              />
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleCreate}
                  className="w-full bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow"
                >
                  Crear Perfil
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="w-full bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow"
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
              className="bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow"
            >
              Nuevo Perfil
            </button>
          </div>
          <div className="overflow-x-auto rounded-md">
            <table className="min-w-full bg-gray-800 shadow-md rounded-md">
              <thead>
                <tr className="bg-gray-700 text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Usuario</th>
                  <th className="py-3 px-6 text-left">Habilidades</th>
                  <th className="py-3 px-6 text-left">Calificación</th>
                  <th className="py-3 px-6 text-left">Biografía</th>
                  <th className="py-3 px-6 text-left">Disponibilidad</th>
                  <th className="py-3 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm font-light">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Cargando perfiles...
                    </td>
                  </tr>
                ) : profiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No hay perfiles profesionales disponibles en este momento.
                    </td>
                  </tr>
                ) : (
                  profiles.map((profile) => (
                    <tr key={profile.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{profile.userId}</td>
                      <td className="py-3 px-6 text-left">{profile.skills.join(', ')}</td>
                      <td className="py-3 px-6 text-left">{profile.rating}</td>
                      <td className="py-3 px-6 text-left">{profile.biography}</td>
                      <td className="py-3 px-6 text-left">
                        <AvailabilityComponent professionalId={profile.id} />
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button onClick={() => handleEdit(profile.id)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded mr-2 shadow">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(profile.id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded shadow">
                          Borrar
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

export default ProfessionalProfilesComponent;
