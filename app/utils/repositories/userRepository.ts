import { collection, doc, getDoc, setDoc, addDoc, updateDoc, getDocs, deleteDoc, Timestamp } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { User } from '../types/userTypes';
import { UserType } from '../types/enums';
import { v4 as uuidv4 } from 'uuid';

function isUser(obj: any): obj is User {
  return (
    typeof obj.id === 'string' &&
    (typeof obj.name === 'string' || obj.name === null) &&
    (typeof obj.email === 'string' || obj.email === null) &&
    (obj.userType === UserType.PROFESSIONAL || obj.userType === UserType.CLIENT) &&
    obj.registerDate instanceof Timestamp &&
    obj.lastLoginDate instanceof Timestamp &&
    typeof obj.location === 'string' &&
    (typeof obj.phoneNumber === 'string' || obj.phoneNumber === null || obj.phoneNumber === undefined) &&
    (typeof obj.profilePhoto === 'string' || obj.profilePhoto === null || obj.profilePhoto === undefined)
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

// Save user ID
export async function saveUser(uid: string, email?: string): Promise<void> {
  try {
    const userRef = doc(firebaseDB, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email: email, 
        displayName: null,
        userType: null,
        registerDate: Timestamp.now(),
        lastLoginDate: Timestamp.now(),
        location: '',
        phoneNumber: null,
        profilePhoto: null,
      });
      console.log("User data saved to Firestore");
    } else {
      await updateDoc(userRef, {
        lastLoginDate: Timestamp.now(),
      });
      console.log("User already exists in Firestore, last login date updated");
    }
  } catch (error) {
    console.error("Error saving user data to Firestore:", error);
    throw error;
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

// Get Professional Users
export async function getProfessionalUsers(): Promise<User[]> {
  try {
    const allUsers = await getUsers();
    return allUsers.filter(user => user.userType === UserType.PROFESSIONAL);
  } catch (e) {
    console.error("Error al obtener los usuarios profesionales: ", e);
    return [];
  }
}

// Get User Profile by User ID
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const userDocRef = doc(firebaseDB, 'usuarios', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      const userData = {
        id: userDoc.id,
        ...data,
        registerDate: data.registerDate instanceof Timestamp ? data.registerDate : Timestamp.fromDate(new Date(data.registerDate)),
        lastLoginDate: data.lastLoginDate instanceof Timestamp ? data.lastLoginDate : Timestamp.fromDate(new Date(data.lastLoginDate))
      };
      if (isUser(userData)) {
        return userData;
      }
    }
    return null;
  } catch (e) {
    console.error("Error al obtener el perfil del usuario: ", e);
    return null;
  }
}

// Get Professional Profile by User ID
export async function getProfessionalById(userId: string): Promise<User | null> {
  try {
    const userDocRef = doc(firebaseDB, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();

      const userData: User = {
        id: userDoc.id,
        name: data.name || null,
        email: data.email || null,
        userType: data.userType,
        registerDate: data.registerDate instanceof Timestamp ? data.registerDate : Timestamp.fromDate(new Date(data.registerDate)),
        lastLoginDate: data.lastLoginDate instanceof Timestamp ? data.lastLoginDate : Timestamp.fromDate(new Date(data.lastLoginDate)),
        location: data.location || '',
        phoneNumber: data.phoneNumber || null,
        profilePhoto: data.profilePhoto || null
      };

      if (isUser(userData) && (userData.userType === UserType.PROFESSIONAL)) {
        return userData;
      }
    }
    return null;
  } catch (e) {
    console.error("Error al obtener el usuario profesional por ID: ", e);
    return null;
  }
}

// Update User
export async function updateUser(userId: string, updatedData: Partial<User>): Promise<void> {
  try {
    const userRef = doc(firebaseDB, "usuarios", userId);
    await updateDoc(userRef, updatedData);
    console.log("Usuario actualizado con éxito");
  } catch (e) {
    console.error("Error al actualizar el usuario: ", e);
  }
}

// Delete User
export async function deleteUser(userId: string): Promise<void> {
  try {
    const userRef = doc(firebaseDB, "usuarios", userId);
    await deleteDoc(userRef);
    console.log("Usuario eliminado con éxito");
  } catch (e) {
    console.error("Error al eliminar el usuario: ", e);
  }
}