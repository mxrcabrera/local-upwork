import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { PerfilProfesional } from '../types/professionalProfileTypes';

function isTimestamp(value: any): value is Timestamp {
  return value && typeof value === 'object' && value instanceof Timestamp;
}

// Create Profile
export async function createProfile(profileData: PerfilProfesional) {
  try {
    const updatedProfileData = {
      ...profileData,
      disponibilidad: profileData.disponibilidad.map(d => ({
        ...d,
        dia: isTimestamp(d.dia) ? d.dia : Timestamp.fromDate(new Date(d.dia))
      }))
    };
    await addDoc(collection(firebaseDB, "perfilesProfesionales"), updatedProfileData);
    console.log("Perfil profesional creado con éxito");
  } catch (e) {
    console.error("Error al crear el perfil profesional: ", e);
  }
}

// Get All Profiles
export async function getProfiles(): Promise<PerfilProfesional[]> {
  try {
    const querySnapshot = await getDocs(collection(firebaseDB, "perfilesProfesionales"));
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as PerfilProfesional;
      return {
        ...data,
        id: doc.id,
        disponibilidad: data.disponibilidad.map(d => ({
          ...d,
          dia: d.dia
        }))
      };
    });
  } catch (e) {
    console.error("Error al obtener los perfiles profesionales: ", e);
    return [];
  }
}

// Get Profile by ID
export async function getProfileById(profileId: string): Promise<PerfilProfesional | null> {
  try {
    const profileRef = doc(firebaseDB, "perfilesProfesionales", profileId);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      const data = profileSnap.data() as PerfilProfesional;
      return {
        ...data,
        id: profileSnap.id,
        disponibilidad: data.disponibilidad.map(d => ({
          ...d,
          dia: d.dia
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
export async function updateProfile(profileId: string, updatedData: Partial<PerfilProfesional>) {
  try {
    const profileRef = doc(firebaseDB, "perfilesProfesionales", profileId);
    const updatedProfileData = {
      ...updatedData,
      disponibilidad: updatedData.disponibilidad?.map(d => ({
        ...d,
        dia: isTimestamp(d.dia) ? d.dia : Timestamp.fromDate(new Date(d.dia))
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