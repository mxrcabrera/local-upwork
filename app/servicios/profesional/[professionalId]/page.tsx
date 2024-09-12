"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Typography, Grid } from '@mui/material';
import { getProfessionalServicesList } from '../../../utils/repositories/serviceRepository';
import { getProfessionalById } from '../../../utils/repositories/userRepository';
import { Service } from '../../../utils/types/serviceTypes';
import { User } from '../../../utils/types/userTypes';
import ServicesProfessionalComponent from '../../../components/service/ServicesProfessionalComponent';

const UserServicesPage: React.FC = () => {
  const { professionalId } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [professional, setProfessional] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionalAndServices = async () => {
      if (professionalId) {
        try {
          setLoading(true);
          const professionalProfile = await getProfessionalById(professionalId as string);
          setProfessional(professionalProfile);

          if (professionalProfile) {
            const fetchedServices = await getProfessionalServicesList(professionalId as string);
            setServices(fetchedServices);
          }
        } catch (error) {
          console.error("Error fetching professional profile or services:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfessionalAndServices();
  }, [professionalId]);

  if (loading) {
    return (
      <Typography variant="h6" color="textSecondary" align="center">
        Cargando servicios del profesional...
      </Typography>
    );
  }

  if (!professional) {
    return (
      <Typography variant="h6" color="textSecondary" align="center">
        No se encontró un profesional con este ID o el usuario no es un profesional.
      </Typography>
    );
  }

  const displayName = professional.name || professional.email || "Usuario Desconocido";

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-900 rounded">
      <Typography variant="h4" className="text-3xl font-bold text-center bg-gradient-to-r from-violet-500 to-green-400 bg-clip-text text-transparent mb-12">
        Servicios de {displayName}
      </Typography>
      <Grid container spacing={3}>
        {services.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center">
            Este profesional no tiene servicios disponibles.
          </Typography>
        ) : (
          <ServicesProfessionalComponent
            services={services}
            professionalId={professionalId as string}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        )}
      </Grid>
    </div>
  );
};

export default UserServicesPage;