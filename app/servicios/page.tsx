"use client";

import React from 'react';
import ServicesListComponent from '../components/service/ServicesComponent';

const ServicesPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <ServicesListComponent />
    </div>
  );
};

export default ServicesPage;