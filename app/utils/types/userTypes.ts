import { Timestamp } from 'firebase/firestore';
import { TipoUsuario } from '../types/enums';

export interface Usuario {
    id: string;
    nombre: string;
    email: string;
    tipo: TipoUsuario;
    fechaRegistro: Timestamp;
    fechaUltimoLogin: Timestamp;
    ubicacion: string;
    telefono?: string;
    fotoPerfil?: string;
  }