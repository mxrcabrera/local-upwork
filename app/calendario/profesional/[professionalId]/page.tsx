"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CalendarProfessional from '../../../components/calendar/CalendarProfessionalComponent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

const CalendarProfessionalPage: React.FC = () => {
  const { professionalId } = useParams();
  const professionalIdString = Array.isArray(professionalId) ? professionalId[0] : professionalId || '';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí puedes cargar datos adicionales si es necesario
    setLoading(false);
  }, [professionalIdString]);

  const handleDateChange = (date: Dayjs | null) => {
    console.log("Fecha seleccionada:", date);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Gestiona tu calendario</h1>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CalendarProfessional 
          professionalId={professionalIdString}
          serviceId="" // Asigna el serviceId si es necesario
          onChange={handleDateChange}
          onTimeSelect={() => {}}
        />
      </LocalizationProvider>
    </div>
  );
}

export default CalendarProfessionalPage;