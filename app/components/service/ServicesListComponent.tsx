"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { getServicesList } from '../../utils/repositories/serviceRepository';
import { Service } from '../../utils/types/serviceTypes';
import { useEntityState } from '../../utils/hooks/useEntityState';

const ServicesListComponent: React.FC = () => {
  const [state, dispatch] = useEntityState<Service>();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await getServicesList();
        const sortedServices = services.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
        dispatch({ type: 'SET_ENTITIES', payload: sortedServices });
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchServices();
  }, [dispatch]);

  return (
    <div className="p-6 min-h-screen bg-gray-900 rounded">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-violet-500 to-green-400 bg-clip-text text-transparent">
        Servicios
      </h1>
      <Grid container spacing={4}>
        {state.loading ? (
          <Typography variant="h6" color="textSecondary" align="center" className="w-full mt-8">
            Cargando servicios...
          </Typography>
        ) : state.entities.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center" className="w-full mt-8">
            No hay servicios disponibles en este momento.
          </Typography>
        ) : (
          state.entities.map((service: Service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card className="bg-[#2A2A2A] text-white h-64 flex flex-col justify-between rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
                <CardContent className="flex-grow p-5">
                  <Typography variant="h5" component="div" className="font-semibold mb-3">
                    {service.title}
                  </Typography>
                  <Typography variant="body2" className="text-gray-300 line-clamp-3 max-w-[90%]">
                    {service.description}
                  </Typography>
                </CardContent>
                <div className="px-5 pb-5">
                  <Link href={`/servicios/detalle/${service.id}`} passHref>
                    <Button
                      variant="contained"
                      className="w-full bg-gradient-to-r from-violet-500 to-green-400 hover:from-violet-600 hover:to-green-500 text-violet-950 font-semibold py-2 px-4 rounded shadow-md transition-colors duration-300"
                    >
                      Ver más
                    </Button>
                  </Link>
                </div>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default ServicesListComponent;