import { Timestamp } from 'firebase/firestore';
import { UserType } from '../types/enums';

export interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  registerDate: Timestamp;
  lastLoginDate: Timestamp;
  location: string;
  phoneNumber?: string;
  profilePhoto?: string;
}

export interface TimestampLocalType {
  seconds: number;
  nanoseconds: number;
}