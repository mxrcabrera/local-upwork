"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Dialog, DialogTitle, DialogContent, Typography, CircularProgress } from '@mui/material';
import { getServiceByID, updateService } from '../../utils/repositories/serviceRepository';
import { Service } from '../../utils/types/serviceTypes';
import { PaymentMethod, PriceType, ServiceLocationModality } from '../../utils/types/enums';
import EntityForm from '../forms/EntityForm';

const EditServiceComponent: React.FC = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchService = async () => {
      if (serviceId) {
        try {
          const fetchedService = await getServiceByID(serviceId as string);
          setService(fetchedService);
        } catch (error) {
          console.error("Error fetching service:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchService();
  }, [serviceId]);

  const handleSubmit = async (data: Omit<Service, 'id' | 'professionalId'>) => {
    if (service) {
      setSaving(true);
      try {
        await updateService(service.id, { ...service, ...data });
        router.push('/servicios'); // Redirige a la lista de servicios después de guardar
      } catch (error) {
        console.error("Error updating service:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return <CircularProgress className="text-white" />;
  }

  if (!service) {
    return (
      <Typography variant="h6" color="textSecondary" align="center">
        No se encontró el servicio.
      </Typography>
    );
  }

  return (
    <Dialog
      open={true}
      onClose={() => router.push('/servicios')}
      PaperProps={{
        style: {
          backgroundColor: '#1f1f1f',
          color: '#ffffff',
        },
      }}
    >
      <DialogTitle className="bg-gray-800">
        <div className="text-3xl font-bold text-center bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
          Editar Servicio
        </div>
      </DialogTitle>
      <DialogContent className="bg-gray-800">
        <EntityForm
          defaultValues={service}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/servicios')}
          fields={[
            { name: 'title', label: 'Título del Servicio', type: 'text' },
            { name: 'description', label: 'Descripción del Servicio', type: 'text' },
            { name: 'paymentMethod', label: 'Método de Pago', type: 'select', options: [
              { value: PaymentMethod.PER_HOUR, label: 'Por Hora' },
              { value: PaymentMethod.PER_PROJECT, label: 'Por Proyecto' }
            ]},
            { name: 'priceType', label: 'Tipo de Precio', type: 'select', options: [
              { value: PriceType.FIXED, label: 'Fijo' },
              { value: PriceType.RANGE, label: 'Rango' },
              { value: PriceType.TO_BE_DEFINED, label: 'A Definir' }
            ]},
            { name: 'serviceLocationModality', label: 'Modalidad de Servicio', type: 'select', options: [
              { value: ServiceLocationModality.HOME_DELIVERY, label: 'A Domicilio' },
              { value: ServiceLocationModality.REMOTE, label: 'Remoto' },
              { value: ServiceLocationModality.PHYSICAL_COMMERCE, label: 'Comercio Físico' }
            ]},
            { name: 'category', label: 'Categoría', type: 'text' },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceComponent;