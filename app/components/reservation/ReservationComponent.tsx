"use client";

import React, { useState, useEffect } from 'react';
import { getServicesList } from '../../utils/repositories/serviceRepository';
import { createReservation } from '../../utils/repositories/reservationRepository';
import dayjs, { Dayjs } from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import { Service } from '../../utils/types/serviceTypes';

interface ReservationProps {
  clientId: string;
  selectedDate: Dayjs | null;
  selectedTime: { time: string, shiftId: string } | null;
}

const ReservationComponent: React.FC<ReservationProps> = ({ clientId, selectedDate, selectedTime }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const fetchedServices = await getServicesList();
        setServices(fetchedServices);
      } catch (e) {
        setError("Error al cargar los servicios. Por favor, inténtalo de nuevo.");
      }
    };
    loadServices();
  }, []);

  const handleCreateReservation = async () => {
    if (!selectedServiceId || !selectedDate || !selectedTime) {
      setError("Faltan datos para crear la reserva. Asegúrate de seleccionar un servicio, fecha y hora válidos.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fechaReserva = dayjs(`${selectedDate.format('YYYY-MM-DD')}T${selectedTime.time}:00`).toDate();
      const timestamp = Timestamp.fromDate(fechaReserva);
      await createReservation(clientId, selectedServiceId, timestamp, selectedTime.shiftId);
      alert("Reserva creada con éxito");
    } catch (e) {
      setError("Error al crear la reserva. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <select
        value={selectedServiceId || ''}
        onChange={(e) => setSelectedServiceId(e.target.value)}
        disabled={loading}
      >
        <option value="">Selecciona un servicio</option>
        {services.map((service) => 
          service.title ? (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ) : null
        )}
      </select>
      <button onClick={handleCreateReservation} disabled={loading || !selectedServiceId || !selectedDate || !selectedTime}>
        {loading ? "Creando..." : "Crear Reserva"}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ReservationComponent;