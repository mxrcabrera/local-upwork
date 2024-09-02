import React, { useState, useEffect } from 'react';
import { getDocs, collection } from "firebase/firestore";
import { firebaseDB } from "../../libs/firebase/config";
import { Availability } from '../../utils/types/availabilityTypes';

interface AvailabilityProps {
  professionalId: string;
}

const AvailabilityComponent: React.FC<AvailabilityProps> = ({ professionalId }) => {
  const [availability, setAvailability] = useState<Availability[]>([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      const querySnapshot = await getDocs(collection(firebaseDB, `profesionales/${professionalId}/disponibilidad`));
      const availabilityData = querySnapshot.docs.map(doc => doc.data() as Availability);
      setAvailability(availabilityData);
    };

    fetchAvailability();
  }, [professionalId]);

  return (
    <div>
      {availability.map((day, index) => (
        <div key={index}>
          <h3>{day.day.toDate().toLocaleDateString()}</h3>
          {day.shifts.map((shift, idx) => (
            <p key={idx}>
              Turno ID: {shift.shiftId} - {shift.start} - {shift.end} ({shift.length} horas)
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AvailabilityComponent;