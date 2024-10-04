"use client";

import React, { useState } from 'react';
import BaseCalendarComponent from './BaseCalendarComponent';
import ReservationComponent from '../reservation/ReservationComponent';
import { Dayjs } from 'dayjs';

interface BookingCalendarComponentProps {
  clientId: string;
  professionalId: string;
  serviceId: string;
  onChange: (date: Dayjs | null) => void;
  onTimeSelect: (shift: { time: string, shiftId: string } | null) => void;
}

const BookingCalendarComponent: React.FC<BookingCalendarComponentProps> = ({ clientId, professionalId, serviceId, onChange, onTimeSelect }) => {
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
      <ReservationComponent
        clientId={clientId}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </div>
  );
};

export default BookingCalendarComponent;