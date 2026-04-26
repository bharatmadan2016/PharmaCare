import React from "react";
import {
  Award,
  Clock3,
  Crosshair,
  Heart,
  Shield,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PharmaHeader from "../Layout/PharmaHeader.jsx";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import BackButton from "../Layout/BackButton.jsx";

const featureCards = [
  {
    icon: Shield,
    title: "Trusted & Secure",
    description:
      "All partner pharmacies are verified and licensed. Your data is protected with industry-leading security.",
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    icon: Clock3,
    title: "Real-Time Updates",
    description:
      "Get instant updates on medication availability, pricing, and pharmacy hours. No more wasted trips.",
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    icon: Award,
    title: "Best Prices",
    description:
      "Compare prices across multiple pharmacies to find the best deal. Save money on every prescription.",
    iconClass: "bg-amber-100 text-orange-500",
  },
];

const stats = [
  { value: "0", label: "Partner Pharmacies" },
  { value: "0", label: "Active Users" },
  { value: "0", label: "Prescriptions Filled" },
  { value: "0", label: "Satisfaction Rate" },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-900">
      <PharmaHeader activePage="about" />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton label="Back to Home" onClick={() => navigate("/")} />
        </div>

        <section className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-semibold text-slate-900">About PharmaCare</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Your trusted partner in finding affordable healthcare solutions. We
            connect you with the best pharmacies in your area.
          </p>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[22px] bg-blue-50 px-6 py-8 sm:px-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <Crosshair size={24} />
            </div>
            <h3 className="mt-6 text-3xl font-semibold text-slate-900">Our Mission</h3>
            <p className="mt-4 text-base leading-8 text-slate-600">
              To make healthcare accessible and affordable for everyone by
              providing transparent pricing, real-time availability, and easy
              access to pharmacies in your community.
            </p>
          </article>

          <article className="rounded-[22px] bg-emerald-50 px-6 py-8 sm:px-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <Heart size={24} />
            </div>
            <h3 className="mt-6 text-3xl font-semibold text-slate-900">Our Vision</h3>
            <p className="mt-4 text-base leading-8 text-slate-600">
              A world where everyone has instant access to life-saving
              medications at fair prices, with the convenience of modern
              technology and the trust of traditional pharmacy care.
            </p>
          </article>
        </section>

        <section className="mt-16">
          <h3 className="text-center text-4xl font-semibold text-slate-900">
            Why Choose PharmaCare?
          </h3>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <article key={feature.title} className="text-center">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${feature.iconClass}`}
                  >
                    <Icon size={28} />
                  </div>
                  <h4 className="mt-5 text-2xl font-medium text-slate-900">
                    {feature.title}
                  </h4>
                  <p className="mt-4 text-base leading-8 text-slate-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-14 rounded-[22px] bg-linear-to-r from-blue-600 to-blue-800 px-6 py-8 text-white shadow-[0_20px_60px_rgba(37,99,235,0.25)] sm:px-8 lg:px-12">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-semibold">{stat.value}</p>
                <p className="mt-3 text-sm text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-4xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Users size={40} />
          </div>
          <h3 className="mt-6 text-4xl font-semibold text-slate-900">
            Built by Healthcare Experts
          </h3>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Our team consists of pharmacists, healthcare professionals, and
            technology experts dedicated to improving healthcare accessibility
            for everyone.
          </p>
        </section>
      </main>

      <PharmaFooter />
    </div>
  );
}
