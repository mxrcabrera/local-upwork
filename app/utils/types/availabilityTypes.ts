import { Timestamp } from 'firebase/firestore';

export type Turno = {
    turnoId: string;
    inicio: string;
    fin: string;
    duracion: number;
    servicioId: string;
    maxReservas: number;
};

export type Disponibilidad = {
    dia: Timestamp;
    turnos: Turno[];
};