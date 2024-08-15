import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";

export default function NavMenu() {
    return (
        <header>
            <nav>
                <ul className="flex justify-evenly">
                    <li><Link href={"/"}>Inicio</Link></li>
                    <li><Link href={"/profesionales"}>Encuentra profesionales</Link></li>
                    <li><Link href={"/trabajo"}>Encuentra trabajo</Link></li>
                    <li><Link href={"/ingreso"}>Ingreso</Link></li>
                    <li><ThemeSwitch /></li>
                </ul>
            </nav>
        </header>
    )
}