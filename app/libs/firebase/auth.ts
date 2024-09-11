import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

import { firebaseAuth } from './config';
import { removeSession } from '@/app/actions/auth-actions';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import { firebaseDB } from './config';
import { saveUser } from '@/app/utils/repositories/userRepository';

export enum AUTH_ERROR_CODES {
  UNKNOWN_ERROR = 'auth/unknown-error',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
  USER_NOT_FOUND = 'auth/user-not-found',
  INVALID_CREDENTIALS = 'auth/invalid-credential',
  OPERATION_NOT_ALLOWED = 'auth/operation-not-allowed',
  INTERNAL_ERROR = 'auth/internal-error',
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
}

export function onAuthStateChanged(callback: (authUser: User | null) => void) {
  return _onAuthStateChanged(firebaseAuth, callback);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(firebaseAuth, provider);
    if (!result || !result.user) {
      throw new Error('Google sign in failed');
    }
    await saveUser(result.user.uid);
    return result;
  } catch (error) {
    console.error('Error signing in with Google', error);
    return null;
  }
}

export async function signOut() {
  try {
    await firebaseAuth.signOut();
    removeSession()
  } catch (error) {
    console.error('Error signing out with Google', error);
  }
}

export async function registerWithEmail(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await saveUser(userCredential.user.uid);
    return { errorCode: '', message: 'Inicio de sesión exitoso', uid: userCredential.user.uid }
  } catch (error: any) {
    if (error.code === AUTH_ERROR_CODES.EMAIL_ALREADY_IN_USE) {
      return ({ errorCode: AUTH_ERROR_CODES.EMAIL_ALREADY_IN_USE, message: 'El correo electrónico ya está registrado', uid: null })
    } else if (error.code === AUTH_ERROR_CODES.TOO_MANY_REQUESTS) {
      return ({ errorCode: AUTH_ERROR_CODES.TOO_MANY_REQUESTS, message: 'Demasiados intentos de registro seguidos. Por favor, inténtalo más tarde.', uid: null })
    }
    else {
      return ({ errorCode: AUTH_ERROR_CODES.UNKNOWN_ERROR, message: 'Error desconocido', uid: null })
    }
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    await saveUser(userCredential.user.uid);
    return { errorCode: '', message: 'Inicio de sesión exitoso', uid: userCredential.user.uid }
  } catch (error: any) {
    if (error.code === AUTH_ERROR_CODES.INVALID_CREDENTIALS) {
      return ({ errorCode: AUTH_ERROR_CODES.INVALID_CREDENTIALS, message: 'Correo electrónico o contraseña incorrectos', uid: null })
    } else if (error.code === AUTH_ERROR_CODES.TOO_MANY_REQUESTS) {
      return ({ errorCode: AUTH_ERROR_CODES.TOO_MANY_REQUESTS, message: 'Demasiados intentos de inicio de sesión. Por favor, inténtalo más tarde.', uid: null })
    } else if (error.code === AUTH_ERROR_CODES.USER_NOT_FOUND) {
      return ({ errorCode: AUTH_ERROR_CODES.USER_NOT_FOUND, message: 'El usuario no existe', uid: null })
    } else {
      return ({ errorCode: AUTH_ERROR_CODES.UNKNOWN_ERROR, message: 'Error desconocido', uid: null })
    }
  }
}

export async function recoverPassword(email: string) {
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
    return { errorCode: '', message: 'En caso de que el email exista, se ha enviado un correo electrónico para restablecer tu contraseña', uid: null }

  } catch (error: any) {
    alert('Hubo un error al enviar el correo de recuperación. Por favor, verifica tu dirección de correo electrónico.')

    return { errorCode: AUTH_ERROR_CODES.UNKNOWN_ERROR, message: 'Error desconocido', uid: null }
  }
}

export async function fetchUserProfile(uid: string): Promise<{ clientId: string | null, professionalId: string | null }> {
  try {
    const userDoc = await getDoc(doc(firebaseDB, 'users', uid));
    if (!userDoc.exists()) {
      console.error("No se encontró el usuario.");
      return { clientId: null, professionalId: null };
    }

    const userData = userDoc.data();
    const userType = userData.userType;

    if (userType === 'professional') {
      const professionalQuery = query(
        collection(firebaseDB, 'professionalProfiles'),
        where('userId', '==', uid)
      );
      const professionalSnapshot = await getDocs(professionalQuery);
      if (!professionalSnapshot.empty) {
        const professionalData = professionalSnapshot.docs[0].data();
        return { clientId: null, professionalId: professionalData.userId };
      }
    } else if (userType === 'client') {
      return { clientId: uid, professionalId: null };
    }

    return { clientId: null, professionalId: null };
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return { clientId: null, professionalId: null };
  }
}