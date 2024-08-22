import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";

// Create Profile
export async function createProfile(profileData: any) {
  try {
    await addDoc(collection(firebaseDB, "perfilesProfesionales"), profileData);
    console.log("Perfil profesional creado con éxito");
  } catch (e) {
    console.error("Error al crear el perfil profesional: ", e);
  }
}

// Read Profiles
export async function getProfiles() {
  try {
    const querySnapshot = await getDocs(collection(firebaseDB, "perfilesProfesionales"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error al obtener los perfiles profesionales: ", e);
    return [];
  }
}

// Get Profile by ID
export async function getProfileById(profileId: string) {
  try {
    const profileRef = doc(firebaseDB, "perfilesProfesionales", profileId);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      return { id: profileSnap.id, ...profileSnap.data() };
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
export async function updateProfile(profileId: string, updatedData: any) {
  try {
    const profileRef = doc(firebaseDB, "perfilesProfesionales", profileId);
    await updateDoc(profileRef, updatedData);
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