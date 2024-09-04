import {
  type User,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { firebaseAuth } from './config';
import { getUserProfile, getProfessionalProfile } from '../../utils/repositories/userRepository';
import { UserType } from '../../utils/types/enums';

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
    return result.user.uid;
  } catch (error) {
    console.error('Error signing in with Google', error);
  }
}

export async function signOutWithGoogle() {
  try {
    await firebaseAuth.signOut();
  } catch (error) {
    console.error('Error signing out with Google', error);
  }
}

export async function registerWithEmail(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    return userCredential.user.uid;
  } catch (error) {
    console.error('Error registering with email', error);
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return userCredential.user.uid;
  } catch (error) {
    console.error('Error signing in with email', error);
  }
}

export async function fetchUserProfileType() {
  try {
    const user = await new Promise<User | null>((resolve) => {
      onAuthStateChanged((user) => resolve(user));
    });

    if (user) {
      const userProfile = await getUserProfile(user.uid);
      const professionalProfile = await getProfessionalProfile(user.uid);

      const clientId = userProfile && userProfile.userType === UserType.CLIENT ? user.uid : null;
      const professionalId = professionalProfile ? professionalProfile.id : null;

      return { clientId, professionalId };
    } else {
      return { clientId: null, professionalId: null };
    }
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    throw error;
  }
}