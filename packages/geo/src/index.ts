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

export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3;
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