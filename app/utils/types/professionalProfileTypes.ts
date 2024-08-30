import { Timestamp } from "firebase/firestore";

export interface PerfilProfesional {
    id: string;
    usuarioId: string;
    skills: string[];
    rating: number;
    trabajosRealizados: any[];
    verificadoPremium: boolean;
    serviciosOfrecidos: string[];
    biografia?: string;
    disponibilidad: Disponibilidad[];
  }
  
  export interface Disponibilidad {
    dia: Timestamp;
    turnos: Turno[];
  }

  export interface Turno {
    turnoId: string;
    inicio: string;
    fin: string;
    duracion: number;
    servicioId: string;
  }