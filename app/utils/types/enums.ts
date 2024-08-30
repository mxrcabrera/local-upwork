// tipoUsuario.ts
export enum TipoUsuario {
  PROFESIONAL = "profesional",
  CLIENTE = "cliente"
}

// modalidadPago.ts
export enum ModalidadPago {
    POR_HORA = 'por hora',
    POR_PROYECTO = 'por proyecto',
  }
  
// tipoPrecio.ts
export enum TipoPrecio {
  FIJO = 'fijo',
  A_DEFINIR = 'a definir',
  RANGO = 'rango',
}

// tipoPago.ts
export enum TipoPago {
  SIN_PAGO = 'sin pago',
  PARCIAL = 'parcial',
  TOTAL = 'total',
}

// modalidadLocacionServicio.ts
export enum ModalidadLocacionServicio {
  A_DOMICILIO = 'A domicilio',
  REMOTO = 'remoto',
  COMERCIO_FISICO = 'comercio físico',
}

// estadoReserva.ts
export enum EstadoReserva {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  COMPLETADA = 'completada',
}

// tipoNotificacion.ts
export enum TipoNotificacion {
  NUEVA_RESERVA = 'nueva reserva',
  CONFIRMACION_RESERVA = 'confirmación reserva',
  CANCELACION_RESERVA = 'cancelación reserva',
  RECORDATORIO_RESERVA = 'recordatorio reserva',
  NUEVA_RESEÑA_RECIBIDA = 'nueva reseña recibida',
  VISTA_DE_PERFIL = 'vista de perfil',
  CONFIRMACION_DE_PAGO = 'confirmación de pago',
}

// estadoNotificacion.ts
export enum EstadoNotificacion {
  LEIDA = 'leída',
  NO_LEIDA = 'no leída',
}