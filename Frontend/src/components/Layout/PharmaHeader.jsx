import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  ChevronDown,
  CircleHelp,
  HeartPulse,
  Home,
  LogIn,
  Menu,
  ShoppingCart,
  X,
} from "lucide-react";
import { clearAuthSession, getStoredUser, logoutUser } from "../../services/auth.service.js";
import { useCart } from "../../context/CartContext.jsx";

function NavItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

export default function PharmaHeader({
  activePage = "home",
  cartCount = 0,
  showCustomerMenu = false,
}) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, []);

  const customerUser =
    currentUser?.role === "User" ? currentUser : showCustomerMenu ? { name: "Customer" } : null;

  const primaryNavItems = [
    {
      icon: Home,
      label: "Home",
      active: activePage === "home",
      onClick: () => navigate("/"),
    },
    {
      icon: CircleHelp,
      label: "About",
      active: activePage === "about",
      onClick: () => navigate("/about"),
    },
  ];

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  const handleNavigate = (callback) => {
    callback();
    setIsMobileMenuOpen(false);
  };

  const { clearCart } = useCart();

  const handleCustomerLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearCart();
      clearAuthSession();
      setCurrentUser(null);
      setIsMobileMenuOpen(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 lg:gap-6">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={18} />
          </button>

          <div
            className="flex min-w-0 cursor-pointer items-center gap-3"
            onClick={() => navigate("/")}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-200">
              <HeartPulse size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold leading-none text-emerald-700">
                PharmaCare
              </h1>
              <p className="mt-1 truncate text-xs text-slate-500">
                Your Health Partner
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {primaryNavItems.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={() => navigate("/cart")}
          className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition sm:hidden ${
            activePage === "cart"
              ? "border-amber-300 bg-amber-50 text-amber-700"
              : "border-amber-300 bg-white text-amber-700 hover:bg-amber-50"
          }`}
          aria-label="Open cart"
        >
          {cartCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
              {cartCount}
            </span>
          ) : null}
          <ShoppingCart size={18} />
        </button>

        <div className="hidden items-center gap-3 sm:flex">
          {customerUser ? (
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                  {(customerUser.name || "C").charAt(0).toUpperCase()}
                </div>
                <span>{customerUser.name || "Customer"}</span>
                <ChevronDown size={16} />
              </div>
              <button
                type="button"
                onClick={handleCustomerLogout}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <LogIn size={16} />
                <span>Login</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Register
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className={`relative inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              activePage === "cart"
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-amber-300 bg-white text-amber-700 hover:bg-amber-50"
            }`}
          >
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                {cartCount}
              </span>
            ) : null}
            <ShoppingCart size={16} />
            <span>Cart</span>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/45 transition md:hidden ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[20rem] max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-200 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => handleNavigate(() => navigate("/"))}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-200">
              <HeartPulse size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-emerald-700">
                PharmaCare
              </h2>
              <p className="text-xs text-slate-500">Navigation</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-slate-200 px-4 py-5">
          {customerUser ? (
            <div className="space-y-3">
              <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                  {(customerUser.name || "C").charAt(0).toUpperCase()}
                </div>
                <span>{customerUser.name || "Customer"}</span>
                <ChevronDown size={16} />
              </div>
              <button
                type="button"
                onClick={handleCustomerLogout}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleNavigate(() => navigate("/signin"))}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <LogIn size={16} />
                <span>Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavigate(() => navigate("/register"))}
                className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Register
              </button>
            </div>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-4 py-5">
          {primaryNavItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={item.active}
              onClick={() => handleNavigate(item.onClick)}
            />
          ))}
        </nav>

        <div className="border-t border-slate-200 px-4 py-5">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleNavigate(() => navigate("/cart"))}
              className={`relative inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                activePage === "cart"
                  ? "border-amber-300 bg-amber-50 text-amber-700"
                  : "border-amber-300 bg-white text-amber-700 hover:bg-amber-50"
              }`}
            >
              {cartCount > 0 ? (
                <span className="absolute right-3 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              ) : null}
              <ShoppingCart size={16} />
              <span>Cart</span>
            </button>

          </div>
        </div>
      </aside>
    </header>
  );
}
