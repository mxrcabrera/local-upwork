import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { Usuario } from '../types/userTypes';
import { TipoUsuario } from '../types/enums';

function isUsuario(obj: any): obj is Usuario {
  return (
    typeof obj.id === 'string' &&
    typeof obj.nombre === 'string' &&
    typeof obj.email === 'string' &&
    (obj.tipo === TipoUsuario.PROFESIONAL || obj.tipo === TipoUsuario.CLIENTE) &&
    obj.fechaRegistro instanceof Timestamp &&
    obj.fechaUltimoLogin instanceof Timestamp &&
    typeof obj.ubicacion === 'string' &&
    (typeof obj.telefono === 'string' || obj.telefono === undefined) &&
    (typeof obj.fotoPerfil === 'string' || obj.fotoPerfil === undefined)
  );
}

// Get Users
export async function getUsers(): Promise<Usuario[]> {
  try {
    const querySnapshot = await getDocs(collection(firebaseDB, "usuarios"));
    return querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        // Ensure the dates are Timestamps
        const userData = {
          id: doc.id,
          ...data,
          fechaRegistro: data.fechaRegistro instanceof Timestamp ? data.fechaRegistro : Timestamp.fromDate(new Date(data.fechaRegistro)),
          fechaUltimoLogin: data.fechaUltimoLogin instanceof Timestamp ? data.fechaUltimoLogin : Timestamp.fromDate(new Date(data.fechaUltimoLogin))
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