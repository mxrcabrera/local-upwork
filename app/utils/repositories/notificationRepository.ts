import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";

export enum TipoNotificacion {
  NUEVA_RESERVA = "nueva reserva",
  CONFIRMACION_RESERVA = "confirmación reserva",
  CANCELACION_RESERVA = "cancelación reserva",
  RECORDATORIO_RESERVA = "recordatorio reserva",
  NUEVA_RESENA_RECIBIDA = "nueva reseña recibida",
  VISTA_DE_PERFIL = "vista de perfil",
  CONFIRMACION_DE_PAGO = "confirmación de pago"
}

export enum EstadoNotificacion {
  Leida = "leída",
  NoLeida = "no leída"
}

// Create Notification
export async function createNotification(notificationData: any) {
  try {
    await addDoc(collection(firebaseDB, "notificaciones"), notificationData);
    console.log("Notificación creada con éxito");
  } catch (e) {
    console.error("Error al crear la notificación: ", e);
  }
}

// Get Notifications
export async function getNotifications() {
  try {
    const querySnapshot = await getDocs(collection(firebaseDB, "notificaciones"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error al obtener las notificaciones: ", e);
    return [];
  }
}

// Get Notification by ID
export async function getNotificationById(notificationId: string) {
  try {
    const notificationRef = doc(firebaseDB, "notificaciones", notificationId);
    const notificationSnap = await getDoc(notificationRef);
    if (notificationSnap.exists()) {
      return { id: notificationSnap.id, ...notificationSnap.data() };
    } else {
      console.log("No se encontró la notificación");
      return null;
    }
  } catch (e) {
    console.error("Error al obtener la notificación: ", e);
    return null;
  }
}

// Update Notification
export async function updateNotification(notificationId: string, updatedData: any) {
  try {
    const notificationRef = doc(firebaseDB, "notificaciones", notificationId);
    await updateDoc(notificationRef, updatedData);
    console.log("Notificación actualizada con éxito");
  } catch (e) {
    console.error("Error al actualizar la notificación: ", e);
  }
}

// Delete Notification
export async function deleteNotification(notificationId: string) {
  try {
    const notificationRef = doc(firebaseDB, "notificaciones", notificationId);
    await deleteDoc(notificationRef);
    console.log("Notificación eliminada con éxito");
  } catch (e) {
    console.error("Error al eliminar la notificación: ", e);
  }
}