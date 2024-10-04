"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Dayjs } from 'dayjs';
import BookingCalendarComponent from '../../../components/calendar/BookingCalendarComponent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { onAuthStateChanged, fetchUserProfile } from '../../../libs/firebase/auth';

const BookingPage: React.FC = () => {
  const { serviceId } = useParams();
  const [clientId, setClientId] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        setClientId(profile.clientId);
        setProfessionalId(profile.professionalId);
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
        <BookingCalendarComponent 
          clientId={clientId || ''} 
          professionalId={professionalId || ''}
          serviceId={serviceId as string}
          onChange={handleDateChange}
          onTimeSelect={() => {}}
        />
      </LocalizationProvider>
    </div>
  );
}

export default BookingPage;