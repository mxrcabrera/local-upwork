"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Cambiado a next/navigation
import { Dayjs } from 'dayjs';
import Calendar from '../components/calendar/CalendarComponent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { UserType } from '@/app/utils/types/enums';
import { onAuthStateChanged, fetchUserProfile } from '../libs/firebase/auth';

const CalendarPage: React.FC = () => {
  const { serviceId } = useParams(); // Obtener serviceId de la URL
  const [userType, setUserType] = useState<UserType | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        setClientId(profile.clientId);
        setProfessionalId(profile.professionalId);

        if (profile.professionalId) {
          setUserType(UserType.PROFESSIONAL);
        } else if (profile.clientId) {
          setUserType(UserType.CLIENT);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDateChange = (date: Dayjs | null) => {
    console.log("Fecha seleccionada:", date);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Reserva tu turno</h1>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Calendar 
          clientId={clientId || ''} 
          professionalId={professionalId || ''}
          serviceId={serviceId as string} // Asegúrate de que serviceId sea una cadena
          onChange={handleDateChange}
          userType={userType!} // Pass the userType to the CalendarComponent
        />
      </LocalizationProvider>
    </div>
  );
}

export default CalendarPage;