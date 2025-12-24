// File: src/lib/utils.ts
/**
 * What it does:
 * Holds global, reusable helper functions.
 *
 * 🌟 --- UPDATED --- 🌟
 * Removed 'formatStatusText' as it was based on mock data.
 * Our new database-driven types are already formatted correctly.
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes.
 * From the guide (Part 8) for use with shadcn/ui or custom components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an ISO date string into a "YYYY-MM-DD HH:MM" format.
 */
export const formatDate = (isoString: string) => {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (e) {
    console.error("Invalid date:", isoString);
    return "Invalid Date";
  }
};

/**
 * Formats an ISO string for use in <input type="date"> and <input type="time">.
 */
export const formatISOForInputs = (isoString: string) => {
  if (!isoString) return getCurrentDateTime();
  try {
    const d = new Date(isoString);
    // Adjust for local timezone
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const date = d.toISOString().split("T")[0];
    const time = d.toTimeString().split(" ")[0].substring(0, 5); // "HH:MM"
    return { date, time };
  } catch (e) {
    console.error("Error formatting date:", e);
    return getCurrentDateTime();
  }
};

/**
 * Gets the current date and time for form inputs.
 */
export const getCurrentDateTime = () => {
  const now = new Date();
  // Adjust for local timezone
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].substring(0, 5); // "HH:MM"
  return { date, time };
};

// 🌟 --- REMOVED 'formatStatusText' --- 🌟