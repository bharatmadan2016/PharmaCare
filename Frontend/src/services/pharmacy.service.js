import { handleResponse } from "./auth.service.js";

const BASE_URL = import.meta.env.VITE_VENDOR_API_URL || "http://localhost:8001";

export async function fetchNearbyPharmacies(lng, lat, maxDistance = 10000) {
    const response = await fetch(`${BASE_URL}/api/v1/pharmacies/nearby?longitude=${lng}&latitude=${lat}&maxDistance=${maxDistance}`);
    return handleResponse(response);
}

export async function compareMedicinePrices(name, lng, lat) {
    let url = `${BASE_URL}/api/v1/pharmacies/compare?medicineName=${name}`;
    if (lng && lat) url += `&longitude=${lng}&latitude=${lat}`;
    const response = await fetch(url);
    return handleResponse(response);
}

export async function placeOrder(orderData) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${BASE_URL}/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
}
