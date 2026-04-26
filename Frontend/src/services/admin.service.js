import { API_URL, handleResponse } from "./auth.service.js";

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

async function fetchAdminDashboard() {
  const response = await fetch(`${API_URL}/api/v1/admin/dashboard`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

async function fetchAdminUsers() {
  const response = await fetch(`${API_URL}/api/v1/admin/users`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

async function deleteAdminUser(userId) {
  const response = await fetch(`${API_URL}/api/v1/admin/users/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

async function fetchVendorsForApproval() {
  const response = await fetch(`${API_URL}/api/v1/admin/vendors`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

async function approveVendor(vendorId) {
  const response = await fetch(`${API_URL}/api/v1/admin/vendors/${vendorId}/approve`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

async function fetchAdminOrders() {
  const response = await fetch(`${API_URL}/api/v1/admin/orders`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

async function fetchAdminPayments() {
  const response = await fetch(`${API_URL}/api/v1/admin/payments`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

async function fetchAdminReports() {
  const response = await fetch(`${API_URL}/api/v1/admin/reports`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export {
  approveVendor,
  fetchAdminDashboard,
  fetchAdminOrders,
  fetchAdminPayments,
  fetchAdminReports,
  fetchAdminUsers,
  deleteAdminUser,
  fetchVendorsForApproval,
};
