import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";

export enum TipoUsuario {
  PROFESIONAL = "profesional",
  CLIENTE = "cliente"
}

// Create User
export async function createUser(userData: any) {
  try {
    await addDoc(collection(firebaseDB, "usuarios"), userData);
    console.log("Usuario creado con éxito");
  } catch (e) {
    console.error("Error al crear el usuario: ", e);
  }
}

// Get Users
export async function getUsers() {
  try {
    const querySnapshot = await getDocs(collection(firebaseDB, "usuarios"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error al obtener los usuarios: ", e);
    return [];
  }
}

// Get User by ID
export async function getUserById(userId: string) {
  try {
    const userRef = doc(firebaseDB, "usuarios", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      console.log("No se encontró el usuario");
      return null;
    }
  } catch (e) {
    console.error("Error al obtener el usuario: ", e);
    return null;
  }
}

// Update User
export async function updateUser(userId: string, updatedData: any) {
  try {
    const userRef = doc(firebaseDB, "usuarios", userId);
    await updateDoc(userRef, updatedData);
    console.log("Usuario actualizado con éxito");
  } catch (e) {
    console.error("Error al actualizar el usuario: ", e);
  }
}

// Delete User
export async function deleteUser(userId: string) {
  try {
    const userRef = doc(firebaseDB, "usuarios", userId);
    await deleteDoc(userRef);
    console.log("Usuario eliminado con éxito");
  } catch (e) {
    console.error("Error al eliminar el usuario: ", e);
  }
}