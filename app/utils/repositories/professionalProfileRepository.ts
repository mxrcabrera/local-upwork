import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { ProfessionalProfile } from '../types/professionalProfileTypes';
import { v4 as uuidv4 } from 'uuid';

function isTimestamp(value: any): value is Timestamp {
  return value && typeof value === 'object' && value instanceof Timestamp;
}

// Create Profile
export async function createProfile(profileData: ProfessionalProfile): Promise<ProfessionalProfile | null> {
  try {
    const updatedProfileData = {
      ...profileData,
      id: uuidv4(),
      availability: profileData.availability.map(d => ({
        ...d,
        dia: isTimestamp(d.day) ? d.day : Timestamp.fromDate(new Date(d.day))
      }))
    };
    const docRef = await addDoc(collection(firebaseDB, "perfilesProfesionales"), updatedProfileData);
    console.log("Perfil profesional creado con éxito");
    return { ...updatedProfileData, id: docRef.id };
  } catch (e) {
    console.error("Error al crear el perfil profesional: ", e);
    return null;
  }
}

// Get All Profiles
export async function getProfiles(): Promise<ProfessionalProfile[]> {
  try {
    const querySnapshot = await getDocs(collection(firebaseDB, "perfilesProfesionales"));
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as ProfessionalProfile;
      return {
        ...data,
        id: doc.id,
        availability: data.availability.map(d => ({
          ...d,
          dia: d.day
        }))
      };
    });
  } catch (e) {
    console.error("Error al obtener los perfiles profesionales: ", e);
    return [];
  }
}

// Get Profile by ID
export async function getProfileById(profileId: string): Promise<ProfessionalProfile | null> {
  try {
    const profileRef = doc(firebaseDB, "perfilesProfesionales", profileId);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      const data = profileSnap.data() as ProfessionalProfile;
      return {
        ...data,
        id: profileSnap.id,
        availability: data.availability.map(d => ({
          ...d,
          day: d.day
        }))
      };
    } else {
      console.log("No se encontró el perfil profesional");
      return null;
    }
  } catch (e) {
    console.error("Error al obtener el perfil profesional: ", e);
    return null;
  }
}

// Update Profile
export async function updateProfile(profileId: string, updatedData: Partial<ProfessionalProfile>) {
  try {
    const profileRef = doc(firebaseDB, "perfilesProfesionales", profileId);
    const updatedProfileData = {
      ...updatedData,
      availability: updatedData.availability?.map(d => ({
        ...d,
        day: isTimestamp(d.day) ? d.day : Timestamp.fromDate(new Date(d.day))
      }))
    };
    await updateDoc(profileRef, updatedProfileData);
    console.log("Perfil profesional actualizado con éxito");
  } catch (e) {
    console.error("Error al actualizar el perfil profesional: ", e);
  }
}

// Delete Profile
export async function deleteProfile(profileId: string) {
  try {
    const profileRef = doc(firebaseDB, "perfilesProfesionales", profileId);
    await deleteDoc(profileRef);
    console.log("Perfil profesional eliminado con éxito");
  } catch (e) {
    console.error("Error al eliminar el perfil profesional: ", e);
  }
}