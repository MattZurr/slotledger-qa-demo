export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface CreateBookingInput {
  roomId: number;
  userId: number;
  date: string;
  startTime: string;
  endTime: string;
}