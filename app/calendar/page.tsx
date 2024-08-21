"use client"

import React from 'react';
import Calendar from '../components/calendar/Calendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function CalendarPage() {
  return (
    <div>
      <h1>Reserva tu turno</h1>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Calendar />
      </LocalizationProvider>
    </div>
  );
}
