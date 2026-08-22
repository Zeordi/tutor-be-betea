await fetch(`${API_URL}/teachers/profile/location`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    latitude: 9.03,
    longitude: 38.74,
  }),
});
