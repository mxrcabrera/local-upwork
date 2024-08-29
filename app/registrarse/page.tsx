"use client"

import { signInWithGoogle } from '../libs/firebase/auth';
import { createSession } from '../actions/auth-actions';
import { useState } from 'react';
import TextField from '@mui/material/TextField';

export default function Ingreso() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatedPassword, setRepeatedPassword] = useState('')

    const handleGoogleSignIn = async () => {
        const userUid = await signInWithGoogle();
        if (userUid) {
            await createSession(userUid);
        }
    };

    const handleEmailSignUp = async () => {
        // const userUid = await signInWithGoogle();
        // if (userUid) {
        //     await createSession(userUid);
        // }
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" /></svg>
                    <span>Regístrate con Google</span>
                </button>
                <div className="relative flex items-center justify-center w-full">
                    <span className="absolute px-2 text-gray-500 bg-white dark:bg-gray-800">
                        o
                    </span>
                    <hr className="w-full border-gray-300 dark:border-gray-700" />
                </div>
                <form onSubmit={handleEmailSignUp} className="space-y-6">

                    <TextField id="email" type='email' fullWidth required label="Correo Electrónico" variant="outlined" value={email} onChange={e => setEmail(e.target.value)} />
                    <TextField fullWidth required type='password' id="password" label="Contraseña" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} />
                    <TextField fullWidth required type='password' id="repeated-password" label="Repite la contraseña" variant="outlined" value={repeatedPassword} onChange={e => setRepeatedPassword(e.target.value)} />

                    <button
                        type="submit"
                        className="disabled:bg-gray-200 disabled:text-gray-400 w-full py-2 px-4 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-offset-gray-800"
                        disabled={password === '' || password !== repeatedPassword || email === ''}
                    >
                        Regístrate
                    </button>
                </form>
            </div>
        </div>
    );
}
