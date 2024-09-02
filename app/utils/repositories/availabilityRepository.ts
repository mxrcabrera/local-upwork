import { addDoc, getDocs, collection } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { Shift, Availability } from '../types/availabilityTypes';
import { getProfiles } from '../../utils/repositories/professionalProfileRepository';
import { v4 as uuidv4 } from 'uuid';

// Create Availability
export async function createAvailability(availabilityData: Availability): Promise<void> {
  try {
    const availabilityWithId = { ...availabilityData, id: uuidv4() };
    await addDoc(collection(firebaseDB, "disponibilidad"), availabilityWithId);
    console.log("Disponibilidad creada con éxito");
  } catch (e) {
    console.error("Error al crear la disponibilidad: ", e);
  }
}

export async function getAvailability(): Promise<Availability[]> {
  try {
    const profiles = await getProfiles();
    if (profiles.length === 0) {
      console.error("No se encontró ningún profesional.");
      return [];
    }
    const professionalId = profiles[0].id; // TODO: change when we have real data in db

    const querySnapshot = await getDocs(collection(firebaseDB, `perfilesProfesionales/${professionalId}/disponibilidad`));
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