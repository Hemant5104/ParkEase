import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Decode JWT payload to get user info (id, email, role)
export function decodeToken(token: string | null): { id?: string; email?: string; role?: string } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const json = JSON.parse(atob(parts[1]));
    return json;
  } catch {
    return null;
  }
}

// Simple localStorage-backed bookings per user
const BOOKINGS_KEY = "myBookings";

type BookingsStore = { [userId: string]: { slotIds: string[] } };

function readBookings(): BookingsStore {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    return raw ? (JSON.parse(raw) as BookingsStore) : {};
  } catch {
    return {};
  }
}

function writeBookings(store: BookingsStore) {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(store));
  } catch {
    // ignore storage errors
  }
}

export function addMyBooking(userId: string, slotId: string) {
  const store = readBookings();
  const current = store[userId]?.slotIds ?? [];
  if (!current.includes(slotId)) {
    store[userId] = { slotIds: [...current, slotId] };
    writeBookings(store);
  }
}

export function getMyBookings(userId: string): string[] {
  const store = readBookings();
  return store[userId]?.slotIds ?? [];
}
