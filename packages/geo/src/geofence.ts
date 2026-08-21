import { getDistanceMeters } from "./distance";

export const GEOFENCE_RADIUS_METERS = 150;

/**
 * Returns true if the check-in location is within the allowed geofence.
 */
export function isWithinGeofence(
  checkInLat: number,
  checkInLng: number,
  parentLat: number,
  parentLng: number,
  radiusMeters: number = GEOFENCE_RADIUS_METERS,
): boolean {
  const distance = getDistanceMeters(
    checkInLat,
    checkInLng,
    parentLat,
    parentLng,
  );

  return distance <= radiusMeters;
}

export function getGeofenceStatus(
  checkInLat: number,
  checkInLng: number,
  parentLat: number,
  parentLng: number,
) {
  const distance = getDistanceMeters(
    checkInLat,
    checkInLng,
    parentLat,
    parentLng,
  );

  return {
    distanceMeters: Math.round(distance),
    isVerified: distance <= GEOFENCE_RADIUS_METERS,
    requiresManualConfirmation: distance > GEOFENCE_RADIUS_METERS,
  };
}
