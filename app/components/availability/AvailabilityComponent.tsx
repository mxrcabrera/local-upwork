"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Grid, Card, CardContent, CardActions, TextField } from '@mui/material';
import { getAvailability, createAvailability, updateAvailability, deleteAvailability } from '../../utils/repositories/availabilityRepository';
import { getServicesList } from '../../utils/repositories/serviceRepository';
import { Availability, Shift } from '../../utils/types/availabilityTypes';
import { Service } from '@/app/utils/types/serviceTypes';
import { useEntityState } from '../../utils/hooks/useEntityState';
import EntityForm from '../forms/EntityForm';
import CalendarComponent from '../calendar/CalendarComponent';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';
import dayjs, { Dayjs } from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers';
import { onAuthStateChanged, fetchUserProfile } from '../../libs/firebase/auth';
import { UserType } from '@/app/utils/types/enums';
import { User } from '@/app/utils/types/userTypes';

interface AvailabilityComponentProps {
  onChange: (date: Dayjs | null) => void;
  clientId: string;
  professionalId: string;
}

const AvailabilityComponent: React.FC<AvailabilityComponentProps> = ({ onChange, clientId, professionalId }) => {
  const [state, dispatch] = useEntityState<Availability>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const { clientId, professionalId } = await fetchUserProfile(user.uid);
  
        if (professionalId) {
          setUserType(UserType.PROFESSIONAL);
        } else if (clientId) {
          setUserType(UserType.CLIENT);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated && professionalId) {
      fetchAvailability(professionalId);
      fetchServices();
    }
  }, [dispatch, isAuthenticated, professionalId]);

  const fetchAvailability = async (professionalId: string) => {
    try {
      const fetchedAvailability = await getAvailability(professionalId);
      dispatch({ type: 'SET_ENTITIES', payload: fetchedAvailability });
    } catch (error) {
      console.error("Error al obtener disponibilidad:", error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchServices = async () => {
    try {
      const fetchedServices = await getServicesList();
      setServices(fetchedServices);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
    }
  };

  const handleSubmit = async (data: Omit<Availability, 'id'>) => {
    if (!professionalId) {
      console.error("No se encontró el ID del profesional.");
      return;
    }

    try {
      const { day, shifts } = data;
      const formattedShifts = shifts.map(shift => ({
        ...shift,
        start: dayjs(shift.start).format('HH:mm'),
        end: dayjs(shift.end).format('HH:mm')
      }));

      const availabilityData: Availability = {
        id: uuidv4(),
        day: Timestamp.fromDate(day.toDate()),
        shifts: formattedShifts,
      };

      if (state.showCreateForm) {
        const createdAvailability = await createAvailability(availabilityData);
        if (createdAvailability) {
          await fetchAvailability(professionalId);
        } else {
          console.error("Error: No se pudo crear la disponibilidad.");
        }
      } else if (state.showEditForm && state.currentEntity) {
        const success = await updateAvailability(state.currentEntity.id, availabilityData);
        if (success) {
          await fetchAvailability(professionalId);
        } else {
          console.error("Error: No se pudo actualizar la disponibilidad.");
        }
      }
      dispatch({ type: 'SHOW_CREATE_FORM', payload: false });
      dispatch({ type: 'SHOW_EDIT_FORM', payload: false });
    } catch (error) {
      console.error("Error al procesar la disponibilidad:", error);
    }
  };

  const handleCreate = () => {
    dispatch({ type: 'SHOW_CREATE_FORM', payload: true });
    dispatch({ type: 'SET_CURRENT_ENTITY', payload: null });
  };

  const handleEdit = (availability: Availability) => {
    dispatch({ type: 'SET_CURRENT_ENTITY', payload: availability });
    dispatch({ type: 'SHOW_EDIT_FORM', payload: true });
  };

  const handleDelete = async () => {
    if (state.entityToDelete) {
      try {
        await deleteAvailability(state.entityToDelete);
        dispatch({
          type: 'SET_ENTITIES',
          payload: state.entities.filter(entity => entity.id !== state.entityToDelete),
        });
      } catch (error) {
        console.error("Error al eliminar la disponibilidad:", error);
      } finally {
        dispatch({ type: 'SET_ENTITY_TO_DELETE', payload: null });
      }
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date && state.currentEntity) {
      dispatch({
        type: 'SET_CURRENT_ENTITY',
        payload: { ...state.currentEntity, day: Timestamp.fromDate(date.toDate()) }
      });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <div>No estás autenticado. Por favor, inicia sesión.</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900 rounded">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
        Disponibilidad
      </h1>
      {userType === UserType.PROFESSIONAL && (
        <div className="flex justify-end mb-6">
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow"
          >
            Nuevo Turno
          </Button>
        </div>
      )}
      <Grid container spacing={3}>
        {state.loading ? (
          <Typography variant="h6" color="textSecondary" align="center">
            Cargando disponibilidad...
          </Typography>
        ) : state.entities.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center">
            No hay disponibilidad en este momento.
          </Typography>
        ) : (
          state.entities.map((availability: Availability) => (
            <Grid item xs={12} sm={6} md={4} key={availability.id}>
              <Card sx={{ backgroundColor: '#424242', color: '#fff', height: 200 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {availability.day.toDate().toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {availability.shifts.map((shift, idx) => (
                      <div key={idx}>
                        {shift.start} - {shift.end} ({shift.length} mins)
                      </div>
                    ))}
                  </Typography>
                </CardContent>
                {userType === UserType.PROFESSIONAL && (
                  <CardActions>
                    <Button size="small" color="primary" onClick={() => handleEdit(availability)}>
                      Editar
                    </Button>
                    <Button size="small" color="secondary" onClick={() => dispatch({ type: 'SET_ENTITY_TO_DELETE', payload: availability.id })}>
                      Borrar
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      <Dialog
        open={state.showCreateForm || state.showEditForm}
        onClose={() => {
          dispatch({ type: 'SHOW_CREATE_FORM', payload: false });
          dispatch({ type: 'SHOW_EDIT_FORM', payload: false });
        }}
        PaperProps={{
          style: {
            backgroundColor: '#1f1f1f',
            color: '#ffffff',
          },
        }}
      >
        <DialogTitle className="bg-gray-800">
          <div className="text-3xl font-bold text-center bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
            {state.showCreateForm ? 'Crear Turno' : 'Editar Turno'}
          </div>
        </DialogTitle>
        <DialogContent className="bg-gray-800">
          <EntityForm
            defaultValues={state.currentEntity || {
              day: Timestamp.fromDate(new Date()),
              shifts: [{
                id: uuidv4(),
                shiftId: uuidv4(),
                start: '',
                end: '',
                length: 0,
                serviceId: '',
                maxReservations: 0,
              }]
            }}
            onSubmit={handleSubmit}
            onCancel={() => {
              dispatch({ type: 'SHOW_CREATE_FORM', payload: false });
              dispatch({ type: 'SHOW_EDIT_FORM', payload: false });
            }}
            fields={[
              { name: 'day', label: 'Fecha', type: 'custom', component: <CalendarComponent 
                onChange={handleDateChange} 
                clientId={clientId}
                professionalId={professionalId}
                serviceId={state.currentEntity?.shifts[0]?.serviceId || ''}
                userType={userType!}
              /> },
              { name: 'shifts[0].start', label: 'Hora de Inicio', type: 'custom', component: (
                <TimePicker
                  label="Hora de Inicio"
                  value={state.currentEntity?.shifts[0]?.start ? dayjs(state.currentEntity.shifts[0].start, 'HH:mm') : null}
                  onChange={(newValue) => {
                    if (newValue && state.currentEntity) {
                      const updatedShifts = [...state.currentEntity.shifts];
                      updatedShifts[0].start = newValue.format('HH:mm');
                      dispatch({ type: 'SET_CURRENT_ENTITY', payload: { ...state.currentEntity, shifts: updatedShifts } });
                    }
                  }}
                  slots={{
                    textField: (params) => <TextField {...params} fullWidth />
                  }}
                />
              ) },
              { name: 'shifts[0].end', label: 'Hora de Fin', type: 'custom', component: (
                <TimePicker
                  label="Hora de Fin"
                  value={state.currentEntity?.shifts[0]?.end ? dayjs(state.currentEntity.shifts[0].end, 'HH:mm') : null}
                  onChange={(newValue) => {
                    if (newValue && state.currentEntity) {
                      const updatedShifts = [...state.currentEntity.shifts];
                      updatedShifts[0].end = newValue.format('HH:mm');
                      dispatch({ type: 'SET_CURRENT_ENTITY', payload: { ...state.currentEntity, shifts: updatedShifts } });
                    }
                  }}
                  slots={{
                    textField: (params) => <TextField {...params} fullWidth />
                  }}
                />
              ) 
            },
            { 
              name: 'shifts[0].length', 
              label: 'Duración (minutos)', 
              type: 'number', 
              component: <TextField 
                label="Duración (minutos)" 
                type="number" 
                InputProps={{ inputProps: { min: 0, max: 60 } }} 
                fullWidth 
              /> 
            },
            { 
              name: 'shifts[0].serviceId', 
              label: 'Servicio', 
              type: 'select', 
              options: services.map(service => ({ value: service.id, label: service.title })) 
            },
          ]}
        />
      </DialogContent>
      </Dialog>
      <Dialog open={!!state.entityToDelete} onClose={() => dispatch({ type: 'SET_ENTITY_TO_DELETE', payload: null })}>
        <DialogTitle className="text-white">Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography className="text-white">
            ¿Estás seguro de que deseas eliminar este turno?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
            Eliminar
          </Button>
          <Button onClick={() => dispatch({ type: 'SET_ENTITY_TO_DELETE', payload: null })} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AvailabilityComponent;