import { Timestamp } from 'firebase/firestore';
import { ModalidadPago, TipoPrecio, TipoPago, ModalidadLocacionServicio } from './enums';

export interface Servicio {
  id: string;
  titulo: string;
  descripcion: string;
  modalidadPago: ModalidadPago;
  tipoPrecio: TipoPrecio;
  tipoPago: TipoPago;
  profesionalId: string;
  categoria: string;
  informacionRequerida?: string;
  modalidadLocacionServicio: ModalidadLocacionServicio;
  portfolio?: string[];
  resenias: Resenia[];
}

export interface Resenia {
  id: string;
  servicioId: string;
  clienteId: string;
  calificacion: number;
  comentario: string;
  fecha: Timestamp;
}
