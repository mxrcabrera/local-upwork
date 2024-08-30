import { collection, addDoc, updateDoc, doc, Timestamp } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { EstadoReserva } from '../../utils/types/enums';

// Create Reservation
export async function createReservation(clienteId: string, servicioId: string, fechaReserva: Timestamp, turnoId: string) {
  try {
    const reservationRef = collection(firebaseDB, "reservas");
    await addDoc(reservationRef, {
      clienteId,
      servicioId,
      fechaReserva,
      turnoId,
      estado: EstadoReserva.PENDIENTE
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