import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig/firebaseConfig';

export enum EstadoReserva {
    Pendiente = "pendiente",
    Confirmada = "confirmada",
    Cancelada = "cancelada",
    Completada = "completada"
  }

export async function createReservation(servicioId: string) {
  try {
    await addDoc(collection(db, "reservas"), {
      clienteId: "", // Reemplazar con el ID real del cliente
      servicioId: servicioId,
      estado: EstadoReserva.Pendiente,
      fechaReserva: serverTimestamp()
    });
    console.log("Reserva creada con éxito");
  } catch (e) {
    console.error("Error al crear la reserva: ", e);
  }
}

export async function getServices(): Promise<{ id: string, titulo: string }[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "servicios"));
      const services = querySnapshot.docs.map(doc => ({
        id: doc.id,
        titulo: doc.data().titulo,
      }));
      return services;
    } catch (e) {
      console.error("Error al obtener los servicios: ", e);
      return [];
    }
  }
