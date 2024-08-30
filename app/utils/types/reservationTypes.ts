import { EstadoReserva } from './enums';
import { Timestamp } from "firebase/firestore";

export interface Reserva {
  id: string;
  clienteId: string;
  servicioId: string;
  fechaReserva: Timestamp;
  turnoId: string;
  estado: EstadoReserva;
}