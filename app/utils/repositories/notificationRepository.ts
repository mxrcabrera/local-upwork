import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { TipoNotificacion, EstadoNotificacion } from '../types/enums';
import { Notificacion } from '../types/notificationTypes';

// Create Notification
export async function createNotification(notificationData: Notificacion) {
  try {
    await addDoc(collection(firebaseDB, "notificaciones"), notificationData);
    console.log("Notificación creada con éxito");
  } catch (e) {
    console.error("Error al crear la notificación: ", e);
  }
}

// Get Notifications
export async function getNotifications(): Promise<Notificacion[]> {
  try {
    const querySnapshot = await getDocs(collection(firebaseDB, "notificaciones"));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        usuarioId: data.usuarioId,
        mensaje: data.mensaje,
        tipo: data.tipo,
        fecha: new Date(data.fecha),
        estado: data.estado
      } as Notificacion;
    });
  } catch (e) {
    console.error("Error al obtener las notificaciones: ", e);
    return [];
  }
}

// Get Notification by ID
export async function getNotificationById(notificationId: string): Promise<Notificacion | null> {
  try {
    const notificationRef = doc(firebaseDB, "notificaciones", notificationId);
    const notificationSnap = await getDoc(notificationRef);
    if (notificationSnap.exists()) {
      const data = notificationSnap.data();
      return {
        id: notificationSnap.id,
        usuarioId: data.usuarioId,
        mensaje: data.mensaje,
        tipo: data.tipo,
        fecha: new Date(data.fecha),
        estado: data.estado
      } as Notificacion;
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
export async function updateNotification(notificationId: string, updatedData: Partial<Notificacion>) {
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