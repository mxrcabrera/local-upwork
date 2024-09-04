"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { getServices, createService, updateService, deleteService } from '../../utils/repositories/serviceRepository';
import { Service } from '../../utils/types/serviceTypes';
import { PaymentMethod, PriceType, ServiceLocationModality } from '../../utils/types/enums';
import { useEntityState } from '../../utils/hooks/useEntityState';
import EntityForm from '../forms/EntityForm';
import { fetchUserProfileType } from '../../libs/firebase/auth';

const ServicesListComponent: React.FC = () => {
  const [state, dispatch] = useEntityState<Service>();
  const [professionalId, setProfessionalId] = useState<string | null>(null);

  useEffect(() => {
    // Obtener el professionalId al montar el componente
    fetchUserProfileType().then(({ professionalId }) => {
      setProfessionalId(professionalId);
    }).catch(error => {
      console.error("Error fetching professional ID:", error);
    });
  }, []);

  const fetchServices = async () => {
    try {
      const fetchedServices = await getServices();
      const sortedServices = fetchedServices.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
      dispatch({ type: 'SET_ENTITIES', payload: sortedServices });
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    fetchServices();
  }, [dispatch]);

  const handleSubmit = async (data: Omit<Service, 'id' | 'professionalId'>) => {
    if (!professionalId) {
      console.error("No se encontró el ID del profesional.");
      return;
    }
  
    try {
      const serviceData = { ...data, professionalId }; // Asociar el professionalId automáticamente
  
      if (state.showCreateForm) {
        const createdService = await createService(serviceData); // Llamar sin 'id'
        if (createdService) {
          await fetchServices();
        } else {
          console.error("Error: No se pudo crear el servicio.");
        }
      } else if (state.showEditForm && state.currentEntity) {
        const success = await updateService(state.currentEntity.id, serviceData);
        if (success) {
          await fetchServices();
        } else {
          console.error("Error: No se pudo actualizar el servicio.");
        }
      }
      dispatch({ type: 'SHOW_CREATE_FORM', payload: false });
      dispatch({ type: 'SHOW_EDIT_FORM', payload: false });
    } catch (error) {
      console.error("Error al procesar el servicio:", error);
    }
  };

  const handleCreate = () => {
    dispatch({ type: 'SHOW_CREATE_FORM', payload: true });
    dispatch({ type: 'SET_CURRENT_ENTITY', payload: null });
  };

  const handleEdit = (service: Service) => {
    dispatch({ type: 'SET_CURRENT_ENTITY', payload: service });
    dispatch({ type: 'SHOW_EDIT_FORM', payload: true });
  };

  const handleDelete = async () => {
    if (state.entityToDelete) {
      await deleteService(state.entityToDelete);
      dispatch({
        type: 'SET_ENTITIES',
        payload: state.entities.filter(entity => entity.id !== state.entityToDelete),
      });
      dispatch({ type: 'SET_ENTITY_TO_DELETE', payload: null });
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 rounded">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
        Servicios
      </h1>
      <div className="flex justify-end mb-6">
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow"
        >
          Nuevo Servicio
        </Button>
      </div>
      <Grid container spacing={3}>
        {state.loading ? (
          <Typography variant="h6" color="textSecondary" align="center">
            Cargando servicios...
          </Typography>
        ) : state.entities.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center">
            No hay servicios disponibles en este momento.
          </Typography>
        ) : (
          state.entities.map((service: Service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card sx={{ backgroundColor: '#424242', color: '#fff', height: 200 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {service.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleEdit(service)}>
                    Editar
                  </Button>
                  <Button size="small" color="secondary" onClick={() => dispatch({ type: 'SET_ENTITY_TO_DELETE', payload: service.id })}>
                    Borrar
                  </Button>
                </CardActions>
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
            <p className="mt-8">{state.showCreateForm ? 'Crear Servicio' : 'Editar Servicio'}</p>
          </div>
        </DialogTitle>
        <DialogContent className="bg-gray-800">
          <EntityForm
            defaultValues={state.currentEntity || {
              id: '',
              title: '',
              description: '',
              paymentMethod: '',
              priceType: '',
              paymentType: '',
              professionalId: '',
              category: '',
              requiredInformation: '',
              serviceLocationModality: '',
              portfolio: [],
              reviews: []
            }}
            onSubmit={handleSubmit}
            onCancel={() => {
              dispatch({ type: 'SHOW_CREATE_FORM', payload: false });
              dispatch({ type: 'SHOW_EDIT_FORM', payload: false });
            }}
            fields={[
              { name: 'title', label: 'Título del Servicio', type: 'text' },
              { name: 'description', label: 'Descripción del Servicio', type: 'text' },
              { name: 'paymentMethod', label: 'Método de Pago', type: 'select', options: [
                { value: PaymentMethod.PER_HOUR, label: 'Por Hora' },
                { value: PaymentMethod.PER_PROJECT, label: 'Por Proyecto' }
              ]},
              { name: 'priceType', label: 'Tipo de Precio', type: 'select', options: [
                { value: PriceType.FIXED, label: 'Fijo' },
                { value: PriceType.RANGE, label: 'Rango' },
                { value: PriceType.TO_BE_DEFINED, label: 'A Definir' }
              ]},
              { name: 'serviceLocationModality', label: 'Modalidad de Servicio', type: 'select', options: [
                { value: ServiceLocationModality.HOME_DELIVERY, label: 'A Domicilio' },
                { value: ServiceLocationModality.REMOTE, label: 'Remoto' },
                { value: ServiceLocationModality.PHYSICAL_COMMERCE, label: 'Comercio Físico' }
              ]},
              { name: 'category', label: 'Categoría', type: 'text' },
            ]}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={!!state.entityToDelete} onClose={() => dispatch({ type: 'SET_ENTITY_TO_DELETE', payload: null })}>
        <DialogTitle className="text-white">Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography className="text-white">
            ¿Estás seguro de que deseas eliminar este servicio?
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

export default ServicesListComponent;