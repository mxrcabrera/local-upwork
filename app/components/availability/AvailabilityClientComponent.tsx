"use client";

import React from 'react';
import BaseAvailabilityComponent from './BaseAvailabilityComponent';

interface AvailabilityClientProps {
  clientId: string;
  professionalId: string;
}

const AvailabilityClientComponent: React.FC<AvailabilityClientProps> = ({ clientId, professionalId }) => {
  return <BaseAvailabilityComponent userId={professionalId} userType="client" />;
};

export default AvailabilityClientComponent;