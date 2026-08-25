export const GEOFENCE_RADIUS_METERS = 150;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeofenceStatus {
  distanceMeters: number;
  isVerified: boolean;
  requiresManualConfirmation: boolean;
}

/**
 * Calculates distance in meters between two coordinates (Haversine formula).
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Alias for matching.service.ts
export const getDistanceMeters = calculateDistanceMeters;

/**
 * Verifies if check-in is within geofence boundaries.
 */
export function getGeofenceStatus(
  teacherLat: number,
  teacherLng: number,
  parentLat: number,
  parentLng: number,
  maxRadiusMeters: number = GEOFENCE_RADIUS_METERS,
): GeofenceStatus {
  const distanceMeters = calculateDistanceMeters(
    teacherLat,
    teacherLng,
    parentLat,
    parentLng,
  );

  const isVerified = distanceMeters <= maxRadiusMeters;

  return {
    distanceMeters,
    isVerified,
    requiresManualConfirmation: !isVerified,
  };
}

/**
 * Compatibility helper used by attendance.service.ts
 */
export function isWithinGeofence(
  userLat: number,
  userLng: number,
  centerLat: number,
  centerLng: number,
  radiusMeters: number = GEOFENCE_RADIUS_METERS,
) {
  const distanceMeters = calculateDistanceMeters(
    userLat,
    userLng,
    centerLat,
    centerLng,
  );

  return {
    distanceMeters,
    isWithin: distanceMeters <= radiusMeters,
  };
}