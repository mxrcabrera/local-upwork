"use client";

import React, { useState, useEffect } from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { getAvailability } from '../../utils/repositories/availabilityRepository';
import { Timestamp } from "firebase/firestore";
import { Button, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Availability, Shift } from '../../utils/types/availabilityTypes';

interface BaseCalendarProps {
  userId: string;
  serviceId: string;
  userType: 'professional' | 'client';
  onChange: (date: Dayjs | null) => void;
  onTimeSelect: (shift: { time: string, shiftId: string } | null) => void;
}

const BaseCalendarComponent: React.FC<BaseCalendarProps> = ({ userId, serviceId, userType, onChange, onTimeSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [desiredDuration, setDesiredDuration] = useState<number>(0);

  useEffect(() => {
    fetchAvailability();
  }, [userId, serviceId]);

  const fetchAvailability = async () => {
    try {
      const availabilityData = await getAvailability(userId);
      setAvailability(availabilityData.filter(availability => 
        availability.shifts.some(shift => shift.serviceId === serviceId)
      ));
    } catch (error) {
      console.error("Error al obtener la disponibilidad:", error);
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setSelectedShift(null);
    onChange(date);
  };

  const handleTimeSelection = (shift: Shift) => {
    setSelectedShift(shift);
    onTimeSelect({ time: shift.start, shiftId: shift.shiftId });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="bg-gray-800 p-4 rounded-lg">
        {userType === 'client' && (
          <TextField
            label="Duración del Turno (minutos)"
            type="number"
            value={desiredDuration}
            onChange={(e) => setDesiredDuration(Number(e.target.value))}
            fullWidth
            variant="outlined"
            margin="normal"
            className="mb-4"
          />
        )}
        <StaticDatePicker
          value={selectedDate}
          onChange={handleDateChange}
          className="bg-gray-700 text-white"
          shouldDisableDate={(date) => {
            const selectedTimestamp = Timestamp.fromDate(date.startOf('day').toDate());
            return !availability.some(availability => 
              availability.day.isEqual(selectedTimestamp) &&
              availability.shifts.some(shift => 
                (userType === 'client' ? shift.length >= desiredDuration : true) && 
                shift.serviceId === serviceId
              )
            );
          }}
        />
        {selectedDate && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Disponibilidad para {selectedDate.format('DD/MM/YYYY')}:</h3>
            <ul className="space-y-2">
              {availability.map((availability) => (
                availability.shifts
                .filter(shift => userType === 'client' ? shift.length >= desiredDuration && shift.serviceId === serviceId : true)
                .map((shift, index) => (
                  <li key={index}>
                    <Button 
                      onClick={() => handleTimeSelection(shift)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
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

export default BaseCalendarComponent;