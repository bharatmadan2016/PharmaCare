import { useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  DollarSign,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  X,
  Settings,
} from "lucide-react";
import { clearAuthSession, getStoredUser, logoutUser } from "../services/auth.service.js";
import {
  approveVendor,
  deleteAdminUser,
  fetchAdminDashboard,
  fetchAdminOrders,
  fetchAdminPayments,
  fetchAdminReports,
  fetchAdminUsers,
  fetchVendorsForApproval,
} from "../services/admin.service.js";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
  { name: "Vendor Verification", icon: ShieldCheck, path: "verification" },
  { name: "Users", icon: Users, path: "users" },
  { name: "Vendors", icon: Store, path: "vendors" },
  { name: "Orders", icon: ShoppingBag, path: "orders" },
  { name: "Payments", icon: DollarSign, path: "payments" },
  { name: "Reports", icon: BarChart3, path: "reports" },
  { name: "Settings", icon: Settings, path: "settings" },
];

const cardStyles = {
  blue: "bg-blue-500 text-white",
  emerald: "bg-emerald-500 text-white",
  purple: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
};

const alertStyles = {
  warning: "border-amber-300 bg-amber-50 text-amber-800",
  info: "border-blue-300 bg-blue-50 text-blue-800",
  success: "border-emerald-300 bg-emerald-50 text-emerald-800",
};

function formatMetricValue(card) {
  if (card.isCurrency) {
    const value = Number(card.value || 0);
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  }

  const numeric = Number(card.value || 0);
  return numeric.toLocaleString();
}

