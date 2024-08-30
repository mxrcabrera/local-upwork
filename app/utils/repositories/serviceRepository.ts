import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { Servicio, Resenia } from "../types/serviceTypes";

// Create Service
export async function createService(serviceData: Servicio) {
  try {
    await addDoc(collection(firebaseDB, "servicios"), serviceData);
    console.log("Servicio creado con éxito");
  } catch (e) {
    console.error("Error al crear el servicio: ", e);
  }
}

// Get Services
export async function getServices() {
  try {
    const querySnapshot = await getDocs(collection(firebaseDB, "servicios"));
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Servicio;
      return {
        ...data,
        id: doc.id,
        resenias: data.resenias.map((resenia: Resenia) => ({
          ...resenia,
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
      const data = serviceSnap.data() as Servicio;
      return {
        ...data,
        id: serviceSnap.id,
        resenias: data.resenias.map((resenia: Resenia) => ({
          ...resenia,
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
export async function updateService(serviceId: string, updatedData: Partial<Servicio>) {
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