import { User } from "../models/user.model.js";
import {
  approveVendor,
  getAllOrders,
  getAllVendors,
  getVendorDashboardStats,
} from "../services/vendor.service.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const getRelativeTime = (value) => {
  const now = Date.now();
  const timestamp = new Date(value).getTime();
  const diffMs = Math.max(now - timestamp, 0);
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

const buildRecentActivity = ({ users, vendors, orders }) => {
  const userActivity = users.map((user) => ({
    id: `user-${user._id}`,
    type: "user",
    title: "New user registration",
    subtitle: user.name,
    timeAgo: getRelativeTime(user.createdAt),
    createdAt: user.createdAt,
  }));

  const vendorActivity = vendors.map((vendor) => ({
    id: `vendor-${vendor._id}`,
    type: "vendor",
    title: vendor.status === "approved" ? "Vendor approved" : "Vendor KYC submitted",
    subtitle: vendor.pharmacyName || vendor.ownerName,
    timeAgo: getRelativeTime(vendor.createdAt),
    createdAt: vendor.createdAt,
  }));

  const orderActivity = orders.map((order) => ({
    id: `order-${order._id}`,
    type: "order",
    title: order.status === "Delivered" ? "Order completed" : "Order received",
    subtitle: order.orderId,
    timeAgo: getRelativeTime(order.createdAt),
    createdAt: order.createdAt,
  }));

  return [...userActivity, ...vendorActivity, ...orderActivity]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 6);
};

const buildSystemAlerts = ({ pendingVendors, newUsersThisWeek, totalOrders }) => [
  {
    id: "pending-vendors",
    title: `${pendingVendors} Pending KYC Reviews`,
    subtitle: "Vendors waiting for verification",
    tone: "warning",
  },
  {
    id: "recent-users",
    title: `${newUsersThisWeek} New User Signups`,
    subtitle: "Recent customer registrations this week",
    tone: "info",
  },
  {
    id: "system-health",
    title: "System Health: Good",
    subtitle: totalOrders > 0 ? "Orders and dashboard services are operational" : "Core admin services are operational",
    tone: "success",
  },
];

const fetchDashboardOverview = asyncHandler(async (req, res) => {
  const [vendors, users, orders, vendorStats] = await Promise.all([
    getAllVendors(),
    User.find().select("-password -refreshToken").sort({ createdAt: -1 }),
    getAllOrders(),
    getVendorDashboardStats(),
  ]);

  const customerUsers = users.filter((user) => user.role === "User");
  const pendingVendors = vendors.filter((vendor) => vendor.status !== "approved");
  const approvedVendors = vendors.filter((vendor) => vendor.status === "approved");
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newUsersThisWeek = customerUsers.filter(
    (user) => new Date(user.createdAt).getTime() >= weekAgo,
  ).length;
  const newVendorsThisWeek = vendors.filter(
    (vendor) => new Date(vendor.createdAt).getTime() >= weekAgo,
  ).length;
  const recentOrdersToday = orders.filter((order) => {
    const created = new Date(order.createdAt);
    const today = new Date();
    return created.toDateString() === today.toDateString();
  }).length;

  const summary = {
    totalUsers: customerUsers.length,
    totalVendors: vendors.length,
    totalOrders: vendorStats.totalOrders ?? orders.length,
    totalRevenue: vendorStats.totalRevenue ?? 0,
    summaryCards: [
      {
        key: "users",
        label: "Total Users",
        value: customerUsers.length,
        change: `+${newUsersThisWeek}`,
        tone: "blue",
      },
      {
        key: "vendors",
        label: "Total Vendors",
        value: vendors.length,
        change: `+${newVendorsThisWeek}`,
        tone: "emerald",
      },
      {
        key: "orders",
        label: "Total Orders",
        value: vendorStats.totalOrders ?? orders.length,
        change: `+${recentOrdersToday}`,
        tone: "purple",
      },
      {
        key: "revenue",
        label: "Total Revenue",
        value: vendorStats.totalRevenue ?? 0,
        change: `+${approvedVendors.length}%`,
        tone: "amber",
        isCurrency: true,
      },
    ],
    recentActivity: buildRecentActivity({
      users: customerUsers.slice(0, 4),
      vendors: vendors.slice(0, 4),
      orders: orders.slice(0, 4),
    }),
    systemAlerts: buildSystemAlerts({
      pendingVendors: pendingVendors.length,
      newUsersThisWeek,
      totalOrders: vendorStats.totalOrders ?? orders.length,
    }),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, summary, "Dashboard overview fetched successfully"));
});

const fetchUsersController = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const fetchVendors = asyncHandler(async (req, res) => {
  const vendors = await getAllVendors();

  return res
    .status(200)
    .json(new ApiResponse(200, vendors, "Vendors fetched successfully"));
});

const approveVendorController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const vendor = await approveVendor(id);

  return res
    .status(200)
    .json(new ApiResponse(200, vendor, "Vendor approved successfully"));
});

const fetchOrdersController = asyncHandler(async (req, res) => {
  const orders = await getAllOrders();

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const fetchPaymentsController = asyncHandler(async (req, res) => {
  const orders = await getAllOrders();

  const payments = orders.map((order) => ({
    id: order._id,
    orderId: order.orderId,
    customerName: order.customerName,
    amount: order.totalAmount,
    paymentStatus: order.paymentStatus || "Pending",
    status: order.status,
    createdAt: order.createdAt,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, payments, "Payments fetched successfully"));
});

const fetchReportsController = asyncHandler(async (req, res) => {
  const [users, vendors, orders] = await Promise.all([
    User.find().select("role createdAt"),
    getAllVendors(),
    getAllOrders(),
  ]);

  const safeUsers = Array.isArray(users) ? users : [];
  const safeVendors = Array.isArray(vendors) ? vendors : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  const reports = {
    userBreakdown: {
      customers: safeUsers.filter((user) => user.role === "User").length,
      admins: safeUsers.filter((user) => user.role === "Admin").length,
    },
    vendorBreakdown: {
      approved: safeVendors.filter((vendor) => vendor.status === "approved").length,
      pending: safeVendors.filter((vendor) => vendor.status !== "approved").length,
    },
    orderBreakdown: {
      total: safeOrders.length,
      delivered: safeOrders.filter((order) => order.status === "Delivered").length,
      pending: safeOrders.filter((order) => order.status === "Pending").length,
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, reports, "Reports fetched successfully"));
});

export {
  approveVendorController,
  fetchDashboardOverview,
  fetchOrdersController,
  fetchPaymentsController,
  fetchReportsController,
  fetchUsersController,
  fetchVendors,
};
