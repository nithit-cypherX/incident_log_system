// File: src/lib/utils.ts
/**
 * What it does:
 * Holds global, reusable helper functions.
 *
 * How it works:
 * - 'formatDate' is the same function from your 'IncidentDashboard.tsx',
 * but now it's in a central place.
 * - 'cn' is a utility from the guide (Part 8) for merging Tailwind classes.
 * (You'll need to `npm install clsx tailwind-merge`)
 *
 * How it connects:
 * - Any component that needs to format a date can import 'formatDate'.
 * - Any component that needs to conditionally apply Tailwind classes
 * can import 'cn'.
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
 * Moved from 'IncidentDashboardPage.tsx'.
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
 * Moved from 'NewIncidentPage.tsx'.
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
 * Moved from 'NewIncidentPage.tsx'.
 */
export const getCurrentDateTime = () => {
  const now = new Date();
  // Adjust for local timezone
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const date = now.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].substring(0, 5); // "HH:MM"
  return { date, time };
};
// 🌟 --- NEW --- 🌟
/**
 * Formats a status string (e.g., "on_duty" or "available")
 * into a capitalized, human-readable format (e.g., "On Duty", "Available").
 *
 * What it does:
 * - Replaces underscores with spaces.
 * - Capitalizes the first letter of each word.
 *
 * How it works:
 * - Uses regex to split the string, map over words, and rejoin.
 *
 * @param statusText The raw status string.
 * @returns A formatted, capitalized string.
 */
export const formatStatusText = (statusText: string): string => {
  if (!statusText) return "N/A";
  return statusText
    .split("_") // Splits "on_duty" into ["on", "duty"]
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // "on" -> "On", "duty" -> "Duty"
    .join(" "); // Joins ["On", "Duty"] into "On Duty"
};
// 🌟 --- END NEW --- 🌟