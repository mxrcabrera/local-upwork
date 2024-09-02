"use client";

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { getServices, createService, updateService, deleteService } from '../../utils/repositories/serviceRepository';
import { Service, Review } from '../../utils/types/serviceTypes';
import { PaymentMethod, PriceType, PaymentType, ServiceLocationModality } from '../../utils/types/enums';

const ServicesListComponent: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    paymentMethod: PaymentMethod.PER_HOUR,
    priceType: PriceType.FIXED,
    serviceLocationModality: ServiceLocationModality.PHYSICAL_COMMERCE,
    professionalId: '',
    category: '',
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedServices = await getServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleCreate = async () => {
    if (newService.title && newService.description) {
      try {
        const serviceToCreate: Service = {
          ...newService,
          id: '',
          paymentType: PaymentType.NO_PAYMENT,
          reviews: [],
        };
        const createdService = await createService(serviceToCreate);
        if (createdService) {
          setServices([...services, createdService]);
        }
        setNewService({
          title: '',
          description: '',
          paymentMethod: PaymentMethod.PER_HOUR,
          priceType: PriceType.FIXED,
          serviceLocationModality: ServiceLocationModality.PHYSICAL_COMMERCE,
          professionalId: '',
          category: '',
        });
        setShowCreateForm(false);
      } catch (error) {
        console.error("Error al crear el servicio:", error);
      }
    } else {
      console.error("Por favor, completa todos los campos requeridos.");
    }
  };

  const handleEdit = async (id: string) => {
    const updatedService = services.find(service => service.id === id);
    if (updatedService) {
      updatedService.description = "Descripción actualizada";
      await updateService(id, updatedService);
      setServices(services.map(service => (service.id === id ? updatedService : service)));
    }
  };

  const handleDelete = async (id: string) => {
    await deleteService(id);
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 rounded">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
        Servicios
      </h1>
      {showCreateForm ? (
        <Dialog open={showCreateForm} onClose={() => {}} className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true"></div>
        <Dialog.Panel className="relative z-20 max-w-md w-full mx-auto bg-gray-800 p-6 rounded shadow-lg">
          <Dialog.Title as="h2" className="text-3xl font-bold text-white text-center mb-8 bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
            Crear Nuevo Servicio
          </Dialog.Title>
          <div className="flex flex-col space-y-6">
            <input
              type="text"
              placeholder="Título del Servicio"
              value={newService.title}
              onChange={(e) => setNewService({ ...newService, title: e.target.value })}
              className="p-3 rounded bg-gray-700 text-white border border-gray-600"
            />
            <textarea
              placeholder="Descripción del Servicio"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              className="p-3 rounded bg-gray-700 text-white border border-gray-600"
            />
            <select
              value={newService.paymentMethod}
              onChange={(e) => setNewService({ ...newService, paymentMethod: e.target.value as PaymentMethod })}
              className="p-3 rounded bg-gray-700 text-white border border-gray-600"
            >
              <option value={PaymentMethod.PER_HOUR}>Por Hora</option>
              <option value={PaymentMethod.PER_PROJECT}>Por Proyecto</option>
            </select>
            <select
              value={newService.priceType}
              onChange={(e) => setNewService({ ...newService, priceType: e.target.value as PriceType })}
              className="p-3 rounded bg-gray-700 text-white border border-gray-600"
            >
              <option value={PriceType.FIXED}>Fijo</option>
              <option value={PriceType.RANGE}>Rango</option>
              <option value={PriceType.TO_BE_DEFINED}>A Definir</option>
            </select>
            <select
              value={newService.serviceLocationModality}
              onChange={(e) => setNewService({ ...newService, serviceLocationModality: e.target.value as ServiceLocationModality })}
              className="p-3 rounded bg-gray-700 text-white border border-gray-600"
            >
              <option value={ServiceLocationModality.HOME_DELIVERY}>A Domicilio</option>
              <option value={ServiceLocationModality.REMOTE}>Remoto</option>
              <option value={ServiceLocationModality.PHYSICAL_COMMERCE}>Comercio Físico</option>
            </select>
            <input
              type="text"
              placeholder="Categoría"
              value={newService.category}
              onChange={(e) => setNewService({ ...newService, category: e.target.value })}
              className="p-3 rounded bg-gray-700 text-white border border-gray-600"
            />
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleCreate}
                className="w-full bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow"
              >
                Crear Servicio
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="w-full bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow"
              >
                Volver
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
      
      ) : (
        <div>
          <div className="flex justify-end mb-6">
            <button 
              onClick={() => setShowCreateForm(true)} 
              className="bg-gradient-to-r from-purple-400 to-green-300 hover:from-purple-500 hover:to-green-400 text-violet-950 font-semibold py-2 px-4 rounded shadow"
            >
              Nuevo Servicio
            </button>
          </div>
          <div className="overflow-x-auto rounded-md">
            <table className="min-w-full bg-gray-800 shadow-md rounded-md">
              <thead>
                <tr className="bg-gray-700 text-white uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Título</th>
                  <th className="py-3 px-6 text-left">Descripción</th>
                  <th className="py-3 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-300 text-sm font-light">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      Cargando servicios...
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      No hay servicios disponibles en este momento.
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{service.title}</td>
                      <td className="py-3 px-6 text-left">{service.description}</td>
                      <td className="py-3 px-6 text-center">
                        <button onClick={() => handleEdit(service.id)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded mr-2 shadow">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(service.id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded shadow">
                          Borrar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesListComponent;