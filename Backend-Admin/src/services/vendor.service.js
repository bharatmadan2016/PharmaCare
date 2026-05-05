import axios from "axios";
import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";

const isProductionRuntime =
  process.env.NODE_ENV === "production" || Boolean(process.env.RAILWAY_ENVIRONMENT);

const DEFAULT_VENDOR_API_ROOT =
  isProductionRuntime
    ? "https://pharmacare-production-a16b.up.railway.app/api/v1"
    : "http://localhost:8001/api/v1";

const normalizeApiRoot = (value = DEFAULT_VENDOR_API_ROOT) => {
  const trimmedValue = value.trim().replace(/\/+$/, "") || DEFAULT_VENDOR_API_ROOT;

  return trimmedValue.endsWith("/api/v1") ? trimmedValue : `${trimmedValue}/api/v1`;
};

const API_ROOT = normalizeApiRoot(process.env.VENDOR_API_ROOT);
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

const vendorProjection = {
  password: 0,
  refreshToken: 0,
};

const getVendorsFromDatabase = async () => {
  const vendors = await mongoose.connection
    .collection("vendors")
    .find({}, { projection: vendorProjection })
    .sort({ createdAt: -1 })
    .toArray();

  return vendors;
};

const approveVendorInDatabase = async (vendorId) => {
  const { ObjectId } = mongoose.Types;

  if (!ObjectId.isValid(vendorId)) {
    throw new ApiError(400, "Invalid vendor id");
  }

  const result = await mongoose.connection
    .collection("vendors")
    .findOneAndUpdate(
      { _id: new ObjectId(vendorId) },
      { $set: { status: "approved" } },
      {
        projection: vendorProjection,
        returnDocument: "after",
      },
    );

  const vendor = result.value ?? result;

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  return vendor;
};

const getAllVendors = async () => {
  try {
    const response = await axios.get(VENDOR_BASE_URL, {
      headers: internalHeaders(),
    });

    return response.data.data ?? [];
  } catch (error) {
    console.error(`[Admin Service] Error fetching vendors from ${VENDOR_BASE_URL}:`, error.message);

    if (error.response?.status === 403) {
      console.error("[Admin Service] INTERNAL_API_KEY mismatch or missing.");
    }

    try {
      console.warn("[Admin Service] Falling back to vendors collection in admin database.");
      return await getVendorsFromDatabase();
    } catch (dbError) {
      console.error("[Admin Service] Database fallback failed while fetching vendors:", dbError.message);
    }

    if (isNetworkFailure(error)) {
      return [];
    }

    wrapVendorError(error, "Failed to fetch vendors from vendor backend");
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
    console.error(`[Admin Service] Error approving vendor through ${VENDOR_BASE_URL}:`, error.message);

    try {
      console.warn("[Admin Service] Falling back to vendors collection for approval.");
      return await approveVendorInDatabase(vendorId);
    } catch (dbError) {
      console.error("[Admin Service] Database fallback failed while approving vendor:", dbError.message);
    }

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
