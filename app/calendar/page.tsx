"use client"

import React from 'react';
import Calendar from '../components/calendar/CalendarComponent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function CalendarPage() {
  return (
    <div>
      <h1>Reserva tu turno</h1>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Calendar clientId="632a1323-fa84-4804-8db4-6e939982c44e" professionalId="6680273f-f044-400a-9837-1525e7a491c8" />
      </LocalizationProvider>
    </div>
  );
}
