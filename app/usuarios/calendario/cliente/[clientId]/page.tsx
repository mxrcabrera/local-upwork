"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CalendarClient from '../../../../components/calendar/CalendarClientComponent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { fetchUserProfile } from '../../../../libs/firebase/auth';
import { Dayjs } from 'dayjs';

const CalendarClientPage: React.FC = () => {
  const { clientId } = useParams();
  const clientIdString = Array.isArray(clientId) ? clientId[0] : clientId || '';
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (clientIdString) {
        const profile = await fetchUserProfile(clientIdString);
        setProfessionalId(profile.professionalId);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [clientIdString]);

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
        <CalendarClient 
          clientId={clientIdString} 
          professionalId={professionalId || ''}
          serviceId="" // Asigna el serviceId si es necesario
          onChange={handleDateChange}
          onTimeSelect={() => {}}
        />
      </LocalizationProvider>
    </div>
  );
}

export default CalendarClientPage;