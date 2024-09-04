"use client";

import React, { useState, useEffect } from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { getAvailability } from '../../utils/repositories/availabilityRepository';
import { Timestamp } from "firebase/firestore";
import { Shift, Availability } from '../../utils/types/availabilityTypes';
import { Button, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface CalendarComponentProps {
  onChange: (date: Dayjs | null) => void;
  clientId: string;
  professionalId: string;
  serviceId: string; // Persisted serviceId
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onChange, clientId, professionalId, serviceId }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [desiredDuration, setDesiredDuration] = useState<number>(0);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate, desiredDuration]);

  const fetchAvailability = async (date: Dayjs) => {
    try {
      const availabilityData: Availability[] = await getAvailability(professionalId); // Pasa el professionalId aquí
      const selectedTimestamp = Timestamp.fromDate(date.startOf('day').toDate());
      
      setAvailability(availabilityData.filter((availability) => 
        availability.day.isEqual(selectedTimestamp) &&
        availability.shifts.some(shift => 
          shift.length >= desiredDuration && 
          shift.serviceId === serviceId
        )
      ));
    } catch (error) {
      console.error("Error al obtener la disponibilidad: ", error);
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setSelectedShift(null);
    onChange(date);
  };

  const handleTimeSelection = (shift: Shift) => {
    setSelectedShift(shift);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <TextField
          label="Duración del Turno (minutos)"
          type="number"
          value={desiredDuration}
          onChange={(e) => setDesiredDuration(Number(e.target.value))}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <StaticDatePicker
          value={selectedDate}
          onChange={handleDateChange}
          className='bg-gray-800'
          shouldDisableDate={(date) => {
            const selectedTimestamp = Timestamp.fromDate(date.startOf('day').toDate());
            return !availability.some(availability => 
              availability.day.isEqual(selectedTimestamp) &&
              availability.shifts.some(shift => 
                shift.length >= desiredDuration && 
                shift.serviceId === serviceId
              )
            );
          }}
        />
        {selectedDate && (
          <div className="mt-4">
            <h3 className="text-xl font-bold">Disponibilidad para {selectedDate.format('DD/MM/YYYY')}:</h3>
            <ul className="mt-2">
              {availability.map((availability: Availability) => (
                availability.shifts
                  .filter(shift => shift.length >= desiredDuration && shift.serviceId === serviceId)
                  .map((shift, index) => (
                    <li key={index} className="mt-1">
                      <Button 
                        onClick={() => handleTimeSelection(shift)} 
                        className={`text-blue-500 hover:text-blue-600 ${selectedShift?.shiftId === shift.shiftId ? 'bg-blue-200' : ''}`}
                      >
                        {shift.start} - {shift.end}
                      </Button>
                    </li>
                  ))
              ))}
            </ul>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default CalendarComponent;