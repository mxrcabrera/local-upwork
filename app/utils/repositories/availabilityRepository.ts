import { getDocs, collection } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { Turno, Disponibilidad } from '../types/availabilityTypes';
import { getProfiles } from '../../utils/repositories/professionalProfileRepository'; // Import the function

// Function to get availability
export async function getAvailability(): Promise<Disponibilidad[]> {
  try {
    const profiles = await getProfiles();
    if (profiles.length === 0) {
      console.error("No se encontró ningún profesional.");
      return [];
    }
    const professionalId = profiles[0].id; // TODO: change when we have real data in db

    const querySnapshot = await getDocs(collection(firebaseDB, `perfilesProfesionales/${professionalId}/disponibilidad`));
    const availabilityData: Disponibilidad[] = [];
    
    querySnapshot.docs.forEach(doc => {
      const data = doc.data() as Disponibilidad;
      
      if (data.turnos) {
        const diaString = data.dia.toDate().toISOString().split('T')[0];
        
        const existingDay = availabilityData.find(d => d.dia.toDate().toISOString().split('T')[0] === diaString);
        if (existingDay) {
          existingDay.turnos.push(...data.turnos);
        } else {
          availabilityData.push({
            dia: data.dia,
            turnos: data.turnos
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