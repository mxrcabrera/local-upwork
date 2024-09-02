import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { Service, Review } from "../types/serviceTypes";
import { v4 as uuidv4 } from 'uuid';

// Create Service
export async function createService(serviceData: Service): Promise<Service | void> {
  try {
    const serviceWithId = { ...serviceData, id: uuidv4() };
    const docRef = await addDoc(collection(firebaseDB, "services"), serviceWithId);
    console.log("Servicio creado con éxito");
    return { ...serviceWithId, id: docRef.id };
  } catch (e) {
    console.error("Error al crear el servicio: ", e);
  }
}

// Get Services
export async function getServices() {
  try {
    const querySnapshot = await getDocs(collection(firebaseDB, "servicios"));
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Service;
      return {
        ...data,
        id: doc.id,
        reviews: data.reviews.map((review: Review) => ({
          ...review,
        }))
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
    const serviceRef = doc(firebaseDB, "servicios", serviceId);
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
export async function updateService(serviceId: string, updatedData: Partial<Service>) {
  try {
    const serviceRef = doc(firebaseDB, "servicios", serviceId);
    await updateDoc(serviceRef, updatedData);
    console.log("Servicio actualizado con éxito");
  } catch (e) {
    console.error("Error al actualizar el servicio: ", e);
  }
}

// Delete Service
export async function deleteService(serviceId: string) {
  try {
    const serviceRef = doc(firebaseDB, "servicios", serviceId);
    await deleteDoc(serviceRef);
    console.log("Servicio eliminado con éxito");
  } catch (e) {
    console.error("Error al eliminar el servicio: ", e);
  }
}