import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginVendor, saveVendorSession } from "../../services/vendor.service.js";
import FormContainer from "./FormContainer";
import PageHeader from "./PageHeader";
import DemoBox from "./DemoBox";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import VendorIcon from "../../assets/Vendor.png";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import BackButton from "../Layout/BackButton.jsx";

export default function VendorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await loginVendor(email, password);
      saveVendorSession(data);

      if (data.vendor.status !== "approved") {
        setMessage(
          data.vendor.status === "rejected"
            ? "Your vendor account has been rejected. Please contact admin support."
            : "Your vendor account is pending admin approval. You can sign in and track the approval status.",
        );
      }

      navigate("/vendor-dashboard");
    } catch (err) {
      setError(err.message || "Vendor login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-green-100">
      <div className="py-10">
        <FormContainer>
          <div className="mb-4">
            <BackButton label="Back" onClick={() => navigate("/signin")} />
          </div>

          <PageHeader
            icon={VendorIcon}
            title="Vendor Login"
            subtitle="Manage your pharmacy"
          />

          <DemoBox email="vendor@demo.com" password="vendor123" />

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              icon="Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="Enter password"
              icon="Lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <SubmitButton text={loading ? "Signing in..." : "Sign In"} />
          </form>

          {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
          {message && <p className="mt-3 text-center text-sm text-green-600">{message}</p>}

          <p className="mt-4 text-center text-gray-600">
            Want to list your pharmacy?{" "}
            <span
              className="cursor-pointer font-medium text-green-600 hover:underline"
              onClick={() => navigate("/vendor-register")}
            >
              Register as Vendor
            </span>
          </p>
        </FormContainer>
      </div>

      <PharmaFooter />
    </div>
  );
}
