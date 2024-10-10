"use client";

import React, { useEffect, useState } from 'react';
import ProfessionalCalendarComponent from '../../../components/calendar/ProfessionalCalendarComponent';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { fetchUserProfile, onAuthStateChanged } from '../../../libs/firebase/auth';

const ProfessionalAvailabilityPage: React.FC = () => {
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        setProfessionalId(profile.professionalId);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="p-6 min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto">
          <ProfessionalCalendarComponent
            professionalId={professionalId || ''}
            serviceId={''} // Pass the appropriate serviceId if needed
          />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default ProfessionalAvailabilityPage;