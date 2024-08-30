import React, { useState, useEffect } from 'react';
import { getServices } from '../../utils/repositories/serviceRepository';
import { createReservation } from '../../utils/repositories/reservationRepository';
import dayjs, { Dayjs } from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import { Servicio } from '../../utils/types/serviceTypes';

interface ReservaProps {
  clienteId: string;
  selectedDate: Dayjs | null;
  selectedTime: { time: string, turnoId: string } | null;
}

const ReservaComponent: React.FC<ReservaProps> = ({ clienteId, selectedDate, selectedTime }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [selectedServicioId, setSelectedServicioId] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      const fetchedServices = await getServices();
      setServicios(fetchedServices);
    };
    loadServices();
  }, []);

  const handleCreateReservation = async () => {
    if (!selectedServicioId || !selectedDate || !selectedTime) {
      setError("Faltan datos para crear la reserva. Asegúrate de seleccionar un servicio, fecha y hora válidos.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fechaReserva = dayjs(`${selectedDate.format('YYYY-MM-DD')}T${selectedTime.time}:00`).toDate();
      const timestamp = Timestamp.fromDate(fechaReserva);
      await createReservation(clienteId, selectedServicioId, timestamp, selectedTime.turnoId);
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
        value={selectedServicioId || ''}
        onChange={(e) => setSelectedServicioId(e.target.value)}
      >
        <option value="">Selecciona un servicio</option>
        {servicios.map((servicio) => 
          servicio.titulo ? (
            <option key={servicio.id} value={servicio.id}>
              {servicio.titulo}
            </option>
          ) : null
        )}
      </select>
      <button onClick={handleCreateReservation} disabled={loading}>
        {loading ? "Creando..." : "Crear Reserva"}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ReservaComponent;