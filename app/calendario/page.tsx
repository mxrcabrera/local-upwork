"use client"

import React from 'react';
import { Dayjs } from 'dayjs';
import Calendar from '../components/calendar/CalendarComponent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function CalendarPage() {
  const handleDateChange = (date: Dayjs | null) => {
    // Manejar el cambio de fecha acá
    console.log("Fecha seleccionada:", date);
  };

  return (
    <div>
      <h1>Reserva tu turno</h1>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Calendar 
          clientId="632a1323-fa84-4804-8db4-6e939982c44e" 
          professionalId="d62792f6-cc58-4685-b331-b211d9a2ed0f"
          onChange={handleDateChange}
        />
      </LocalizationProvider>
    </div>
  );
}