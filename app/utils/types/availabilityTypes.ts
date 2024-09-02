import { Timestamp } from 'firebase/firestore';

export type Shift = {
    shiftId: string;
    start: string;
    end: string;
    length: number;
    serviceId: string;
    maxReservations: number;
};

export type Availability = {
    day: Timestamp;
    shifts: Shift[];
};