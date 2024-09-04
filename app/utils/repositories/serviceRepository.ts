import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { Service, Review } from "../types/serviceTypes";
import { v4 as uuidv4 } from 'uuid';

// Create Service
export async function createService(serviceData: Omit<Service, 'id'>): Promise<Service | null> {
  try {
    const serviceWithId = { ...serviceData, id: uuidv4() }; // Generar el ID aquí
    const docRef = await addDoc(collection(firebaseDB, "services"), serviceWithId);
    console.log("Servicio creado con éxito");
    return { ...serviceWithId, id: docRef.id };
  } catch (e) {
    console.error("Error al crear el servicio: ", e);
    return null; // Devuelve null en caso de error
  }
}

// Get Services
export async function getServices() {
  try {
    const servicesQuery = query(
      collection(firebaseDB, "services"),
      orderBy("title") // Ordena por el campo 'title'
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

// Get Service by ID
export async function getServiceById(serviceId: string) {
  try {
    const serviceRef = doc(firebaseDB, "services", serviceId);
    const serviceSnap = await getDoc(serviceRef);
    if (serviceSnap.exists()) {
      const data = serviceSnap.data() as Service;
      return {
        ...data,
        id: serviceSnap.id,
        reviews: data.reviews.map((review: Review) => ({
          ...review,
        }))
      };
    } else {
      console.log("No se encontró el servicio");
      return null;
    }
  } catch (e) {
    console.error("Error al obtener el servicio: ", e);
    return null;
  }
}

// Update Service
export async function updateService(serviceId: string, updatedData: Partial<Service>): Promise<boolean> {
  try {
    const serviceRef = doc(firebaseDB, "services", serviceId);
    await updateDoc(serviceRef, updatedData);
    console.log("Servicio actualizado con éxito");
    return true; // Devuelve true si la actualización fue exitosa
  } catch (e) {
    console.error("Error al actualizar el servicio: ", e);
    return false; // Devuelve false si hubo un error
  }
}

// Delete Service
export async function deleteService(serviceId: string) {
  try {
    const serviceRef = doc(firebaseDB, "services", serviceId);
    await deleteDoc(serviceRef);
    console.log("Servicio eliminado con éxito");
  } catch (e) {
    console.error("Error al eliminar el servicio: ", e);
  }
}