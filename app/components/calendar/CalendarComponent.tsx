import React, { useState, useEffect } from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { createReservation } from '../../utils/repositories/reservationRepository';
import { getServices } from '../../utils/repositories/serviceRepository';
import { getAvailability } from '../../utils/repositories/availabilityRepository'; // Use the function
import { Timestamp } from "firebase/firestore";
import { EstadoReserva } from '@/app/utils/types/enums';
import { Servicio } from '../../utils/types/serviceTypes';
import { Turno, Disponibilidad } from '../../utils/types/availabilityTypes';
import { CalendarioTypes } from '../../utils/types/calendarTypes';
import { Reserva } from '../../utils/types/reservationTypes';
import { v4 as uuidv4 } from 'uuid';

const Calendar: React.FC<CalendarioTypes> = ({ clienteId }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [availability, setAvailability] = useState<Disponibilidad[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [selectedServicioId, setSelectedServicioId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      const fetchedServices = await getServices();
      setServicios(fetchedServices);
    };
    loadServices();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailability = async (date: Dayjs) => {
    try {
      const availabilityData: Disponibilidad[] = await getAvailability();
      const selectedTimestamp = Timestamp.fromDate(date.startOf('day').toDate());
      
      setAvailability(availabilityData.filter((disponibilidad) => 
        disponibilidad.dia.isEqual(selectedTimestamp)
      ));
    } catch (error) {
      console.error("Error al obtener la disponibilidad: ", error);
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setSelectedTurno(null);
    setSelectedServicioId(null);
  };

  const handleTimeSelection = (turno: Turno) => {
    setSelectedTurno(turno);
  };

  const confirmReservation = async () => {
    if (selectedDate && selectedTurno && selectedServicioId) {
      try {
        const fechaReserva = dayjs(`${selectedDate.format('YYYY-MM-DD')}T${selectedTurno.inicio}:00`).toDate();
        const timestamp = Timestamp.fromDate(fechaReserva);
        const newReservation: Reserva = {
          id: uuidv4(),
          clienteId,
          servicioId: selectedServicioId,
          fechaReserva: timestamp,
          turnoId: selectedTurno.turnoId,
          estado: EstadoReserva.CONFIRMADA
        };
        await createReservation(clienteId, selectedServicioId, timestamp, selectedTurno.turnoId);
        setReservations([...reservations, newReservation]);
        alert(`Reserva confirmada para el ${selectedDate.format('DD/MM/YYYY')} a las ${selectedTurno.inicio}`);
        setSelectedTurno(null);
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
            {availability.map((disponibilidad: Disponibilidad) => {
              const selectedTimestamp = Timestamp.fromDate(selectedDate.toDate());
              return disponibilidad.dia.toDate().toDateString() === selectedTimestamp.toDate().toDateString() && disponibilidad.turnos.map((turno, index) => (
                <li key={index}>
                  <button onClick={() => handleTimeSelection(turno)}>
                    {turno.inicio} - {turno.fin}
                  </button>
                </li>
              ));
            })}
          </ul>
          {selectedTurno && (
            <div>
              <p>Has seleccionado: {selectedTurno.inicio} - {selectedTurno.fin}</p>
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