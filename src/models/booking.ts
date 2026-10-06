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

export type CreateBookingResult =
  | { success: true; booking: Booking }
  | {
      success: false;
      error: "NO_PERMISSION" | "ROOM_NOT_FOUND" | "INVALID_TIME" | "ROOM_OVERLAP";
    };