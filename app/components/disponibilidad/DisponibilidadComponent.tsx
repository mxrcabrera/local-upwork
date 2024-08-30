import React, { useState, useEffect } from 'react';
import { getDocs, collection } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { Disponibilidad } from '../../utils/types';

interface DisponibilidadProps {
  professionalId: string;
}

const DisponibilidadComponent: React.FC<DisponibilidadProps> = ({ professionalId }) => {
  const [availability, setAvailability] = useState<Disponibilidad[]>([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      const querySnapshot = await getDocs(collection(firebaseDB, `profesionales/${professionalId}/disponibilidad`));
      const availabilityData = querySnapshot.docs.map(doc => doc.data() as Disponibilidad);
      setAvailability(availabilityData);
    };

    fetchAvailability();
  }, [professionalId]);

  return (
    <div>
      {availability.map((day, index) => (
        <div key={index}>
          <h3>{day.dia}</h3>
          {day.turnos.map((turno, idx) => (
            <p key={idx}>
              Turno ID: {turno.turnoId} - {turno.inicio} - {turno.fin} ({turno.duracion} horas)
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DisponibilidadComponent;