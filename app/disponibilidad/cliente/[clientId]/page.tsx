"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AvailabilityClientComponent from '../../../components/availability/AvailabilityClientComponent';
import { fetchUserProfile } from '../../../libs/firebase/auth';

const AvailabilityClientPage: React.FC = () => {
  const { clientId } = useParams();
  const clientIdString = Array.isArray(clientId) ? clientId[0] : clientId || '';
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (clientIdString) {
        const profile = await fetchUserProfile(clientIdString);
        setProfessionalId(profile?.professionalId || null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [clientIdString]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto">
        <AvailabilityClientComponent
          clientId={clientIdString}
          professionalId={professionalId || ''}
        />
      </div>
    </div>
  );
};

export default AvailabilityClientPage;