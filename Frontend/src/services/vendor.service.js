import { handleResponse, normalizeSessionPayload } from "./auth.service.js";

const VENDOR_API_URL = import.meta.env.VITE_VENDOR_API_URL || "http://localhost:8001";
const VENDOR_STORAGE_KEYS = ["vendorUser", "vendorAccessToken"];

function getVendorAccessToken() {
  return localStorage.getItem("vendorAccessToken");
}

function getVendorAuthHeaders() {
  const token = getVendorAccessToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function loginVendor(email, password) {
  const response = await fetch(`${VENDOR_API_URL}/api/v1/vendors/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
}

async function registerVendor(payload) {
  const response = await fetch(`${VENDOR_API_URL}/api/v1/vendors/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

async function fetchVendorDashboardStats() {
  const response = await fetch(`${VENDOR_API_URL}/api/v1/dashboard/stats`, {
    headers: getVendorAuthHeaders(),
  });
  return handleResponse(response);
}

async function fetchVendorProducts() {
  const response = await fetch(`${VENDOR_API_URL}/api/v1/products`, {
    headers: getVendorAuthHeaders(),
  });
  return handleResponse(response);
}

async function createVendorProduct(payload) {
  const response = await fetch(`${VENDOR_API_URL}/api/v1/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getVendorAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

async function updateVendorProduct(id, payload) {
  const response = await fetch(`${VENDOR_API_URL}/api/v1/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getVendorAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

async function deleteVendorProduct(id) {
  const response = await fetch(`${VENDOR_API_URL}/api/v1/products/${id}`, {
    method: "DELETE",
    headers: getVendorAuthHeaders(),
  });

  return handleResponse(response);
}

async function fetchVendorOrders() {
  const response = await fetch(`${VENDOR_API_URL}/api/v1/orders`, {
    headers: getVendorAuthHeaders(),
  });
  return handleResponse(response);
}

function saveVendorSession(data) {
  const normalized = normalizeSessionPayload(data);
  localStorage.setItem("vendorUser", JSON.stringify(normalized.user));
  localStorage.setItem("vendorAccessToken", normalized.accessToken);
}

function getStoredVendor() {
  const rawVendor = localStorage.getItem("vendorUser");

  if (!rawVendor) {
    return null;
  }

  try {
    return JSON.parse(rawVendor);
  } catch (error) {
    clearVendorSession();
    return null;
  }
}

function clearVendorSession() {
  VENDOR_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

function logoutVendor() {
  clearVendorSession();
}

async function updateVendorProfile(payload) {
  const response = await fetch(`${VENDOR_API_URL}/api/v1/vendors/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getVendorAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export {
  clearVendorSession,
  createVendorProduct,
  deleteVendorProduct,
  fetchVendorDashboardStats,
  fetchVendorOrders,
  fetchVendorProducts,
  getStoredVendor,
  loginVendor,
  logoutVendor,
  registerVendor,
  saveVendorSession,
  updateVendorProduct,
  updateVendorProfile,
};
