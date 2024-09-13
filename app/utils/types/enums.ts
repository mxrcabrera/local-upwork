
export enum UserType {
  PROFESSIONAL = "Profesional",
  CLIENT = "Cliente"
}

export enum PaymentMethod {
    PER_HOUR = 'Por hora',
    PER_PROJECT = 'Por proyecto',
  }
  
export enum PriceType {
  FIXED = 'Fijo',
  TO_BE_DEFINED = 'A definir',
  RANGE = 'Rango',
}

export enum PaymentType {
  NO_PAYMENT = 'Sin pago',
  PARTIAL = 'Parcial',
  TOTAL = 'Total',
}

export enum ServiceLocationModality {
  HOME_DELIVERY = 'A domicilio',
  REMOTE = 'Remoto',
  PHYSICAL_COMMERCE = 'Comercio físico',
}

export enum ReservationStatus {
  PENDING = 'Pendiente',
  CONFIRMED = 'Confirmada',
  CANCELLED = 'Cancelada',
  COMPLETED = 'Completada',
}

export enum NotificationType {
  NEW_RESERVATION = 'Nueva reserva',
  RESERVATION_CONFIRMATION = 'Confirmación de Reserva',
  RESERVATION_CANCELLATION = 'Cancelación de Reserva',
  RESERVATION_REMINDER = 'Recordatorio de Reserva',
  RESERVATION_NEW_REVIEW = 'Nueva Reseña en Reserva',
  PROFILE_VIEW = 'Perfil Visto',
  PAYMENT_CONFIRMATION = 'Confirmación de Pago',
}

export enum NotificationStatus {
  READ = 'Leída',
  UNREAD = 'No leída',
}