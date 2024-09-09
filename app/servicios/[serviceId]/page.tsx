"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Typography, Card, CardContent, Button } from '@mui/material';
import { getServiceByID } from '../../utils/repositories/serviceRepository';
import { Service } from '../../utils/types/serviceTypes';

const ServiceDetailPage: React.FC = () => {
  const router = useRouter();
  const { serviceId } = router.query;
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
    <div className="container mx-auto p-6 min-h-screen bg-gray-900 rounded">
      <Card sx={{ backgroundColor: '#424242', color: '#fff', padding: 3 }}>
        <CardContent>
          <Typography variant="h4" component="div" className="text-center mb-4">
            {service.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" className="mb-4">
            {service.description}
          </Typography>
        </CardContent>
        <Button
          onClick={() => router.back()}
          className="bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow"
        >
          Volver
        </Button>
      </Card>
    </div>
  );
};

export default ServiceDetailPage;