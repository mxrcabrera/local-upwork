import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";

export enum EstadoReserva {
  PENDIENTE = "pendiente",
  CONFIRMADA = "confirmada",
  CANCELADA = "cancelada",
  COMPLETADA = "completada"
}

// Create Reservation
export async function createReservation(reservationData: any) {
  try {
    await addDoc(collection(firebaseDB, "reservas"), {
      ...reservationData,
      estado: EstadoReserva.PENDIENTE,
    });
    console.log("Reserva creada con éxito. ");
  } catch (e) {
    console.error("Error al crear la reserva: ", e);
  }
}

// Get Reservations
export async function getReservations() {
  try {
    const querySnapshot = await getDocs(collection(firebaseDB, "reservas"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error al obtener las reservas: ", e);
    return [];
  }
}

// Get Reservation by ID
export async function getReservationById(reservationId: string) {
  try {
    const reservationRef = doc(firebaseDB, "reservas", reservationId);
    const reservationSnap = await getDoc(reservationRef);
    if (reservationSnap.exists()) {
      return { id: reservationSnap.id, ...reservationSnap.data() };
    } else {
      console.log("No se encontró la reserva");
      return null;
    }
  } catch (e) {
    console.error("Error al obtener la reserva: ", e);
    return null;
  }
}

// Update Reservation
export async function updateReservation(reservationId: string, updatedData: any) {
  try {
    const reservationRef = doc(firebaseDB, "reservas", reservationId);
    await updateDoc(reservationRef, {
      ...updatedData,
      estado: EstadoReserva.CONFIRMADA, //TODO: chequear qué estado dejar acá
    });
    console.log("Reserva actualizada con éxito");
  } catch (e) {
    console.error("Error al actualizar la reserva: ", e);
  }
}

// Delete Reservation
export async function deleteReservation(reservationId: string) {
  try {
    const reservationRef = doc(firebaseDB, "reservas", reservationId);
    await deleteDoc(reservationRef);
    console.log("Reserva eliminada con éxito");
  } catch (e) {
    console.error("Error al eliminar la reserva: ", e);
  }
}