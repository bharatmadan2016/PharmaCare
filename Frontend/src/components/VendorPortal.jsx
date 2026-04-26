import { useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Boxes,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  DollarSign,
  Edit2,
  Eye,
  LayoutDashboard,
  Loader2,
  LogOut,
  MapPin,
  Navigation,
  Package,
  Plus,
  Search,
  Store,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import {
  createVendorProduct,
  deleteVendorProduct,
  fetchVendorDashboardStats,
  fetchVendorOrders,
  fetchVendorProducts,
  getStoredVendor,
  logoutVendor,
  updateVendorProduct,
  updateVendorProfile,
} from "../services/vendor.service.js";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
  { name: "Products", icon: Package, path: "products" },
  { name: "Inventory", icon: Boxes, path: "inventory" },
  { name: "Orders", icon: ClipboardList, path: "orders" },
  { name: "Settings", icon: Store, path: "settings" },
];

function PendingApprovalPanel({ vendor }) {
  const isRejected = vendor.status === "rejected";

  return (
    <div className="mx-auto max-w-5xl pb-10">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold sm:text-xs ${
            isRejected
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {isRejected ? <X size={12} /> : <Clock size={12} />}
          <span>{isRejected ? "Vendor Rejected" : "Pending Approval"}</span>
        </div>

        <h1 className="mt-4 text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
          {isRejected
            ? "Your vendor account has not been approved"
            : "Your vendor account is waiting for admin approval"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          {isRejected
            ? "Inventory and order tools stay locked until the registration issue is resolved."
            : "You can sign in and view your profile, but management tools will unlock only after admin approval."}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            { label: "Pharmacy", value: vendor.pharmacyName || "Vendor Pharmacy" },
            { label: "Owner", value: vendor.ownerName || vendor.name },
            { label: "Status", value: vendor.status || "pending" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {item.label}
              </p>
              <p className="mt-2 break-words text-sm font-bold capitalize text-gray-900 sm:text-base">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, value, label, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-500",
    emerald: "bg-emerald-50 text-emerald-500",
    orange: "bg-orange-50 text-orange-500",
    purple: "bg-purple-50 text-purple-500",
  };

  return (
    <div className="flex min-h-28 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:min-h-36 sm:p-5">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-inner sm:h-10 sm:w-10 ${colors[color]}`}>
        <Icon size={16} className="sm:h-[18px] sm:w-[18px]" />
      </div>
      <div>
        <h2 className="break-words text-lg font-black tracking-tight text-gray-900 sm:text-2xl">
          {value}
        </h2>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 sm:text-xs">
          {label}
        </p>
      </div>
    </div>
  );
};

function VendorDashboardPage({ stats, loading }) {
  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-gray-400">
        <Loader2 className="mb-3 h-7 w-7 animate-spin text-emerald-500" />
        <p className="text-sm font-medium">Refreshing analytics...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-12">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Dashboard Overview</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">Real-time pharmacy analytics and alerts</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Clock} value={stats.totalOrders ?? 0} label="Total Orders" color="blue" />
        <StatCard
          icon={DollarSign}
          value={`Rs ${Number(stats.totalRevenue ?? 0).toFixed(2)}`}
          label="Total Revenue"
          color="emerald"
        />
        <StatCard icon={AlertTriangle} value={stats.lowStockCount ?? 0} label="Low Stock Alerts" color="orange" />
        <StatCard icon={Package} value={stats.pendingOrders ?? 0} label="Pending Orders" color="purple" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-gray-900 sm:text-lg">Recent Transactions</h3>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
              <span>Latest orders</span>
              <Package size={12} />
            </div>
          </div>

          <div className="space-y-3">
            {(stats.recentOrders || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 italic">
                <Package size={22} className="mb-2 opacity-20" />
                <p className="text-sm">No recent orders found</p>
              </div>
            ) : (
              stats.recentOrders.map((order, index) => (
                <div
                  key={order._id || index}
                  className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                      <Package size={16} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-gray-900">{order.orderId}</h4>
                      <p className="break-words text-xs text-gray-500">
                        {order.customerName} • {order.items?.length || 0} items
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <div className="sm:text-right">
                      <p className="text-sm font-bold text-gray-900">
                        Rs {Number(order.totalAmount).toFixed(2)}
                      </p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-500"
                            : order.status === "Pending"
                              ? "bg-orange-50 text-orange-500"
                              : "bg-blue-50 text-blue-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="rounded-lg p-2 text-gray-400">
                      <Eye size={15} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900 sm:text-lg">Critical Stock</h3>
              <p className="mt-1 text-xs text-gray-500">Items below threshold (20)</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <AlertTriangle size={13} />
            </div>
          </div>

          <div className="space-y-4">
            {(stats.lowStockProducts || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-emerald-500/60">
                <Check size={22} className="mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-widest">All stock levels are optimal</p>
              </div>
            ) : (
              stats.lowStockProducts.map((item, index) => (
                <div key={item._id || index} className="rounded-xl border border-orange-100/60 bg-orange-50/50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-gray-900">{item.name}</span>
                    <span className="whitespace-nowrap rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-600">
                      {item.stock} left
                    </span>
                  </div>
                  <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-orange-100">
                    <div
                      className="h-1.5 rounded-full bg-orange-400"
                      style={{ width: `${Math.min((item.stock / 20) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-medium italic text-gray-500">Type: {item.category}</p>
                    <span className="text-[10px] font-bold text-emerald-600">Restock</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ title, product, setProduct, onClose, onSubmit, submitLabel, isSubmitting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-gray-50/50 p-4 sm:p-5">
          <h2 className="pr-3 text-base font-bold text-gray-900 sm:text-lg">{title}</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-200 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Product Name
              </label>
              <input
                required
                disabled={isSubmitting}
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                placeholder="e.g. Paracetamol 500mg"
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Category
              </label>
              <input
                disabled={isSubmitting}
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Price (Rs)
              </label>
              <input
                required
                disabled={isSubmitting}
                type="number"
                step="0.01"
                value={product.price || ""}
                onChange={(e) => setProduct({ ...product, price: e.target.value ? parseFloat(e.target.value) : 0 })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Stock Quantity
              </label>
              <input
                required
                disabled={isSubmitting}
                type="number"
                value={product.stock || ""}
                onChange={(e) => setProduct({ ...product, stock: e.target.value ? parseInt(e.target.value, 10) : 0 })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Expiry Date
              </label>
              <input
                required
                disabled={isSubmitting}
                type="date"
                value={product.expiry}
                onChange={(e) => setProduct({ ...product, expiry: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
            <input
              disabled={isSubmitting}
              type="checkbox"
              id="rxRequired"
              checked={product.rxRequired}
              onChange={(e) => setProduct({ ...product, rxRequired: e.target.checked })}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 disabled:opacity-50"
            />
            <label htmlFor="rxRequired" className="cursor-pointer select-none text-sm font-semibold text-gray-700">
              Prescription Required (Rx)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-emerald-600 disabled:opacity-70"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              <span>{isSubmitting ? "Saving..." : submitLabel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VendorCatalogPage({ title, canManageInventory, inventoryMode = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "General",
    stock: 0,
    price: 0,
    expiry: "",
    rxRequired: false,
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchVendorProducts();
      setProducts(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canManageInventory) {
      setLoading(false);
      return;
    }
    loadProducts();
  }, [canManageInventory]);

  const handleAddProduct = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await createVendorProduct(newProduct);
      setIsModalOpen(false);
      setNewProduct({
        name: "",
        category: "General",
        stock: 0,
        price: 0,
        expiry: "",
        rxRequired: false,
        description: "",
      });
      await loadProducts();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await updateVendorProduct(editingProduct._id, editingProduct);
      setIsEditModalOpen(false);
      setEditingProduct(null);
      await loadProducts();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    await deleteVendorProduct(id);
    await loadProducts();
  };

  if (!canManageInventory) {
    return <PendingApprovalPanel vendor={{ status: "pending" }} />;
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl pb-12">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          {inventoryMode ? "Manage your pharmacy operations" : "Manage your pharmacy catalog"}
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[340px]">
          <input
            type="text"
            placeholder={inventoryMode ? "Search products..." : "Search our catalog..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600"
        >
          <Plus size={16} />
          <span>{inventoryMode ? "Add Product" : "Add New Medicine"}</span>
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Loader2 className="mb-3 h-7 w-7 animate-spin text-emerald-500" />
            <p className="text-sm">{inventoryMode ? "Loading inventory..." : "Loading catalog..."}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center text-sm italic text-gray-500">
            {inventoryMode ? "No products found in inventory." : "Your catalog is currently empty."}
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="break-words text-base font-bold text-gray-900 sm:text-lg">{product.name}</h3>
                    {product.rxRequired && (
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                        Rx Required
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:gap-4">
                    <p className="break-words">
                      Category: <span className="font-medium text-emerald-500">{product.category}</span>
                    </p>
                    <p>
                      Stock:{" "}
                      <span className={`font-bold ${product.stock < 10 ? "text-orange-500" : "text-gray-900"}`}>
                        {product.stock}
                      </span>
                    </p>
                    <p>
                      Expiry: <span className="font-medium text-gray-900">{product.expiry}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end lg:gap-6">
                  <div className="sm:text-right">
                    <p className="text-lg font-bold text-gray-900 sm:text-xl">Rs {Number(product.price).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">per unit</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setIsEditModalOpen(true);
                      }}
                      className="rounded-lg bg-white p-2 text-emerald-500 shadow-sm transition hover:bg-emerald-50"
                      title="Edit Medicine"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="rounded-lg bg-white p-2 text-red-500 shadow-sm transition hover:bg-red-50"
                      title="Delete Medicine"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen ? (
        <ProductModal
          title={inventoryMode ? "Add New Product" : "Add New Medicine to Catalog"}
          product={newProduct}
          setProduct={setNewProduct}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddProduct}
          submitLabel={inventoryMode ? "Save Product" : "Save Medicine"}
          isSubmitting={isSubmitting}
        />
      ) : null}

      {isEditModalOpen && editingProduct ? (
        <ProductModal
          title="Edit Medicine Details"
          product={editingProduct}
          setProduct={setEditingProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={handleEditProduct}
          submitLabel="Update Medicine"
          isSubmitting={isSubmitting}
        />
      ) : null}
    </div>
  );
}

function VendorOrdersPage({ canManageInventory }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canManageInventory) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        const data = await fetchVendorOrders();
        const mapped = (data || []).map((order) => ({
          id: `#${order.orderId}`,
          status: order.status,
          customer: order.customerName,
          date: new Date(order.createdAt).toLocaleDateString(),
          address: "Address not available",
          items: order.items?.length || 0,
          total: order.totalAmount,
        }));
        setOrders(mapped);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [canManageInventory]);

  if (!canManageInventory) {
    return <PendingApprovalPanel vendor={{ status: "pending" }} />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-orange-600 bg-orange-50";
      case "Processing":
        return "text-blue-600 bg-blue-50";
      case "Shipped":
        return "text-purple-600 bg-purple-50";
      case "Delivered":
        return "text-emerald-600 bg-emerald-50";
      case "Cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getActions = (status) => {
    if (status === "Pending") return ["view", "accept", "deny"];
    if (status === "Processing") return ["view", "ship"];
    return ["view"];
  };

  return (
    <div className="mx-auto max-w-6xl pb-12">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Orders</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">Manage your pharmacy operations</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">No orders found.</div>
        ) : (
          orders.map((order, index) => {
            const actions = getActions(order.status);
            return (
              <div key={index} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900 sm:text-lg">{order.id}</h3>
                      <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status === "Pending" && <Package size={11} />}
                        {(order.status === "Delivered" || order.status === "Processing") && <Check size={11} />}
                        <span>{order.status}</span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-600 md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <span className="mb-1 block text-gray-400">Customer:</span>
                        <span className="break-words font-medium text-gray-900">{order.customer}</span>
                      </div>
                      <div>
                        <span className="mb-1 block text-gray-400">Date:</span>
                        <span className="font-medium text-gray-900">{order.date}</span>
                      </div>
                      <div className="xl:col-span-2">
                        <span className="mb-1 block text-gray-400">Address:</span>
                        <span className="break-words font-medium text-gray-900">{order.address}</span>
                      </div>
                      <div>
                        <span className="mb-1 block text-gray-400">Items:</span>
                        <span className="font-medium text-gray-900">{order.items} product(s)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 lg:ml-5 lg:min-w-[120px] lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                    <p className="text-lg font-bold text-gray-900 sm:text-xl">Rs {Number(order.total).toFixed(2)}</p>
                    <div className="flex items-center gap-2 lg:flex-col">
                      {actions.includes("view") && (
                        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-500 transition hover:bg-blue-100">
                          <Eye size={16} />
                        </button>
                      )}
                      {actions.includes("accept") && (
                        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 transition hover:bg-emerald-100">
                          <Check size={16} />
                        </button>
                      )}
                      {actions.includes("deny") && (
                        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100">
                          <X size={16} />
                        </button>
                      )}
                      {actions.includes("ship") && (
                        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-purple-500 transition hover:bg-purple-100">
                          <Truck size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function VendorSettingsPage({ vendor }) {
  const [profile, setProfile] = useState({
    pharmacyName: vendor.pharmacyName || "",
    ownerName: vendor.ownerName || "",
    phone: vendor.phone || "",
    latitude: vendor.location?.coordinates[1] || "",
    longitude: vendor.location?.coordinates[0] || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    try {
      const payload = {
        ...profile,
        location: {
          coordinates: [profile.longitude, profile.latitude]
        }
      };
      await updateVendorProfile(payload);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setProfile({
          ...profile,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Store Settings</h1>
        <p className="text-gray-500">Update your pharmacy details and location</p>
      </div>

      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        {message && (
          <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Pharmacy Name</label>
            <input 
              type="text" 
              value={profile.pharmacyName}
              onChange={(e) => setProfile({...profile, pharmacyName: e.target.value})}
              className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-emerald-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Owner Name</label>
            <input 
              type="text" 
              value={profile.ownerName}
              onChange={(e) => setProfile({...profile, ownerName: e.target.value})}
              className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-emerald-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Phone</label>
            <input 
              type="text" 
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-emerald-500 outline-none transition"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-gray-900 flex items-center gap-2">
               <MapPin size={18} className="text-emerald-500" />
               Store Location
             </h3>
             <button 
              type="button"
              onClick={detectLocation}
              className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline font-sans"
             >
               <Navigation size={12} /> Detect Current
             </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Longitude</label>
              <input 
                type="number" 
                step="any"
                value={profile.longitude}
                onChange={(e) => setProfile({...profile, longitude: e.target.value})}
                className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-emerald-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Latitude</label>
              <input 
                type="number" 
                step="any"
                value={profile.latitude}
                onChange={(e) => setProfile({...profile, latitude: e.target.value})}
                className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-emerald-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
          {isSubmitting ? "Updating..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

function VendorSidebar({ vendor, canManageInventory, isCollapsed, toggleSidebar, onLogout }) {
  return (
    <aside
      className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        isCollapsed ? "w-14 sm:w-16" : "w-44 sm:w-52"
      }`}
    >
      <div className="border-b border-gray-100 p-3 sm:p-4">
        {!isCollapsed ? (
          <div>
            <h1 className="text-sm font-bold text-gray-900 sm:text-base">Vendor Portal</h1>
            <p className="mt-1 break-words text-[10px] text-gray-500 sm:text-[11px]">
              {vendor.pharmacyName || "--"}
            </p>
            <div
              className={`mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-medium sm:text-[10px] ${
                canManageInventory
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              {canManageInventory ? <CheckCircle2 size={10} /> : <Clock size={10} />}
              <span>{canManageInventory ? "Approved" : "Pending"}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <Store size={14} />
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-2 py-4 sm:px-3">
        {navItems.map((item) => {
          const disabled = !canManageInventory && item.path !== "dashboard";

          if (disabled) {
            return (
              <div
                key={item.name}
                className="flex items-center gap-2 rounded-xl px-2.5 py-2.5 text-gray-400 sm:px-3"
              >
                <item.icon size={15} />
                {!isCollapsed && <span className="text-[11px] font-medium sm:text-xs">{item.name}</span>}
              </div>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={`/vendor-dashboard/${item.path}`}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-2.5 py-2.5 transition-colors sm:px-3 ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={15} className={isActive ? "text-white" : "text-gray-500"} />
                  {!isCollapsed && <span className="text-[11px] font-medium sm:text-xs">{item.name}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-gray-100 p-2 sm:p-3">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2.5 text-left text-gray-600 transition hover:bg-gray-50 sm:px-3"
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          {!isCollapsed && <span className="text-[11px] font-medium sm:text-xs">Collapse</span>}
        </button>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2.5 text-left text-red-600 transition hover:bg-red-50 sm:px-3"
        >
          <LogOut size={15} />
          {!isCollapsed && <span className="text-[11px] font-medium sm:text-xs">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default function VendorPortal() {
  const navigate = useNavigate();
  const vendor = useMemo(() => getStoredVendor(), []);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    lowStockProducts: [],
    recentOrders: [],
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!vendor || vendor.role !== "Vendor") {
      navigate("/vendor-login", { replace: true });
      return;
    }

    if (vendor.status !== "approved") {
      setStatsLoading(false);
      return;
    }

    const loadStats = async () => {
      try {
        const data = await fetchVendorDashboardStats();
        setStats({
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          pendingOrders: data.pendingOrders || 0,
          lowStockCount: data.lowStockCount || 0,
          lowStockProducts: data.lowStockProducts || [],
          recentOrders: data.recentOrders || [],
        });
      } catch (error) {
        console.error("Error fetching vendor dashboard stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [navigate, vendor]);

  if (!vendor || vendor.role !== "Vendor") {
    return null;
  }

  const canManageInventory = vendor.status === "approved";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <VendorSidebar
        vendor={vendor}
        canManageInventory={canManageInventory}
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed((current) => !current)}
        onLogout={() => {
          logoutVendor();
          navigate("/vendor-login", { replace: true });
        }}
      />

      <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                canManageInventory ? (
                  <VendorDashboardPage stats={stats} loading={statsLoading} />
                ) : (
                  <PendingApprovalPanel vendor={vendor} />
                )
              }
            />
            <Route
              path="products"
              element={<VendorCatalogPage title="Products" canManageInventory={canManageInventory} />}
            />
            <Route
              path="inventory"
              element={
                <VendorCatalogPage
                  title="Inventory"
                  canManageInventory={canManageInventory}
                  inventoryMode
                />
              }
            />
            <Route
              path="orders"
              element={<VendorOrdersPage canManageInventory={canManageInventory} />}
            />
            <Route
              path="settings"
              element={<VendorSettingsPage vendor={vendor} />}
            />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
