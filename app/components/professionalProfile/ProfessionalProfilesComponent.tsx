"use client";

import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import { getProfiles, createProfile, updateProfile, deleteProfile } from '../../utils/repositories/professionalProfileRepository';
import { ProfessionalProfile } from '../../utils/types/professionalProfileTypes';
import { useEntityState } from '../../utils/hooks/useEntityState';
import EntityForm from '../forms/EntityForm';
import AvailabilityComponent from '../availability/AvailabilityComponent'; // Asegúrate de que la ruta sea correcta
import { v4 as uuidv4 } from 'uuid';

const ProfessionalProfilesComponent: React.FC = () => {
  const [state, dispatch] = useEntityState<ProfessionalProfile>();

  const fetchProfiles = async () => {
    try {
      const fetchedProfiles = await getProfiles();
      dispatch({ type: 'SET_ENTITIES', payload: fetchedProfiles });
    } catch (error) {
      console.error("Error al obtener los perfiles:", error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [dispatch]);

  const handleSubmit = async (data: Omit<ProfessionalProfile, 'id'>) => {
    try {
      if (state.showCreateForm) {
        const newProfile = { ...data, id: uuidv4() };
        const createdProfile = await createProfile(newProfile);
        if (createdProfile) {
          await fetchProfiles();
        } else {
          console.error("Error: No se pudo crear el perfil.");
        }
      } else if (state.showEditForm && state.currentEntity) {
        const updatedProfile = { ...data, id: state.currentEntity.id };
        const success = await updateProfile(state.currentEntity.id, updatedProfile);
        if (success) {
          await fetchProfiles();
        } else {
          console.error("Error: No se pudo actualizar el perfil.");
        }
      }
      dispatch({ type: 'SHOW_CREATE_FORM', payload: false });
      dispatch({ type: 'SHOW_EDIT_FORM', payload: false });
    } catch (error) {
      console.error("Error al procesar el perfil:", error);
    }
  };

  const handleCreate = () => {
    dispatch({ type: 'SHOW_CREATE_FORM', payload: true });
    dispatch({ type: 'SET_CURRENT_ENTITY', payload: null });
  };

  const handleEdit = (profile: ProfessionalProfile) => {
    dispatch({ type: 'SET_CURRENT_ENTITY', payload: profile });
    dispatch({ type: 'SHOW_EDIT_FORM', payload: true });
  };

  const handleDelete = async () => {
    if (state.entityToDelete) {
      const success = await deleteProfile(state.entityToDelete);
      if (success) {
        dispatch({
          type: 'SET_ENTITIES',
          payload: state.entities.filter(entity => entity.id !== state.entityToDelete),
        });
      }
      dispatch({ type: 'SET_ENTITY_TO_DELETE', payload: null });
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 rounded">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
        Perfiles Profesionales
      </h1>
      <div className="flex justify-end mb-6">
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow"
        >
          Nuevo Perfil
        </Button>
      </div>
      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full bg-gray-800 shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-700 text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Usuario ID</th>
              <th className="py-3 px-6 text-left">Habilidades</th>
              <th className="py-3 px-6 text-left">Calificación</th>
              <th className="py-3 px-6 text-left">Biografía</th>
              <th className="py-3 px-6 text-left">Disponibilidad</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-300 text-sm font-light">
            {state.loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Cargando perfiles...
                </td>
              </tr>
            ) : state.entities.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No hay perfiles profesionales disponibles en este momento.
                </td>
              </tr>
            ) : (
              state.entities.map((profile: ProfessionalProfile) => (
                <tr key={profile.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{profile.userId}</td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">{profile.skills.join(', ')}</td>
                  <td className="py-3 px-6 text-left">{profile.rating}</td>
                  <td className="py-3 px-6 text-left">{profile.biography}</td>
                  <td className="py-3 px-6 text-left">
                  <Button onClick={() => window.location.href = '../disponibilidad'} className="text-blue-500 hover:text-blue-600">
                    Ver Disponibilidad
                  </Button>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <Button onClick={() => handleEdit(profile)} className="text-blue-500 hover:text-blue-600 mr-2">Editar</Button>
                    <Button
                      onClick={() => dispatch({ type: 'SET_ENTITY_TO_DELETE', payload: profile.id })}
                      className="text-red-500 hover:text-red-600"
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Dialog
        open={state.showCreateForm || state.showEditForm}
        onClose={() => {
          dispatch({ type: 'SHOW_CREATE_FORM', payload: false });
          dispatch({ type: 'SHOW_EDIT_FORM', payload: false });
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{state.showCreateForm ? 'Crear Nuevo Perfil' : 'Editar Perfil'}</DialogTitle>
        <DialogContent>
          <EntityForm
            defaultValues={state.currentEntity || { userId: '', skills: [], rating: '', jobsDone: [], verifiedPremium: false, offeredServices: [], biography: '', availability: [] }}
            onSubmit={handleSubmit}
            onCancel={() => {
              dispatch({ type: 'SHOW_CREATE_FORM', payload: false });
              dispatch({ type: 'SHOW_EDIT_FORM', payload: false });
            }}
            fields={[
              { name: 'userId', label: 'Usuario ID', type: 'text' },
              { name: 'skills', label: 'Habilidades', type: 'text' },
              { name: 'rating', label: 'Calificación', type: 'number' },
              { name: 'biography', label: 'Biografía', type: 'textarea' },
              { name: 'verifiedPremium', label: 'Premium Verificado', type: 'checkbox' },
              { name: 'jobsDone', label: 'Trabajos Realizados', type: 'text' },
              { name: 'offeredServices', label: 'Servicios Ofrecidos', type: 'text' }
            ]}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(state.entityToDelete)}
        onClose={() => dispatch({ type: 'SET_ENTITY_TO_DELETE', payload: null })}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar este perfil?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch({ type: 'SET_ENTITY_TO_DELETE', payload: null })} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfessionalProfilesComponent;