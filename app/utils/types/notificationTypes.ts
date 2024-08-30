import { Timestamp } from 'firebase/firestore';
import { TipoNotificacion, EstadoNotificacion } from './enums';

export interface Notificacion {
  id: string;
  usuarioId: string;
  mensaje: string;
  tipo: TipoNotificacion;
  fecha: Timestamp;
  estado: EstadoNotificacion;
}