import type { User } from "../models/user";
import type { Room } from "../models/room";
import type { Booking } from "../models/booking";

export function timeValidation(startTime: string, endTime: string): boolean {
  if (
    startTime.length !== 5 ||
    endTime.length !== 5 ||
    startTime[2] !== ":" ||
    endTime[2] !== ":"
  ) {
    return false;
  }
  const startParts = startTime.split(":");
  const endParts = endTime.split(":");
  const twoDigits = /^[0-9]{2}$/;

  if (
    !twoDigits.test(startParts[0]) ||
    !twoDigits.test(startParts[1]) ||
    !twoDigits.test(endParts[0]) ||
    !twoDigits.test(endParts[1])
  ) {
    return false;
  }

  const startHour = Number(startParts[0]);
  const startMinute = Number(startParts[1]);
  const endHour = Number(endParts[0]);
  const endMinute = Number(endParts[1]);
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  if (
    startHour < 0 ||
    startHour > 23 ||
    endHour < 0 ||
    endHour > 23 ||
    startMinute < 0 ||
    startMinute > 59 ||
    endMinute < 0 ||
    endMinute > 59
  ) {
    return false;
  }
  return startTotalMinutes < endTotalMinutes;
}

export function canCreateBooking(user: User): boolean {
  return user.role === "booker";
}

export function roomExists(roomId: number, rooms: Room[]): boolean {
  return rooms.some((room) => room.id === roomId);
}

export function roomOverlap(
  startTime: string,
  endTime: string,
  roomId: number,
  bookings: Booking[],
  date: string,
): boolean {
  return bookings.some((booking) => {
    if (
      booking.roomId !== roomId || 
      booking.date !== date ||
      endTime <= booking.startTime ||
      startTime >= booking.endTime
    ) {
      return false;
    }
    return true;
  });
}