function AdminSidebar({ adminName, onLogout, isLoggingOut }) {
  return (
    <aside className="flex h-screen w-[300px] flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-6">
        <h1 className="text-[1.7rem] font-bold tracking-tight text-slate-900">Admin Portal</h1>
        <p className="mt-1 text-[1rem] text-slate-500">{adminName || "Admin"}</p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-300 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700">
          <ShieldCheck size={16} />
          <span>Super Admin</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4">
        <div className="space-y-2.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={`/admin-dashboard/${item.path}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-[1.5rem] px-5 py-4 text-[0.98rem] font-semibold transition ${
                    isActive
                      ? "bg-linear-to-r from-fuchsia-500 to-violet-600 text-white shadow-[0_18px_40px_rgba(124,58,237,0.35)]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-200 px-4 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-left text-[0.98rem] font-medium text-slate-500 transition hover:bg-slate-50"
        >
          <X size={18} />
          <span>Collapse</span>
        </button>
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-left text-[0.98rem] font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-70"
        >
          <LogOut size={18} />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}

function AdminTopbar() {
  const location = useLocation();
  const currentSection = useMemo(
    () => menuItems.find((item) => location.pathname.includes(item.path))?.name || "Dashboard",
    [location.pathname],
  );

  return (
    <div className="flex items-start justify-between border-b border-slate-200 bg-white px-8 py-6 shadow-sm">
      <div>
        <h1 className="text-[3.2rem] font-bold tracking-tight text-slate-900">{currentSection}</h1>
        <p className="mt-2 text-[1.05rem] text-slate-500">Platform administration and management</p>
      </div>
      <button
        type="button"
        className="relative mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
      >
        <Bell size={22} />
        <span className="absolute right-1 top-1 h-3 w-3 rounded-full bg-rose-500" />
      </button>
    </div>
  );
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchAdminDashboard();
        setDashboard(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="p-10 text-xl text-slate-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="m-10 rounded-3xl border border-red-200 bg-red-50 p-8 text-lg text-red-700">{error}</div>;
  }

  return (
    <div className="space-y-10 p-10">
      <div className="grid gap-7 xl:grid-cols-4">
        {dashboard.summaryCards.map((card) => (
          <article
            key={card.key}
            className="rounded-[2rem] bg-white p-7 shadow-[0_20px_45px_rgba(148,163,184,0.18)]"
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-[1rem] ${cardStyles[card.tone]}`}>
                {card.key === "users" ? <Users size={24} /> : null}
                {card.key === "vendors" ? <Store size={24} /> : null}
                {card.key === "orders" ? <ShoppingBag size={24} /> : null}
                {card.key === "revenue" ? <DollarSign size={24} /> : null}
              </div>
              <div className="rounded-full bg-emerald-100 px-4 py-1.5 text-lg font-semibold text-emerald-700">
                {card.change}
              </div>
            </div>
            <h2 className="mt-7 text-[2.6rem] font-bold tracking-tight text-slate-900">
              {formatMetricValue(card)}
            </h2>
            <p className="mt-2 text-[1rem] text-slate-500">{card.label}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.6fr_0.75fr]">
        <section className="rounded-[2.25rem] bg-white p-10 shadow-[0_20px_45px_rgba(148,163,184,0.18)]">
          <h2 className="text-[2.25rem] font-bold tracking-tight text-slate-900">Recent Activity</h2>

          <div className="mt-8 space-y-5">
            {dashboard.recentActivity.map((activity) => (
              <article
                key={activity.id}
                className="flex items-center justify-between rounded-[1.75rem] border border-slate-200 px-7 py-6"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      activity.type === "user"
                        ? "bg-blue-100 text-blue-600"
                        : activity.type === "vendor"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-violet-100 text-violet-600"
                    }`}
                  >
                    {activity.type === "user" ? <Users size={20} /> : null}
                    {activity.type === "vendor" ? <Store size={20} /> : null}
                    {activity.type === "order" ? <ShoppingBag size={20} /> : null}
                  </div>
                  <div>
                    <h3 className="text-[1.18rem] font-semibold text-slate-900">{activity.title}</h3>
                    <p className="mt-1 text-[1rem] text-slate-500">{activity.subtitle}</p>
                  </div>
                </div>
                <p className="text-base text-slate-400">{activity.timeAgo}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2.25rem] bg-white p-10 shadow-[0_20px_45px_rgba(148,163,184,0.18)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[2.1rem] font-bold tracking-tight text-slate-900">System Alerts</h2>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-500">
              <AlertTriangle size={22} />
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {dashboard.systemAlerts.map((alert) => (
              <article
                key={alert.id}
                className={`rounded-[1.6rem] border px-6 py-5 ${alertStyles[alert.tone]}`}
              >
                <h3 className="text-[1.35rem] font-semibold">{alert.title}</h3>
                <p className="mt-2 text-lg opacity-90">{alert.subtitle}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function DataTablePage({ title, subtitle, columns, rows, loading, emptyText, actionRenderer }) {
  return (
    <div className="p-10">
      <section className="rounded-[2.25rem] bg-white p-10 shadow-[0_20px_45px_rgba(148,163,184,0.18)]">
        <h2 className="text-[2.15rem] font-bold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-2 text-xl text-slate-500">{subtitle}</p>

        {loading ? (
          <div className="mt-8 text-lg text-slate-500">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="mt-8 text-lg text-slate-500">{emptyText}</div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
            <div className="grid bg-slate-50 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500" style={{ gridTemplateColumns: `${columns.map((column) => column.width || "1fr").join(" ")}` }}>
              {columns.map((column) => (
                <div key={column.key}>{column.label}</div>
              ))}
            </div>
            <div className="divide-y divide-slate-200">
              {rows.map((row, index) => (
                <div
                  key={row.id || row._id || index}
                  className="grid items-center px-6 py-5 text-[1.03rem] text-slate-700"
                  style={{ gridTemplateColumns: `${columns.map((column) => column.width || "1fr").join(" ")}` }}
                >
                  {columns.map((column) => (
                    <div key={column.key}>
                      {column.render ? column.render(row) : row[column.key]}
                    </div>
                  ))}
                  {actionRenderer ? <div>{actionRenderer(row)}</div> : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function VendorVerificationPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVendors = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchVendorsForApproval();
      setVendors(data || []);
    } catch (err) {
      setError(err.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const pendingVendors = vendors.filter((vendor) => vendor.status !== "approved");

  return (
    <div className="p-10">
      <section className="rounded-[2.25rem] bg-white p-10 shadow-[0_20px_45px_rgba(148,163,184,0.18)]">
        <h2 className="text-[2.15rem] font-bold tracking-tight text-slate-900">Vendor Verification</h2>
        <p className="mt-2 text-xl text-slate-500">
          Vendors are approved here before inventory becomes available to them.
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-lg text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-8 text-lg text-slate-500">Loading vendor registrations...</div>
        ) : pendingVendors.length === 0 ? (
          <div className="mt-8 text-lg text-slate-500">No pending vendor registrations right now.</div>
        ) : (
          <div className="mt-8 space-y-5">
            {pendingVendors.map((vendor) => (
              <article
                key={vendor._id}
                className="flex items-center justify-between rounded-[1.75rem] border border-slate-200 px-7 py-6"
              >
                <div>
                  <h3 className="text-[1.35rem] font-semibold text-slate-900">{vendor.pharmacyName}</h3>
                  <p className="mt-1 text-lg text-slate-500">
                    {vendor.ownerName} • {vendor.email} • {vendor.phone}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await approveVendor(vendor._id);
                      await loadVendors();
                    } catch (err) {
                      setError(err.message || "Failed to approve vendor");
                    }
                  }}
                  className="rounded-2xl bg-violet-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-violet-700"
                >
                  Approve Vendor
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function UsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setRows(await fetchAdminUsers());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DataTablePage
      title="Users"
      subtitle="All registered admins and customers."
      loading={loading}
      rows={rows}
      emptyText="No users found."
      columns={[
        { key: "name", label: "Name", width: "1.25fr" },
        { key: "email", label: "Email", width: "1.4fr" },
        { key: "role", label: "Role", width: "0.7fr" },
        { key: "userName", label: "User Name", width: "1fr" },
      ]}
      actionRenderer={(row) => (
        <button
          type="button"
          onClick={async () => {
            if (!window.confirm(`Delete ${row.name}?`)) return;
            await deleteAdminUser(row._id);
            setRows((current) => current.filter((user) => user._id !== row._id));
          }}
          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      )}
    />
  );
}

function VendorsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setRows(await fetchVendorsForApproval());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DataTablePage
      title="Vendors"
      subtitle="Registered pharmacy partners and their approval status."
      loading={loading}
      rows={rows}
      emptyText="No vendors found."
      columns={[
        { key: "pharmacyName", label: "Pharmacy", width: "1.2fr" },
        { key: "ownerName", label: "Owner", width: "1fr" },
        { key: "email", label: "Email", width: "1.3fr" },
        { key: "status", label: "Status", width: "0.8fr" },
      ]}
    />
  );
}

function OrdersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setRows(await fetchAdminOrders());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DataTablePage
      title="Orders"
      subtitle="Platform order activity coming from the vendor system."
      loading={loading}
      rows={rows}
      emptyText="No orders found."
      columns={[
        { key: "orderId", label: "Order", width: "1fr" },
        { key: "customerName", label: "Customer", width: "1fr" },
        { key: "status", label: "Status", width: "0.8fr" },
        {
          key: "totalAmount",
          label: "Amount",
          width: "0.8fr",
          render: (row) => `$${Number(row.totalAmount || 0).toFixed(2)}`,
        },
      ]}
    />
  );
}

function PaymentsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setRows(await fetchAdminPayments());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DataTablePage
      title="Payments"
      subtitle="Payment-facing view generated from the current order stream."
      loading={loading}
      rows={rows}
      emptyText="No payments found."
      columns={[
        { key: "orderId", label: "Order", width: "1fr" },
        { key: "customerName", label: "Customer", width: "1fr" },
        { key: "paymentStatus", label: "Payment", width: "0.8fr" },
        {
          key: "amount",
          label: "Amount",
          width: "0.8fr",
          render: (row) => `$${Number(row.amount || 0).toFixed(2)}`,
        },
      ]}
    />
  );
}

function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        setReport(await fetchAdminReports());
      } catch (err) {
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-10 text-xl text-slate-500">Loading reports...</div>;
  }

  if (error) {
    return <div className="m-10 rounded-3xl border border-red-200 bg-red-50 p-8 text-lg text-red-700">{error}</div>;
  }

  const safeReport = {
    userBreakdown: {
      customers: report?.userBreakdown?.customers ?? 0,
      admins: report?.userBreakdown?.admins ?? 0,
    },
    vendorBreakdown: {
      approved: report?.vendorBreakdown?.approved ?? 0,
      pending: report?.vendorBreakdown?.pending ?? 0,
    },
    orderBreakdown: {
      total: report?.orderBreakdown?.total ?? 0,
      delivered: report?.orderBreakdown?.delivered ?? 0,
      pending: report?.orderBreakdown?.pending ?? 0,
    },
  };

  return (
    <div className="grid gap-8 p-10 xl:grid-cols-3">
      <section className="rounded-[2rem] bg-white p-8 shadow-[0_20px_45px_rgba(148,163,184,0.18)]">
        <h2 className="text-[1.8rem] font-bold text-slate-900">User Breakdown</h2>
        <p className="mt-4 text-xl text-slate-500">Customers: {safeReport.userBreakdown.customers}</p>
        <p className="mt-2 text-xl text-slate-500">Admins: {safeReport.userBreakdown.admins}</p>
      </section>
      <section className="rounded-[2rem] bg-white p-8 shadow-[0_20px_45px_rgba(148,163,184,0.18)]">
        <h2 className="text-[1.8rem] font-bold text-slate-900">Vendor Breakdown</h2>
        <p className="mt-4 text-xl text-slate-500">Approved: {safeReport.vendorBreakdown.approved}</p>
        <p className="mt-2 text-xl text-slate-500">Pending: {safeReport.vendorBreakdown.pending}</p>
      </section>
      <section className="rounded-[2rem] bg-white p-8 shadow-[0_20px_45px_rgba(148,163,184,0.18)]">
        <h2 className="text-[1.8rem] font-bold text-slate-900">Order Breakdown</h2>
        <p className="mt-4 text-xl text-slate-500">Total: {safeReport.orderBreakdown.total}</p>
        <p className="mt-2 text-xl text-slate-500">Delivered: {safeReport.orderBreakdown.delivered}</p>
        <p className="mt-2 text-xl text-slate-500">Pending: {safeReport.orderBreakdown.pending}</p>
      </section>
    </div>
  );
}

function SettingsPage() {
  const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("gemini_api_key", apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-10 max-w-2xl">
      <section className="rounded-[2.25rem] bg-white p-10 shadow-[0_20px_45px_rgba(148,163,184,0.18)]">
        <h2 className="text-[2.15rem] font-bold tracking-tight text-slate-900">System Settings</h2>
        <p className="mt-2 text-xl text-slate-500">Configure global application settings and API integrations.</p>
        
        <div className="mt-10 space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Gemini API Key</label>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full rounded-2xl border border-slate-200 p-5 text-lg outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="mt-3 text-slate-400 text-sm italic">This key is used by the AI Chat Assistant to provide customer support.</p>
          </div>

          <button 
            onClick={handleSave}
            className="rounded-2xl bg-violet-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-violet-700 transition flex items-center gap-2"
          >
            {saved ? "Settings Saved!" : "Save Configuration"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function AdminPage() {
  const [adminName, setAdminName] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getStoredUser();
    if (!user || user.role !== "Admin") {
      navigate("/admin-login", { replace: true });
      return;
    }

    setAdminName(user.name || "Admin");
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuthSession();
      navigate("/admin-login", { replace: true });
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8fc] text-slate-900">
      <AdminSidebar adminName={adminName} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="verification" element={<VendorVerificationPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="vendors" element={<VendorsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
