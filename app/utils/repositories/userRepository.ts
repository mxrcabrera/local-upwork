import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { User } from '../types/userTypes';
import { UserType } from '../types/enums';
import { v4 as uuidv4 } from 'uuid';

function isUser(obj: any): obj is User {
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    (obj.userType === UserType.PROFESSIONAL || obj.userType === UserType.CLIENT) &&
    obj.registerDate instanceof Timestamp &&
    obj.lastLoginDate instanceof Timestamp &&
    typeof obj.location === 'string' &&
    (typeof obj.phoneNumber === 'string' || obj.phoneNumber === undefined) &&
    (typeof obj.profilePhoto === 'string' || obj.profilePhoto === undefined)
  );
}

// Create User
export async function createUser(userData: User): Promise<void> {
  try {
    const userWithId = { ...userData, id: uuidv4() };
    await addDoc(collection(firebaseDB, "usuarios"), userWithId);
    console.log("Usuario creado con éxito");
  } catch (e) {
    console.error("Error al crear el usuario: ", e);
  }
}

// Get Users
export async function getUsers(): Promise<User[]> {
  try {
    const querySnapshot = await getDocs(collection(firebaseDB, "usuarios"));
    return querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        const userData = {
          id: doc.id,
          ...data,
          registerDate: data.registerDate instanceof Timestamp ? data.registerDate : Timestamp.fromDate(new Date(data.registerDate)),
          lastLoginDate: data.lastLoginDate instanceof Timestamp ? data.lastLoginDate : Timestamp.fromDate(new Date(data.lastLoginDate))
        };
        if (isUser(userData)) {
          return userData;
        }
        console.warn(`Documento con ID ${doc.id} no es un Usuario válido`);
        return null;
      })
      .filter((user): user is User => user !== null);
  } catch (e) {
    console.error("Error al obtener los usuarios: ", e);
    return [];
  }
}