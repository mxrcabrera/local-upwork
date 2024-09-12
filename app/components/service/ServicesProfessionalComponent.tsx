"use client";

import React from 'react';
import Link from 'next/link';
import { Grid, Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { Service } from '../../utils/types/serviceTypes';

interface ServicesProfessionalProps {
  services: Service[];
  professionalId: string;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

const ServicesProfessionalComponent: React.FC<ServicesProfessionalProps> = ({ services, onEdit, onDelete }) => {
  return (
    <Grid container spacing={3}>
      {services.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center">
          No tienes servicios asociados.
        </Typography>
      ) : (
        services.map((service: Service) => (
          <Grid item xs={12} sm={6} md={5} key={service.id}>
            <Card className="bg-gray-800 text-white h-full">
              <CardContent className="pb-2">
                <Typography variant="h5" component="div" gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {service.description}
                </Typography>
              </CardContent>
              <CardActions className="justify-end">
                <Link href={`/servicios/editar/${service.id}`} passHref>
                  <Button size="small" color="primary">
                    Editar
                  </Button>
                </Link>
                <Button size="small" color="secondary" onClick={() => onDelete(service.id)}>
                  Borrar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default ServicesProfessionalComponent;