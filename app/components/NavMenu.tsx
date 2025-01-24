"use client"

import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import { signOut } from "../libs/firebase/auth";
import { useSessionContext } from "./providers/SessionProvider";
import { useState } from "react";
import { THEMES, useTheme } from "./providers/ThemeProvider";

export default function NavMenu() {
    const { session } = useSessionContext();
    const [isOpen, setIsOpen] = useState(false);

    const { theme } = useTheme();

    return (
        <header className="w-full z-20 fixed bg-white/50 backdrop-blur-lg ">

            <div className="flex items-center justify-between m-auto px-8 py-4 max-w-5xl">

                <img src="/next.svg" className="w-32" />

                <nav className={`${isOpen ? "dark:bg-gray-900" : "translate-x-full"} 
            md:flex md:translate-x-0 md:flex-row md:h-auto md:pt-0 md:bg-transparent md:text-center md:text-lg md:relative md:bg-red-400 md:ml-4 md:overflow-y-visible md:items-center md:justify-center
            transition-transform flex flex-col bg-white  pt-20 text-xl overflow-visible right-0 top-0 w-10/12 h-screen z-10 fixed overflow-y-auto font-semibold
            `}>

                    <Link className="border-b-2 border-gray-200 py-4 px-4 hover:text-principal md:border-b-0 flex items-center justify-center hover:bg-gray-100 rounded-lg" href={"/"}>Inicio</Link>
                    <Link className="border-b-2 border-gray-200 py-4 px-4 hover:text-principal md:border-b-0 flex items-center justify-center hover:bg-gray-100 rounded-lg" href={"/servicios"}>Encuentra profesionales</Link>
                    <Link className="border-b-2 border-gray-200 py-4 px-4 hover:text-principal md:border-b-0 flex items-center justify-center hover:bg-gray-100 rounded-lg" href={"/profesionales"}>Encuentra trabajo</Link>
                    {session ? (
                        <button onClick={() => signOut()}>Cerrar sesión</button>
                    ) : (
                        <>
                            <Link className="border-b-2 border-gray-200 py-4 px-4 hover:text-principal md:border-b-0 flex items-center justify-center hover:bg-gray-100 rounded-lg" href={"/ingresar"}>Ingresar</Link>
                            <Link className="border-b-2 border-gray-200 py-4 px-4 hover:text-principal md:border-b-0 flex items-center justify-center hover:bg-gray-100 rounded-lg" href={"/registrarse"}>Registrarse</Link>
                        </>
                    )}
                </nav>

                <ThemeSwitch />

                <button className={`z-10 pl-4 md:hidden`} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme === THEMES.dark ? '#ffffff' : "#000000"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme === THEMES.dark ? '#ffffff' : "#000000"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>
                    }
                </button>

            </div>

        </header>
    )
}