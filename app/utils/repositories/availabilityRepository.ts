import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { Shift, Availability } from '../types/availabilityTypes';
import { getProfessionalUsers } from './userRepository'; // Asegúrate de que la ruta sea correcta
import { v4 as uuidv4 } from 'uuid';

// Create Availability
export async function createAvailability(availabilityData: Omit<Availability, 'id'>): Promise<Availability | null> {
  try {
    const availabilityWithId = { ...availabilityData, id: uuidv4() };
    const docRef = await addDoc(collection(firebaseDB, "availability"), {
      day: availabilityWithId.day,
      shifts: availabilityWithId.shifts.map(shift => ({
        ...shift,
        shiftId: uuidv4()
      }))
    });
    console.log("Disponibilidad creada con éxito");
    return { ...availabilityWithId, id: docRef.id };
  } catch (e) {
    console.error("Error al crear la disponibilidad: ", e);
    return null;
  }
}

// Get Availability
export async function getAvailability(professionalId: string): Promise<Availability[]> {
  try {
    const availabilityQuery = query(
      collection(firebaseDB, `perfilesProfesionales/${professionalId}/disponibilidad`),
      orderBy("day")
    );
    const querySnapshot = await getDocs(availabilityQuery);
    const availabilityData: Availability[] = [];
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data() as Availability;
      
      if (data.shifts) {
        const dayString = data.day.toDate().toISOString().split('T')[0];
        
        const existingDay = availabilityData.find(d => d.day.toDate().toISOString().split('T')[0] === dayString);
        if (existingDay) {
          existingDay.shifts.push(...data.shifts);
        } else {
          availabilityData.push({
            id: doc.id,
            day: data.day,
            shifts: data.shifts
          });
        }
      }
    });

    return availabilityData;
  } catch (error) {
    console.error("Error al obtener la disponibilidad: ", error);
    return [];
  }
}

// Get Availability by ID
export async function getAvailabilityById(availabilityId: string): Promise<Availability | null> {
  try {
    const availabilityRef = doc(firebaseDB, "disponibilidad", availabilityId);
    const availabilitySnap = await getDoc(availabilityRef);
    if (availabilitySnap.exists()) {
      return availabilitySnap.data() as Availability;
    } else {
      console.log("No se encontró la disponibilidad");
      return null;
    }
  } catch (e) {
    console.error("Error al obtener la disponibilidad: ", e);
    return null;
  }
}

// Update Availability
export async function updateAvailability(availabilityId: string, updatedData: Partial<Availability>): Promise<boolean> {
  try {
    const availabilityRef = doc(firebaseDB, "disponibilidad", availabilityId);
    await updateDoc(availabilityRef, updatedData);
    console.log("Disponibilidad actualizada con éxito");
    return true;
  } catch (e) {
    console.error("Error al actualizar la disponibilidad: ", e);
    return false;
  }
}

// Delete Availability
export async function deleteAvailability(availabilityId: string): Promise<void> {
  try {
    const availabilityRef = doc(firebaseDB, "disponibilidad", availabilityId);
    await deleteDoc(availabilityRef);
    console.log("Disponibilidad eliminada con éxito");
  } catch (e) {
    console.error("Error al eliminar la disponibilidad: ", e);
  }
}