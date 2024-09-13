"use client";

import React, { useEffect, useState } from 'react';
import AvailabilityComponent from '../components/availability/AvailabilityComponent';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { fetchUserProfile, onAuthStateChanged } from '../libs/firebase/auth'; // Importa la función correcta
import { Dayjs } from 'dayjs';

const DisponibilidadPage: React.FC = () => {
  const [clientId, setClientId] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const { clientId, professionalId } = await fetchUserProfile(user.uid);
          setClientId(clientId);
          setProfessionalId(professionalId);
        } catch (error) {
          console.error("Error fetching user profiles:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDateChange = (date: Dayjs | null) => {
    console.log("Fecha seleccionada:", date);
  };

  // Muestra un mensaje de carga mientras se obtienen los IDs
  if (clientId === null && professionalId === null) {
    return <div>Cargando...</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="p-6 min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto">
          <AvailabilityComponent
            onChange={handleDateChange}
            clientId={clientId || ''}
            professionalId={professionalId || ''}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default DisponibilidadPage;