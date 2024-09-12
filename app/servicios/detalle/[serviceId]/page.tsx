"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Typography, Card, CardContent, Button, Grid, Chip, Divider } from '@mui/material';
import { getServiceByID } from '../../../utils/repositories/serviceRepository';
import { Service, Review } from '../../../utils/types/serviceTypes';

const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    if (serviceId) {
      const fetchService = async () => {
        try {
          const fetchedService = await getServiceByID(serviceId as string);
          setService(fetchedService);
        } catch (error) {
          console.error("Error fetching service:", error);
        }
      };
      fetchService();
    }
  }, [serviceId]);

  if (!service) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography variant="h6" color="textSecondary">
          Cargando servicio...
        </Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-900 rounded-lg shadow-lg">
      <Card className="bg-[#424242] text-white p-6 rounded-lg">
        <CardContent>
          <Typography variant="h4" component="div" className="text-center mb-6 font-bold">
            {service.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" className="mb-6">
            {service.description}
          </Typography>
          <Divider className="my-4" />
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" className="font-bold">Categoría:</Typography>
              <Typography variant="body1">{service.category}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" className="font-bold">Modalidad de Ubicación:</Typography>
              <Typography variant="body1">{service.serviceLocationModality}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" className="font-bold">Método de Pago:</Typography>
              <Typography variant="body1">{service.paymentMethod}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" className="font-bold">Tipo de Precio:</Typography>
              <Typography variant="body1">{service.priceType}</Typography>
            </Grid>
            {service.requiredInformation && (
              <Grid item xs={12}>
                <Typography variant="h6" className="font-bold">Información Requerida:</Typography>
                <Typography variant="body1">{service.requiredInformation}</Typography>
              </Grid>
            )}
          </Grid>
          <Divider className="my-4" />
          <Typography variant="h5" className="font-bold mb-4">Reseñas:</Typography>
          {service.reviews.length > 0 ? (
            service.reviews.map((review: Review) => (
              <Card key={review.id} className="mb-4 bg-gray-800 p-4 rounded-lg">
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {review.comment}
                  </Typography>
                  <Chip label={`Calificación: ${review.calification}`} className="mt-2" />
                  <Typography variant="caption" color="textSecondary" className="block mt-1">
                    {review.date.toDate().toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No hay reseñas disponibles.
            </Typography>
          )}
        </CardContent>
        <div className="flex justify-center mt-6 space-x-4">
          <Button
            onClick={() => console.log('Ver Disponibilidad')}
            className="bg-gradient-to-r from-blue-400 to-teal-300 hover:from-blue-500 hover:to-teal-400 text-violet-950 font-semibold py-2 px-6 rounded shadow"
          >
            Ver Disponibilidad
          </Button>
          <Button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-violet-400 to-green-300 hover:from-violet-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-6 rounded shadow"
          >
            Volver
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ServiceDetailPage;