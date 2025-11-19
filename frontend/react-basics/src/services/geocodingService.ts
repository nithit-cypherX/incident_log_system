// File: src/services/geocodingService.ts
/**
 * What it does:
 * Handles all API (network) requests for geocoding.
 * (Converts text addresses into map coordinates).
 *
 * How it works:
 * - Implements the "Service Pattern" (Guide Part 3).
 * - Calls the public Nominatim API (from OpenStreetMap).
 * - It uses 'axios' directly, NOT our 'apiClient', because
 * this is a separate, public API with a different URL.
 *
 * How it connects:
 * - 'IncidentFormPage.tsx' will use this to find coordinates
 * for a new address.
 */

import axios from "axios";
import { config } from "../config"; // Get the URL from our config

/**
 * The shape of the response we get from the Nominatim API.
 * We only care about these fields.
 */
type GeocodingResult = {
  lat: string;
  lon: string;
  display_name: string;
};

/**
 * The data our app needs from the service.
 */
export type Coordinates = {
  lat: number;
  lon: number;
};

export const geocodingService = {
  /**
   * Fetches coordinates for a given address string.
   */
  getCoordsFromAddress: async (address: string): Promise<Coordinates> => {
    try {
      const { data } = await axios.get<GeocodingResult[]>(
        `${config.geocodingApiUrl}/search`,
        {
          params: {
            q: address,     // The address string to search for
            format: "json", // We want a JSON response
            limit: 1,       // We only want the best (1) result
          },
        }
      );

      // Check if the API found a result
      if (data && data.length > 0) {
        const result = data[0];
        // Convert string coordinates to numbers
        return {
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
        };
      }

      // If no result, throw an error
      throw new Error("Address not found.");
    } catch (err: any) {
      // Re-throw the error so the component can handle it
      throw new Error(err.message || "Failed to fetch coordinates.");
    }
  },
};