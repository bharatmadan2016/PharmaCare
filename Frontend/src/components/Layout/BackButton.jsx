import React from "react";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Back", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
    >
      <ArrowLeft size={15} />
      <span>{label}</span>
    </button>
  );
}
