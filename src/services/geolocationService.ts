/**
 * Service for fetching geolocation data by IP address
 * Uses ip-api.com free API (no key required, 45 requests per minute)
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
  private readonly API_URL = 'http://ip-api.com/json';
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

      const response = await fetch(
        `${this.API_URL}/${ipAddress}?fields=status,message,country,regionName,city,zip,lat,lon,timezone,isp,org,as,query`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'fail') {
        console.error('Geolocation API error:', data.message);
        return null;
      }

      // Cache the result
      this.cache.set(ipAddress, data);

      return data;
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
