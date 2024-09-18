"use client";

import React, { useEffect, useState } from 'react';
import AvailabilityClientComponent from '../components/availability/AvailabilityClientComponent';
import AvailabilityProfessionalComponent from '../components/availability/AvailabilityProfessionalComponent';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { fetchUserProfile, onAuthStateChanged } from '../libs/firebase/auth';
import { UserType } from '@/app/utils/types/enums';
import { Dayjs } from 'dayjs';

const DisponibilidadPage: React.FC = () => {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const profile = await fetchUserProfile(user.uid);
          setClientId(profile.clientId);
          setProfessionalId(profile.professionalId);

          if (profile.professionalId) {
            setUserType(UserType.PROFESSIONAL);
          } else if (profile.clientId) {
            setUserType(UserType.CLIENT);
          }
        } catch (error) {
          console.error("Error fetching user profiles:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDateChange = (date: Dayjs | null) => {
    console.log("Fecha seleccionada:", date);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="p-6 min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto">
          {userType === UserType.CLIENT ? (
            <AvailabilityClientComponent
              clientId={clientId || ''}
              professionalId={professionalId || ''}
            />
          ) : (
            <AvailabilityProfessionalComponent
              professionalId={professionalId || ''}
            />
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default DisponibilidadPage;