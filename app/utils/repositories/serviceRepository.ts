import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { Service, Review } from "../types/serviceTypes";
import { v4 as uuidv4 } from 'uuid';

// Create Service
export async function createService(serviceData: Omit<Service, 'id'>): Promise<Service | null> {
  try {
    const serviceWithId = { ...serviceData, id: uuidv4() };
    const docRef = await addDoc(collection(firebaseDB, "services"), serviceWithId);
    console.log("Servicio creado con éxito");
    return { ...serviceWithId, id: docRef.id };
  } catch (e) {
    console.error("Error al crear el servicio: ", e);
    return null;
  }
}

// Get All Services
export async function getServicesList(): Promise<Service[]> {
  try {
    const servicesQuery = query(
      collection(firebaseDB, "services"),
      orderBy("title")
    );
    const querySnapshot = await getDocs(servicesQuery);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Service;
      return {
        ...data,
        id: doc.id,
        reviews: Array.isArray(data.reviews) ? data.reviews.map((review: Review) => ({
          ...review,
        })) : []
      };
    });
  } catch (e) {
    console.error("Error al obtener los servicios: ", e);
    return [];
  }
}

// Get Services by Professional
export async function getProfessionalServicesList(professionalId: string): Promise<Service[]> {
  try {
    const servicesQuery = query(
      collection(firebaseDB, "services"),
      where("professionalId", "==", professionalId)
    );
    const querySnapshot = await getDocs(servicesQuery);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Service;
      return {
        ...data,
        id: doc.id,
        reviews: Array.isArray(data.reviews) ? data.reviews.map(review => ({
          ...review,
        })) : []
      };
    });
  } catch (e) {
    console.error("Error al obtener los servicios del profesional: ", e);
    return [];
  }
}

// Update Service
export async function updateService(serviceId: string, updatedData: Partial<Service>): Promise<boolean> {
  try {
    const serviceRef = doc(firebaseDB, "services", serviceId);
    await updateDoc(serviceRef, updatedData);
    console.log("Servicio actualizado con éxito");
    return true;
  } catch (e) {
    console.error("Error al actualizar el servicio: ", e);
    return false;
  }
}

// Delete Service
export async function deleteService(serviceId: string): Promise<void> {
  try {
    const serviceRef = doc(firebaseDB, "services", serviceId);
    await deleteDoc(serviceRef);
    console.log("Servicio eliminado con éxito");
  } catch (e) {
    console.error("Error al eliminar el servicio: ", e);
  }
}