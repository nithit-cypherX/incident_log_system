// File: src/hooks/useDebounce.ts
/**
 * What it does:
 * A custom hook to delay updating a value (Guide Part 10).
 *
 * How it works:
 * - It takes a 'value' and a 'delay' (e.g., 500ms).
 * - It only returns the 'value' after the user
 * has stopped typing for the specified 'delay'.
 *
 * How it connects:
 * - 'IncidentFormPage.tsx' will use this to "debounce"
 * the address input before calling the geocoding service.
 */

import { useState, useEffect } from "react";

export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timer. This function will run AFTER the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // This is the cleanup function.
    // It runs every time 'value' or 'delay' changes.
    // It clears the *previous* timer.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run if value or delay changes

  return debouncedValue;
};