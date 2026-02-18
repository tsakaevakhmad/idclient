/**
 * Service for fetching geolocation data by IP address
 * Uses ipapi.co free API (no key required, HTTPS, 1 000 req/day)
 */

export interface GeolocationData {
  country?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
  org?: string;
  as?: string;
  query?: string;
}

class GeolocationService {
  private readonly API_URL = 'https://ipapi.co';
  private cache: Map<string, GeolocationData> = new Map();

  /**
   * Get geolocation data for an IP address
   */
  async getLocationByIP(ipAddress: string): Promise<GeolocationData | null> {
    try {
      // Check cache first
      if (this.cache.has(ipAddress)) {
        return this.cache.get(ipAddress) || null;
      }

      const response = await fetch(`${this.API_URL}/${ipAddress}/json/`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.error('Geolocation API error:', data.reason);
        return null;
      }

      // Map ipapi.co fields to our interface
      const result: GeolocationData = {
        country: data.country_name,
        regionName: data.region,
        city: data.city,
        zip: data.postal,
        lat: data.latitude,
        lon: data.longitude,
        timezone: data.timezone,
        org: data.org,
        as: data.asn,
        query: data.ip,
      };

      // Cache the result
      this.cache.set(ipAddress, result);

      return result;
    } catch (error) {
      console.error('Error fetching geolocation:', error);
      return null;
    }
  }

  /**
   * Format location string from geolocation data
   */
  formatLocation(data: GeolocationData | null): string {
    if (!data) return 'Unknown';

    const parts: string[] = [];

    if (data.city) parts.push(data.city);
    if (data.regionName) parts.push(data.regionName);
    if (data.country) parts.push(data.country);

    return parts.length > 0 ? parts.join(', ') : 'Unknown';
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const geolocationService = new GeolocationService();
export default geolocationService;
