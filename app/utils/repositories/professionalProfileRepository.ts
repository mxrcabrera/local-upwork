import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { ProfessionalProfile } from '../types/professionalProfileTypes';
import { v4 as uuidv4 } from 'uuid';

function isTimestamp(value: any): value is Timestamp {
  return value && typeof value === 'object' && value instanceof Timestamp;
}

// Create Profile
export async function createProfile(profileData: ProfessionalProfile): Promise<ProfessionalProfile | null> {
  try {
    const profileWithId = {
      ...profileData,
      id: uuidv4(),
      availability: profileData.availability.map(d => ({
        ...d,
        day: isTimestamp(d.day) ? d.day : Timestamp.fromDate(new Date(d.day))
      }))
    };
    const docRef = await addDoc(collection(firebaseDB, "perfilesProfesionales"), profileWithId);
    console.log("Perfil profesional creado con éxito");
    return { ...profileWithId, id: docRef.id };
  } catch (e) {
    console.error("Error al crear el perfil profesional: ", e);
    return null;
  }
}

// Get Profiles
export async function getProfiles(): Promise<ProfessionalProfile[]> {
  try {
    const profilesQuery = query(
      collection(firebaseDB, "perfilesProfesionales"),
      orderBy("userId") // Ensure alphabetical sorting by 'userId'
    );
    const querySnapshot = await getDocs(profilesQuery);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as ProfessionalProfile;
      return {
        ...data,
        id: doc.id,
        availability: data.availability.map(d => ({
          ...d,
          day: d.day
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
export async function updateProfile(profileId: string, updatedData: Partial<ProfessionalProfile>): Promise<boolean> {
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
    return true;
  } catch (e) {
    console.error("Error al actualizar el perfil profesional: ", e);
    return false;
  }
}

// Delete Profile
export async function deleteProfile(profileId: string): Promise<boolean> {
  try {
    const profileRef = doc(firebaseDB, "perfilesProfesionales", profileId);
    await deleteDoc(profileRef);
    console.log("Perfil profesional eliminado con éxito");
    return true;
  } catch (e) {
    console.error("Error al eliminar el perfil profesional: ", e);
    return false;
  }
}