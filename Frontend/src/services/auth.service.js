const DEFAULT_ADMIN_API_URL = import.meta.env.DEV
  ? "http://localhost:8005"
  : "https://amused-learning-production-5d8d.up.railway.app";

const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_ADMIN_API_URL).replace(/\/+$/, "");

console.log("Using Admin API URL:", API_URL);

const AUTH_STORAGE_KEYS = ["user", "accessToken"];

async function handleResponse(response) {
  const text = await response.text();
  let body = {};

  if (text) {
    try {
      body = JSON.parse(text);
    } catch (parseError) {
      throw new Error(`Server returned ${response.status}: ${text}`);
    }
  }

  if (!response.ok) {
    throw new Error(body.message || body.error || `Request failed with status ${response.status}`);
  }

  return body.data;
}

function normalizeSessionPayload(data) {
  if (data?.user) {
    return {
      user: data.user,
      accessToken: data.accessToken,
    };
  }

  if (data?.vendor) {
    return {
      user: {
        ...data.vendor,
        role: "Vendor",
        name: data.vendor.ownerName || data.vendor.pharmacyName,
      },
      accessToken: data.accessToken,
    };
  }

  return data;
}

async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/api/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
}

async function registerUser(payload) {
  const response = await fetch(`${API_URL}/api/v1/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

async function logoutUser() {
  const token = localStorage.getItem("accessToken");
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/v1/users/logout`, {
    method: "POST",
    headers,
  });

  return handleResponse(response);
}

function saveAuthSession(data) {
  const normalized = normalizeSessionPayload(data);
  localStorage.setItem("user", JSON.stringify(normalized.user));
  localStorage.setItem("accessToken", normalized.accessToken);
}

function getStoredUser() {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    clearAuthSession();
    return null;
  }
}

function clearAuthSession() {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

export {
  API_URL,
  clearAuthSession,
  getStoredUser,
  handleResponse,
  loginUser,
  logoutUser,
  normalizeSessionPayload,
  registerUser,
  saveAuthSession,
};
