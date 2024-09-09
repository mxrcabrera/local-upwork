import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { NotificationType, NotificationStatus } from '../types/enums';
import { Notification } from '../types/notificationTypes';
import { v4 as uuidv4 } from 'uuid';

// Create Notification
export async function createNotification(notificationData: Notification) {
  try {
    const notificationWithId = { ...notificationData, id: uuidv4() };
    await addDoc(collection(firebaseDB, "notificaciones"), notificationWithId);
    console.log("Notificación creada con éxito");
  } catch (e) {
    console.error("Error al crear la notificación: ", e);
  }
}

// Get Notifications
export async function getNotifications(): Promise<Notification[]> {
  try {
    const querySnapshot = await getDocs(collection(firebaseDB, "notificaciones"));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        message: data.message,
        notificationType: data.notificationType as NotificationType,
        date: data.date,
        status: data.status as NotificationStatus
      } as Notification;
    });
  } catch (e) {
    console.error("Error al obtener las notificaciones: ", e);
    return [];
  }
}

// Get Notification by ID
export async function getNotificationById(notificationId: string): Promise<Notification | null> {
  try {
    const notificationRef = doc(firebaseDB, "notificaciones", notificationId);
    const notificationSnap = await getDoc(notificationRef);
    if (notificationSnap.exists()) {
      const data = notificationSnap.data();
      return {
        id: notificationSnap.id,
        userId: data.userId,
        message: data.message,
        notificationType: data.notificationType as NotificationType,
        date: data.date,
        status: data.status as NotificationStatus
      } as Notification;
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
export async function updateNotification(notificationId: string, updatedData: Partial<Notification>) {
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