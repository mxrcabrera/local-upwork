import { collection, addDoc, updateDoc, doc, Timestamp } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { ReservationStatus } from '../../utils/types/enums';
import { v4 as uuidv4 } from 'uuid';

// Create Reservation
export async function createReservation(clientId: string, serviceId: string, reservationDate: Timestamp, shiftId: string) {
  try {
    const reservationRef = collection(firebaseDB, "reservas");
    await addDoc(reservationRef, {
      id: uuidv4(),
      clientId,
      serviceId,
      reservationDate,
      shiftId,
      status: ReservationStatus.PENDING
    });
    console.log("Reserva creada con éxito");
  } catch (e) {
    console.error("Error al crear la reserva: ", e);
  }
}

// Update Reservation
export async function updateReservation(reservationId: string, updatedData: any) {
  try {
    const reservationRef = doc(firebaseDB, "reservas", reservationId);
    await updateDoc(reservationRef, updatedData);
    console.log("Reserva actualizada con éxito");
  } catch (e) {
    console.error("Error al actualizar la reserva: ", e);
  }
}