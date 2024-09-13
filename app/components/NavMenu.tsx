"use client"

import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import { signOut } from "../libs/firebase/auth";
import { useSessionContext } from "./providers/SessionProvider";

export default function NavMenu() {
    const { session } = useSessionContext();

    return (
        <header>
            <nav>
                <ul className="flex justify-evenly">
                    <li><Link href={"/"}>Inicio</Link></li>
                    <li><Link href={"/servicios"}>Encuentra profesionales</Link></li>
                    <li><Link href={"/profesionales"}>Encuentra trabajo</Link></li>
                    {session ? (
                        <li><button onClick={() => signOut()}>Cerrar sesión</button></li>
                    ) : (
                        <>
                            <li><Link href={"/ingresar"}>Ingresar</Link></li>
                            <li><Link href={"/registrarse"}>Registrarse</Link></li>
                        </>
                    )}
                    <li><ThemeSwitch /></li>
                </ul>
            </nav>
        </header>
    )
}