"use client";

import React, { useState } from 'react';
import BaseCalendarComponent from './BaseCalendarComponent';
import ReservaComponent from '../reservation/ReservationComponent';
import { Dayjs } from 'dayjs';

interface CalendarClientProps {
  clientId: string;
  professionalId: string;
  serviceId: string;
  onChange: (date: Dayjs | null) => void;
  onTimeSelect: (shift: { time: string, shiftId: string } | null) => void;
}

const CalendarClient: React.FC<CalendarClientProps> = ({ clientId, professionalId, serviceId, onChange, onTimeSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<{ time: string, shiftId: string } | null>(null);

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    onChange(date);
  };

  const handleTimeSelection = (shift: { time: string, shiftId: string } | null) => {
    setSelectedTime(shift);
    onTimeSelect(shift);
  };

  return (
    <div>
      <BaseCalendarComponent
        userId={professionalId}
        serviceId={serviceId}
        userType="client"
        onChange={handleDateChange}
        onTimeSelect={handleTimeSelection}
      />
      <ReservaComponent
        clientId={clientId}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </div>
  );
};

export default CalendarClient;