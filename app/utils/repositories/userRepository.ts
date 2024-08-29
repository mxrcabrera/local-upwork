import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { Usuario } from '../types/userTypes';
import { TipoUsuario } from '../types/enums';

function isUsuario(obj: any): obj is Usuario {
  return (
    typeof obj.id === 'string' &&
    typeof obj.nombre === 'string' &&
    typeof obj.email === 'string' &&
    (obj.tipo === TipoUsuario.PROFESIONAL || obj.tipo === TipoUsuario.CLIENTE) &&
    obj.fechaRegistro instanceof Date &&
    obj.fechaUltimoLogin instanceof Date &&
    typeof obj.ubicacion === 'string' &&
    (typeof obj.telefono === 'string' || obj.telefono === undefined) &&
    (typeof obj.fotoPerfil === 'string' || obj.fotoPerfil === undefined)
  );
}

// Create User
export async function createUser(userData: Usuario) {
  try {
    await addDoc(collection(firebaseDB, "usuarios"), userData);
    console.log("Usuario creado con éxito");
  } catch (e) {
    console.error("Error al crear el usuario: ", e);
  }
}

// Get Users
export async function getUsers(): Promise<Usuario[]> {
  try {
    const querySnapshot = await getDocs(collection(firebaseDB, "usuarios"));
    return querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        // Asegúrate de convertir las fechas correctamente
        const userData = {
          id: doc.id,
          ...data,
          fechaRegistro: new Date(data.fechaRegistro),
          fechaUltimoLogin: new Date(data.fechaUltimoLogin)
        };
        if (isUsuario(userData)) {
          return userData;
        }
        console.warn(`Documento con ID ${doc.id} no es un Usuario válido`);
        return null;
      })
      .filter((user): user is Usuario => user !== null);
  } catch (e) {
    console.error("Error al obtener los usuarios: ", e);
    return [];
  }
}

// Get User by ID
export async function getUserById(userId: string): Promise<Usuario | null> {
  try {
    const userRef = doc(firebaseDB, "usuarios", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      const userData = {
        id: userSnap.id,
        ...data,
        fechaRegistro: new Date(data.fechaRegistro),
        fechaUltimoLogin: new Date(data.fechaUltimoLogin)
      };
      if (isUsuario(userData)) {
        return userData;
      } else {
        console.log("Los datos del usuario no son válidos");
        return null;
      }
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
export async function updateUser(userId: string, updatedData: Partial<Usuario>) {
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