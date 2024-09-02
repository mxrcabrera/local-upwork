import React, { useState, useEffect } from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { createReservation } from '../../utils/repositories/reservationRepository';
import { getServices } from '../../utils/repositories/serviceRepository';
import { getAvailability } from '../../utils/repositories/availabilityRepository';
import { Timestamp } from "firebase/firestore";
import { ReservationStatus } from '@/app/utils/types/enums';
import { Service } from '../../utils/types/serviceTypes';
import { Shift, Availability } from '../../utils/types/availabilityTypes';
import { CalendarTypes } from '../../utils/types/calendarTypes';
import { Reservation } from '../../utils/types/reservationTypes';
import { v4 as uuidv4 } from 'uuid';

const CalendarComponent: React.FC<CalendarTypes> = ({ clientId }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      const fetchedServices = await getServices();
      setServices(fetchedServices);
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
      const availabilityData: Availability[] = await getAvailability();
      const selectedTimestamp = Timestamp.fromDate(date.startOf('day').toDate());
      
      setAvailability(availabilityData.filter((availability) => 
        availability.day.isEqual(selectedTimestamp)
      ));
    } catch (error) {
      console.error("Error al obtener la disponibilidad: ", error);
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setSelectedShift(null);
    setSelectedServiceId(null);
  };

  const handleTimeSelection = (shift: Shift) => {
    setSelectedShift(shift);
  };

  const confirmReservation = async () => {
    if (selectedDate && selectedShift && selectedServiceId) {
      try {
        const reservationDate = dayjs(`${selectedDate.format('YYYY-MM-DD')}T${selectedShift.start}:00`).toDate();
        const timestamp = Timestamp.fromDate(reservationDate);
        const newReservation: Reservation = {
          id: uuidv4(),
          clientId,
          serviceId: selectedServiceId,
          reservationDate: timestamp,
          shiftId: selectedShift.shiftId,
          status: ReservationStatus.CONFIRMED
        };
        await createReservation(clientId, selectedServiceId, timestamp, selectedShift.shiftId);
        setReservations([...reservations, newReservation]);
        alert(`Reserva confirmada para el ${selectedDate.format('DD/MM/YYYY')} a las ${selectedShift.start}`);
        setSelectedShift(null);
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
            {availability.map((availability: Availability) => {
              const selectedTimestamp = Timestamp.fromDate(selectedDate.toDate());
              return availability.day.toDate().toDateString() === selectedTimestamp.toDate().toDateString() && availability.shifts.map((shift, index) => (
                <li key={index}>
                  <button onClick={() => handleTimeSelection(shift)}>
                    {shift.start} - {shift.end}
                  </button>
                </li>
              ));
            })}
          </ul>
          {selectedShift && (
            <div>
              <p>Has seleccionado: {selectedShift.start} - {selectedShift.end}</p>
              <select
                value={selectedServiceId || ''}
                onChange={(e) => setSelectedServiceId(e.target.value)}
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
              <button onClick={confirmReservation} disabled={!selectedServiceId}>
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

export default CalendarComponent;