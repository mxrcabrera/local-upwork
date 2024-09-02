import { ReservationStatus } from './enums';
import { Timestamp } from "firebase/firestore";

export interface Reservation {
  id: string;
  clientId: string;
  serviceId: string;
  reservationDate: Timestamp;
  shiftId: string;
  status: ReservationStatus;
}