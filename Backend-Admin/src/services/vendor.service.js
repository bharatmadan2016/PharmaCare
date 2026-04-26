import axios from "axios";
import { ApiError } from "../utils/apiError.js";

const API_ROOT = process.env.VENDOR_API_ROOT || "http://localhost:8001/api/v1";
const VENDOR_BASE_URL = `${API_ROOT}/vendors`;
const ORDER_BASE_URL = `${API_ROOT}/orders`;
const DASHBOARD_BASE_URL = `${API_ROOT}/dashboard`;

const internalHeaders = () => ({
  "x-api-key": process.env.INTERNAL_API_KEY,
});

const wrapVendorError = (error, fallbackMessage) => {
  throw new ApiError(
    error.response?.status || 500,
    error.response?.data?.message || fallbackMessage,
  );
};

const isNetworkFailure = (error) =>
  error.code === "ECONNREFUSED" ||
  error.code === "ENOTFOUND" ||
  error.code === "ECONNRESET" ||
  error.message?.includes("connect") ||
  error.message?.includes("Network");

const getAllVendors = async () => {
  try {
    const response = await axios.get(VENDOR_BASE_URL, {
      headers: internalHeaders(),
    });

    return response.data.data ?? [];
  } catch (error) {
    if (isNetworkFailure(error)) {
      return [];
    }
    wrapVendorError(error, "Failed to fetch vendors");
  }
};

const approveVendor = async (vendorId) => {
  try {
    const response = await axios.patch(
      `${VENDOR_BASE_URL}/${vendorId}/approve`,
      {},
      {
        headers: internalHeaders(),
      },
    );

    return response.data.data;
  } catch (error) {
    wrapVendorError(error, "Failed to approve vendor");
  }
};

const getAllOrders = async () => {
  try {
    const response = await axios.get(ORDER_BASE_URL, {
      headers: internalHeaders(),
    });
    return response.data.data ?? [];
  } catch (error) {
    if (isNetworkFailure(error)) {
      return [];
    }
    wrapVendorError(error, "Failed to fetch orders");
  }
};

const getVendorDashboardStats = async () => {
  try {
    const response = await axios.get(`${DASHBOARD_BASE_URL}/stats`, {
      headers: internalHeaders(),
    });
    return response.data.data ?? {};
  } catch (error) {
    if (isNetworkFailure(error)) {
      return {};
    }
    wrapVendorError(error, "Failed to fetch dashboard stats");
  }
};

export { approveVendor, getAllOrders, getAllVendors, getVendorDashboardStats };
