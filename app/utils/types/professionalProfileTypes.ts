import { Timestamp } from "firebase/firestore";
import { Availability } from './availabilityTypes';

export interface ProfessionalProfile {
    id: string;
    userId: string;
    skills: string[];
    rating: number | '';
    jobsDone: any[];
    verifiedPremium: boolean | '';
    offeredServices: string[];
    biography?: string;
    availability: Availability[];
  }