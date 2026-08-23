const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface UpdateLocationPayload {
  latitude: number;
  longitude: number;
}

export async function updateTeacherLocation(
  token: string,
  coords: UpdateLocationPayload = { latitude: 9.03, longitude: 38.74 },
) {
  const response = await fetch(`${API_URL}/teachers/profile/location`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coords),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update location: ${response.statusText}`);
  }

  return response.json();
}
