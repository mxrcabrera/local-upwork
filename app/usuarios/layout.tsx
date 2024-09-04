import { useSessionContext } from "../components/providers/SessionProvider";

export default function UsersLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { session } = useSessionContext();


    return (
        <>
            {children}
        </>
    );
}
