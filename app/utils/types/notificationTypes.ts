import { Timestamp } from 'firebase/firestore';
import { NotificationType, NotificationStatus } from './enums';

export interface Notification {
  id: string;
  userId: string;
  message: string;
  notificationType: NotificationType;
  date: Timestamp;
  status: NotificationStatus;
}