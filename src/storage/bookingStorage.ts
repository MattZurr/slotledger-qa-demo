import type { LoadBookingsResult, Booking, SaveBookingsResult } from "../models/booking";

export function isBooking(value: unknown): value is Booking {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (
    "id" in value &&
    typeof value.id === "number" &&
    "roomId" in value &&
    typeof value.roomId === "number" &&
    "userId" in value &&
    typeof value.userId === "number" &&
    "date" in value &&
    typeof value.date === "string" &&
    "startTime" in value &&
    typeof value.startTime === "string" &&
    "endTime" in value &&
    typeof value.endTime === "string" &&
    "createdAt" in value &&
    typeof value.createdAt === "string"
  );
}

export function loadBookings(): LoadBookingsResult {
  let storedBookings: string | null;
  try {
    storedBookings = localStorage.getItem("slotledger.bookings");
  } catch {
    return { success: false, error: "STORAGE_READ_ERROR" };
  }
  if (storedBookings === null) {
    return { success: true, bookings: [] };
  }
  try {
    const parsedBookings: unknown = JSON.parse(storedBookings);
    if (!Array.isArray(parsedBookings)) {
      return { success: false, error: "INVALID_STORED_DATA" };
    }
    if (parsedBookings.every(isBooking)) {
      return { success: true, bookings: parsedBookings };
    }
  } catch {
    return { success: false, error: "INVALID_STORED_DATA" };
  }
  return { success: false, error: "INVALID_STORED_DATA" };
}

export function saveBookings(bookings: Booking[]): SaveBookingsResult {   
    try {
      localStorage.setItem("slotledger.bookings", JSON.stringify(bookings));
      return { success: true }
    } catch {
      return { success: false, error: "STORAGE_WRITE_ERROR" };
    }
  }