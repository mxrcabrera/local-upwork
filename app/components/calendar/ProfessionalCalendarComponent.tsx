"use client";

import React, { useState, useEffect } from 'react';
import BaseCalendarComponent from './BaseCalendarComponent';
import { Dayjs } from 'dayjs';
import { getReservations } from '../../utils/repositories/reservationRepository';
import { Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

interface ProfessionalCalendarProps {
  professionalId: string;
  serviceId: string;
}

const ProfessionalCalendarComponent: React.FC<ProfessionalCalendarProps> = ({ professionalId, serviceId }) => {
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    fetchReservations();
  }, [professionalId, serviceId]);

  const fetchReservations = async () => {
    try {
      const fetchedReservations = await getReservations(professionalId, serviceId);
      setReservations(fetchedReservations);
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    // Implement logic to filter reservations by date if necessary
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <Typography variant="h4" className="mb-4 text-center">
        Calendario de Reservas
      </Typography>
      <BaseCalendarComponent
        userId={professionalId}
        serviceId={serviceId}
        userType="professional"
        onChange={handleDateChange}
        onTimeSelect={() => {}}
      />
      <div className="mt-6">
        <Typography variant="h5" className="mb-2">
          Reservas:
        </Typography>
        <List>
          {reservations.length > 0 ? (
            reservations.map((reservation, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`Fecha: ${reservation.date.toDate().toLocaleString()}`}
                    secondary={`Cliente: ${reservation.clientId}`}
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No hay reservas para mostrar.
            </Typography>
          )}
        </List>
      </div>
    </div>
  );
};

export default ProfessionalCalendarComponent;