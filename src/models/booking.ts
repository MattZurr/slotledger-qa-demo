export type id = number;
export type roomId = number;
export type userId = number;
export type date = Date;
export type startTime = string;
export type endTime = string;
export type createdAt = string;

export interface Booking {
  id: id;
  roomId: roomId;
  userId: userId;
  date: date;
  startTime: startTime;
  endTime: endTime;
  createdAt: createdAt;
}
