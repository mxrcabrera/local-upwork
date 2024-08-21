import React, { useState, useEffect } from 'react';
import { createReservation, getServices } from '../../utils/firestoreDB';

const ReservaComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [servicios, setServicios] = useState<{ id: string, titulo: string }[]>([]);
  const [selectedServicioId, setSelectedServicioId] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      const fetchedServices = await getServices();
      setServicios(fetchedServices);
    };
    loadServices();
  }, []);

  const handleCreateReservation = async () => {
    if (!selectedServicioId) {
      setError("No hay un servicio seleccionado para la reserva.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await createReservation(selectedServicioId); // Usa el ID del servicio seleccionado
      alert("Reserva creada con éxito");
    } catch (e) {
      setError("Error al crear la reserva. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <select
        value={selectedServicioId || ''}
        onChange={(e) => setSelectedServicioId(e.target.value)}
      >
        <option value="">Selecciona un servicio</option>
        {servicios.map((servicio) => (
          <option key={servicio.id} value={servicio.id}>
            {servicio.titulo}
          </option>
        ))}
      </select>
      <button onClick={handleCreateReservation} disabled={loading}>
        {loading ? "Creando..." : "Crear Reserva"}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ReservaComponent;
