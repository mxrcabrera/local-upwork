"use client";

import React, { useState } from 'react';
import { signInWithGoogle, signInWithEmail } from '../libs/firebase/auth';
import { createSession } from '../actions/auth-actions';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import UserTypeSelectionDialog from '../components/UserTypeSelectionDialog';
import { User } from 'firebase/auth';
import { getDoc, setDoc, doc, updateDoc, collection } from 'firebase/firestore';
import { firebaseDB } from '../libs/firebase/config';
import { saveUser } from '@/app/utils/repositories/userRepository';

export default function Ingreso() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const checkUserType = async (uid: string) => {
    const userRef = doc(firebaseDB, "users", uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.userType || null;
    }
    return null;
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result && result.user) {
      await saveUser(result.user.uid);
      const userType = await checkUserType(result.user.uid);
      if (!userType) {
        setUser(result.user);
        setDialogOpen(true);
      } else {
        await createSession(result.user.uid);
      }
    }
  };

  const handleUserTypeSelect = async (userType: string) => {
    if (user) {
      const userRef = doc(firebaseDB, "users", user.uid);
      await updateDoc(userRef, { userType });
  
      if (userType === 'professional') {
        const professionalProfileRef = doc(collection(firebaseDB, "professionalProfiles"));
        await setDoc(professionalProfileRef, {
          userId: user.uid,
          skills: [],
          rating: 0,
          jobsDone: [],
          verifiedPremium: false,
          offeredServices: [],
          biography: '',
          availability: [],
        });
        console.log("Professional profile created");
      }
  
      await createSession(user.uid);
      setDialogOpen(false);
    }
  };

  const handleEmailSignIn = async () => {
    const result = await signInWithEmail(email, password);
    if (result.uid) {
      await saveUser(result.uid);
      const userType = await checkUserType(result.uid);
      if (!userType) {
        const user = { uid: result.uid, email };
        setUser(user as User);
        setDialogOpen(true);
      } else {
        await createSession(result.uid);
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
          Ingresa
        </h2>
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full py-2 px-4 space-x-3 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 dark:focus:ring-offset-gray-800"
        >
          <span>Ingresa con Google</span>
        </button>
        <div className="relative flex items-center justify-center w-full">
          <span className="absolute px-2 text-gray-500 bg-white dark:bg-gray-800">
            o
          </span>
          <hr className="w-full border-gray-300 dark:border-gray-700" />
        </div>
        <div className="space-y-6">
          <TextField id="email" type='email' fullWidth required label="Correo Electrónico" variant="outlined" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField fullWidth required type='password' id="password" label="Contraseña" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} />
          <button
            onClick={() => handleEmailSignIn()}
            className="disabled:bg-gray-200 disabled:text-gray-400 w-full py-2 px-4 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-offset-gray-800"
            disabled={password === '' || email === ''}
          >
            Ingresa
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400">¿No tienes una cuenta? <Link className='hover:underline' href="/registrarse">Regístrate</Link></p>
          <p className="text-sm text-gray-500 dark:text-gray-400">¿Olvidaste tu contraseña? <Link className='hover:underline' href="/recuperar-clave">Recuperar contraseña</Link></p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
      <UserTypeSelectionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSelect={handleUserTypeSelect}
      />
    </div>
  );
}