"use client"

import { useUserContext } from '../components/providers/UserProvider';
import { useUserSession } from '../hooks/useUserSession';
import { signInWithGoogle, signOutWithGoogle } from '../libs/firebase/auth';
import { createSession, removeSession } from '../actions/auth-actions';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function Registrarse() {

    const [password, setPassword] = useState('')
    const [repeatedPassword, setRepeatedPassword] = useState('')

    const { session } = useUserContext();
    const userSessionId = useUserSession(session);

    const handleGoogleSignIn = async () => {
        const userUid = await signInWithGoogle();
        if (userUid) {
            await createSession(userUid);
        }
    };

    const handleSignOut = async () => {
        await signOutWithGoogle();
        await removeSession();
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
                    {/* <FaGoogle /> */}
                    <span>Regístrate con Google</span>
                </button>
                <div className="relative flex items-center justify-center w-full">
                    <span className="absolute px-2 text-gray-500 bg-white dark:bg-gray-800">
                        o
                    </span>
                    <hr className="w-full border-gray-300 dark:border-gray-700" />
                </div>
                <form className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            className="w-full px-3 py-2 mt-1 text-gray-800 border rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-offset-gray-800"
                        />
                        <TextField  InputProps={{
        className: 'dark:text-white dark:bg-gray-800',
      }} id="outlined-basic" label="Outlined" variant="outlined" />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            required
                            className="w-full px-3 py-2 mt-1 text-gray-800 border rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-offset-gray-800"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-offset-gray-800"
                        disabled={password === '' || password !== repeatedPassword}
                    >
                        Regístrate
                    </button>
                </form>
            </div>
        </div>
    );
}

