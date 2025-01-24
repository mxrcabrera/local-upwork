'use client'

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '../../components/providers/SessionProvider';
import { useUser } from '@/app/components/providers/UserProvider';
import { Card, CardContent, CardHeader } from '@mui/material';
import { Settings, Users, Briefcase, Clock, MapPin, Phone } from 'lucide-react';
import { UserType } from '@/app/utils/types';
import { fetchUserProfile } from '@/app/libs/firebase/auth';
import ProfessionalProfileInfo from '@/app/components/professionalProfile/ProfessionalProfileInfo';



const AdminPage = () => {
  const { session } = useSessionContext();
  const router = useRouter();
  const { user, loading, error } = useUser();

  useEffect(() => {
    if (!session) {
      router.push('/ingresar');
    }
  }, [session, router]);

  if (!session || loading) {
    return null;
  }

  const navigationCards = [
    {
      title: 'Configuración',
      icon: <Settings className="h-6 w-6" />,
      path: '/usuarios/configuracion',
      description: 'Gestiona la configuración de tu cuenta'
    },
    {
      title: 'Profesionales',
      icon: <Users className="h-6 w-6" />,
      path: '/profesionales',
      description: 'Administra los profesionales'
    },
    {
      title: 'Servicios',
      icon: <Briefcase className="h-6 w-6" />,
      path: '/servicios',
      description: 'Gestiona los servicios disponibles'
    }
  ];

  // Defined outside the component to avoid type errors
  const registeredAt: any = user?.registerDate

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-28">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenido {user?.name}
          </h1>
          <p className="">
            Panel de administración
          </p>
        </div>

        {user?.userType == UserType.PROFESSIONAL ?
          <Suspense fallback={<div>Cargando perfil profesional...</div>}>
            <ProfessionalProfileInfo uid={session} />
          </Suspense>
          :
          <p>
            No tienes un perfil profesional actualmente
          </p>
        }

        <p>{user?.userType === UserType.PROFESSIONAL ? UserType.PROFESSIONAL : UserType.CLIENT}</p>

        {/* User Info Card */}
        <Card className="mb-8   border-gray-700">
          <CardHeader>
            <h2>Información del Usuario</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 " />
                Registrado: {user?.registerDate
                  ? new Date(registeredAt).toLocaleDateString()
                  : 'Fecha de registro no disponible'}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 " />
                <span>{user?.location}</span>
              </div>
              {user?.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 " />
                  <span>{user.phoneNumber}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map((card) => (
            <Card
              key={card.path}
              className="  border-gray-700 cursor-pointer hover:bg-gray-300 transition-colors"
              onClick={() => router.push(card.path)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  {card.icon}
                  <h2>{card.title}</h2>
                </div>
              </CardHeader>
              <CardContent>
                <p className="">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;