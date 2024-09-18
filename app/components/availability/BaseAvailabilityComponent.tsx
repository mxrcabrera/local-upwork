"use client";

import React, { useState, useEffect } from 'react';
import { Grid, Typography, Card, CardContent, Button } from '@mui/material';
import { getAvailability } from '../../utils/repositories/availabilityRepository';
import { Availability } from '../../utils/types/availabilityTypes';

interface BaseAvailabilityProps {
  userId: string;
  userType: 'professional' | 'client';
}

const BaseAvailabilityComponent: React.FC<BaseAvailabilityProps> = ({ userId, userType }) => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchAvailability(userId);
    }
  }, [userId]);

  const fetchAvailability = async (userId: string) => {
    try {
      const fetchedAvailability = await getAvailability(userId);
      setAvailability(fetchedAvailability);
    } catch (error) {
      console.error("Error al obtener disponibilidad:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900 rounded">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-violet-500 to-green-400 bg-clip-text text-transparent">
        Disponibilidad
      </h1>
      <Grid container spacing={3}>
        {availability.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center">
            No hay disponibilidad en este momento.
          </Typography>
        ) : (
          availability.map((av: Availability) => (
            <Grid item xs={12} sm={6} md={4} key={av.id}>
              <Card className="bg-gray-800 text-white h-48">
                <CardContent>
                  <Typography variant="h5" component="div">
                    {av.day.toDate().toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" className="text-gray-300">
                    {av.shifts.map((shift, idx) => (
                      <div key={idx}>
                        {shift.start} - {shift.end} ({shift.length} mins)
                      </div>
                    ))}
                  </Typography>
                </CardContent>
                {userType === 'client' && (
                  <Button size="small" className="text-blue-400 hover:text-blue-300">
                    Reservar
                  </Button>
                )}
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default BaseAvailabilityComponent;