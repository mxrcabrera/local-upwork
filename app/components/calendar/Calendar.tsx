"use client";

import React, { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { createReservation, getServices } from '../../utils/firestoreDB';

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [availability, setAvailability] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reservations, setReservations] = useState<{ date: Dayjs, time: string }[]>([]);
  const [servicios, setServicios] = useState<{ id: string, titulo: string }[]>([]);
  const [selectedServicioId, setSelectedServicioId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      const fetchedServices = await getServices();
      setServicios(fetchedServices);
    };
    loadServices();
  }, []);

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    if (date) {
      fetchAvailability(date);
    }
  };

  const fetchAvailability = (date: Dayjs) => {
    const availableTimes = ['10:00 AM', '2:00 PM', '4:00 PM'];
    setAvailability(availableTimes);
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  const confirmReservation = async () => {
    if (selectedDate && selectedTime && selectedServicioId) {
      try {
        await createReservation(selectedServicioId);
        setReservations([...reservations, { date: selectedDate, time: selectedTime }]);
        alert(`Reserva confirmada para el ${selectedDate.format('DD/MM/YYYY')} a las ${selectedTime}`);
        setSelectedTime(null);
      } catch (e) {
        console.error("Error al confirmar la reserva: ", e);
      }
    } else {
      alert("Faltan datos para crear la reserva. Asegúrate de seleccionar una fecha, hora y servicio válidos.");
    }
  };

  return (
    <div>
      <StaticDatePicker
        value={selectedDate}
        onChange={handleDateChange}
      />
      {selectedDate && (
        <div>
          <h3>Disponibilidad para {selectedDate.format('DD/MM/YYYY')}:</h3>
          <ul>
            {availability.map((time, index) => (
              <li key={index}>
                <button onClick={() => handleTimeSelection(time)}>
                  {time}
                </button>
              </li>
            ))}
          </ul>
          {selectedTime && (
            <div>
              <p>Has seleccionado: {selectedTime}</p>
              <select
                value={selectedServicioId || ''}
                onChange={(e) => setSelectedServicioId(e.target.value)}
              >
                <option value="">Selecciona un servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.titulo}
                  </option>
                ))}
              </select>
              <button onClick={confirmReservation} disabled={!selectedServicioId}>
                Confirmar Reserva
              </button>
            </div>
          )}
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Calendar;
