import { Timestamp } from 'firebase/firestore';

export type Shift = {
    id: string;
    shiftId: string;
    start: string;
    end: string;
    length: number;
    serviceId: string;
    maxReservations: number;
};

export type Availability = {
    id: string;
    day: Timestamp;
    shifts: Shift[];
};