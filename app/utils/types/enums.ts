
export enum UserType {
  PROFESSIONAL = "professional",
  CLIENT = "client"
}

export enum PaymentMethod {
    PER_HOUR = 'per hour',
    PER_PROJECT = 'per project',
  }
  
export enum PriceType {
  FIXED = 'fixed',
  TO_BE_DEFINED = 'to be defined',
  RANGE = 'range',
}

export enum PaymentType {
  NO_PAYMENT = 'no payment',
  PARTIAL = 'partial',
  TOTAL = 'total',
}

export enum ServiceLocationModality {
  HOME_DELIVERY = 'home_delivery',
  REMOTE = 'remote',
  PHYSICAL_COMMERCE = 'physical commerce',
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum NotificationType {
  NEW_RESERVATION = 'new reservation',
  RESERVATION_CONFIRMATION = 'reservation confirmation',
  RESERVATION_CANCELLATION = 'reservation cancellation',
  RESERVATION_REMINDER = 'reservation reminder',
  RESERVATION_NEW_REVIEW = 'reservation new review',
  PROFILE_VIEW = 'profile view',
  PAYMENT_CONFIRMATION = 'payment confirmation',
}

export enum NotificationStatus {
  READ = 'read',
  UNREAD = 'unread',
}