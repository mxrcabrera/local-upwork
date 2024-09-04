"use client"

import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { sendPasswordResetEmail } from 'firebase/auth';
import { firebaseAuth } from '../libs/firebase/config';
import Link from 'next/link';
import { recoverPassword } from '../libs/firebase/auth';

export default function RecuperarClave() {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const handleRecoverPassword = async () => {
        const result = await recoverPassword(email);

        if (result.errorCode === '') {
            setMensaje(result.message);
            setError('');

        } else {
            setError('Hubo un error al enviar el correo de recuperación. Por favor, verifica tu dirección de correo electrónico.');
            setMensaje('');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
                    Recuperar Contraseña
                </h2>
                <div className="space-y-6">
                    <TextField
                        id="email"
                        type='email'
                        fullWidth
                        required
                        label="Correo Electrónico"
                        variant="outlined"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <button
                        onClick={() => handleRecoverPassword()}
                        className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:focus:ring-offset-gray-800"
                        disabled={email === ''}
                    >
                        Enviar correo de recuperación
                    </button>

                    {mensaje && (
                        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            <p>{mensaje}</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            <p>{error}</p>
                        </div>
                    )}

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        ¿Recordaste tu contraseña? <Link className='hover:underline' href="/ingresar">Inicia sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
