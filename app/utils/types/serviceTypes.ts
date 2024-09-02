import { Timestamp } from 'firebase/firestore';
import { PaymentMethod, PriceType, PaymentType, ServiceLocationModality } from './enums';

export interface Service {
  id: string;
  title: string;
  description: string;
  paymentMethod: PaymentMethod;
  priceType: PriceType;
  paymentType: PaymentType;
  professionalId: string;
  category: string;
  requiredInformation?: string;
  serviceLocationModality: ServiceLocationModality;
  portfolio?: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  serviceId: string;
  clientId: string;
  calification: number;
  comment: string;
  date: Timestamp;
}
