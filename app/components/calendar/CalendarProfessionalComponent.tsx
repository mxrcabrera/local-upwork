"use client";

import React from 'react';
import BaseCalendarComponent from './BaseCalendarComponent';
import { Dayjs } from 'dayjs';

interface CalendarProfessionalProps {
  professionalId: string;
  serviceId: string;
  onChange: (date: Dayjs | null) => void;
  onTimeSelect: (shift: { time: string, shiftId: string } | null) => void;
}

const CalendarProfessional: React.FC<CalendarProfessionalProps> = ({ professionalId, serviceId, onChange, onTimeSelect }) => {
  return (
    <BaseCalendarComponent
      userId={professionalId}
      serviceId={serviceId}
      userType="professional"
      onChange={onChange}
      onTimeSelect={onTimeSelect}
    />
  );
};

export default CalendarProfessional;