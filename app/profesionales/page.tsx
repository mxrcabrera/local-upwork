import React from 'react';
import ProfessionalProfilesComponent from '../components/professionalProfile/ProfessionalProfilesComponent';

const ProfessionalProfilesPage: React.FC = () => {
  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto">
        <ProfessionalProfilesComponent />
      </div>
    </div>
  );
};

export default ProfessionalProfilesPage;