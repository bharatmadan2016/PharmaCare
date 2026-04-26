import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Facebook,
  HeartPulse,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Find Pharmacies", path: "/" },
];

const services = [
  "Price Comparison",
  "Prescription Refills",
  "Medication Information",
  "Pharmacy Locator",
  "Health Resources",
];

const policies = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Policy",
  "Accessibility",
];

const socialIcons = [Facebook, Twitter, Instagram, Linkedin];

export default function PharmaFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#111b2d] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1fr]">
          <div>
            <div
              className="flex w-fit cursor-pointer items-center gap-3"
              onClick={() => navigate("/")}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-900/30">
                <HeartPulse size={20} />
              </div>
              <h2 className="text-xl font-semibold">PharmaCare</h2>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Your trusted partner in finding affordable healthcare solutions.
              Compare prices and find medications near you.
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              {socialIcons.map((Icon, index) => (
                <button
                  key={index}
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold">Quick Links</h3>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-slate-300">
              {quickLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.path ? () => navigate(item.path) : undefined}
                  className="w-fit text-left transition hover:text-white"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold">Services</h3>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-slate-300">
              {services.map((service) => (
                <p key={service}>{service}</p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold">Contact Us</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <p>
                  Bennett University, C9 - 8th Floor,
                  <br />
                  Room No. 817
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="shrink-0" />
                <p>9821064440</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="shrink-0" />
                <p>support@pharmacare.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-5">
          <div className="flex flex-col gap-3 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
            <p>&copy; 2026 PharmaCare. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {policies.map((item) => (
                <button key={item} type="button" className="transition hover:text-white">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
