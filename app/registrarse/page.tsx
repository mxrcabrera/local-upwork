"use client";

import React, { useState } from 'react';
import { signInWithGoogle, registerWithEmail } from '../libs/firebase/auth';
import { createSession } from '../actions/auth-actions';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import UserTypeSelectionDialog from '../components/UserTypeSelectionDialog';
import { getDoc, setDoc, doc, updateDoc, collection } from 'firebase/firestore';
import { firebaseDB } from '../libs/firebase/config';
import { saveUser } from '@/app/utils/repositories/userRepository';

export default function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [repeatedPasswordTouched, setRepeatedPasswordTouched] = useState(false);

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
      setUserId(result.user.uid);
      const userType = await checkUserType(result.user.uid);
      if (!userType) {
        setDialogOpen(true);
      } else {
        await createSession(result.user.uid);
      }
    }
  };

  const handleEmailSignUp = async () => {
    if (password !== repeatedPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    const result = await registerWithEmail(email, password);
    if (result.uid) {
      await saveUser(result.uid);
      const userType = await checkUserType(result.uid);
      if (!userType) {
        setUserId(result.uid);
        setDialogOpen(true);
      } else {
        await createSession(result.uid);
      }
    } else {
      setError(result.message);
    }
  };

  const handleUserTypeSelect = async (userType: string) => {
    if (userId) {
      const userRef = doc(firebaseDB, "users", userId);
      await updateDoc(userRef, { userType });
  
      if (userType === 'professional') {
        const professionalProfileRef = doc(collection(firebaseDB, "professionalProfiles"));
        await setDoc(professionalProfileRef, {
          userId: userId,
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
  
      setDialogOpen(false);
      await createSession(userId);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!passwordTouched) {
      setPasswordTouched(true);
    }
  };

  const handleRepeatedPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatedPassword(e.target.value);
    if (!repeatedPasswordTouched) {
      setRepeatedPasswordTouched(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
          Registro
        </h2>
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full py-2 px-4 space-x-3 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 dark:focus:ring-offset-gray-800"
        >
          <span>Regístrate con Google</span>
        </button>
        <div className="relative flex items-center justify-center w-full">
          <span className="absolute px-2 text-gray-500 bg-white dark:bg-gray-800">
            o
          </span>
          <hr className="w-full border-gray-300 dark:border-gray-700" />
        </div>
        <div className="space-y-6">
          <TextField id="email" type='email' fullWidth required label="Correo Electrónico" variant="outlined" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField
            fullWidth
            required
            type='password'
            id="password"
            label="Contraseña"
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => setPasswordTouched(true)}
            error={passwordTouched && password.length < 8}
            helperText={passwordTouched && password.length < 8 ? 'La contraseña debe tener como mínimo 8 caracteres' : ''}
          />
          <TextField
            fullWidth
            required
            type='password'
            id="repeated-password"
            label="Repite la contraseña"
            variant="outlined"
            value={repeatedPassword}
            onChange={handleRepeatedPasswordChange}
            onBlur={() => setRepeatedPasswordTouched(true)}
            error={repeatedPasswordTouched && password !== repeatedPassword}
            helperText={repeatedPasswordTouched && password !== repeatedPassword ? 'Las contraseñas no coinciden' : ''}
          />
          <button
            onClick={handleEmailSignUp}
            className="disabled:bg-gray-200 disabled:text-gray-400 w-full py-2 px-4 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-offset-gray-800"
            disabled={password === '' || password !== repeatedPassword || email === '' || password.length < 8}
          >
            Regístrate
          </button>
          <p className='text-sm text-gray-500 dark:text-gray-400'>¿Ya tienes una cuenta? <Link className='hover:underline' href={"/ingresar"}>Ingresa</Link></p>
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