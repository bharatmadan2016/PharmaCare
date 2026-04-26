import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "./FormContainer";
import PageHeader from "./PageHeader";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import VendorIcon from "../../assets/Vendor.png";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import BackButton from "../Layout/BackButton.jsx";
import { registerVendor } from "../../services/vendor.service.js";

export default function VendorRegister() {
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!ownerName || !pharmacyName || !phone || !email || !password || !confirmPassword) {
      setError("Please fill out all vendor details.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerVendor({
        ownerName,
        pharmacyName,
        phone,
        email,
        password,
      });
      setSuccess("Vendor registration submitted. Please wait for admin approval before inventory access is enabled.");
      setTimeout(() => navigate("/vendor-login"), 1800);
    } catch (err) {
      setError(err.message || "Vendor registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-green-100">
      <div className="py-10">
        <FormContainer>
          <div className="mb-4">
            <BackButton label="Back" onClick={() => navigate("/register")} />
          </div>

          <PageHeader
            icon={VendorIcon}
            title="Create Vendor Account"
            subtitle="Register your pharmacy for admin approval"
          />

          <form onSubmit={handleSubmit}>
            <InputField
              label="Owner Name"
              name="ownerName"
              type="text"
              value={ownerName}
              onChange={(event) => setOwnerName(event.target.value)}
              placeholder="Owner full name"
              icon="User"
              autoComplete="name"
            />

            <InputField
              label="Pharmacy Name"
              name="pharmacyName"
              type="text"
              value={pharmacyName}
              onChange={(event) => setPharmacyName(event.target.value)}
              placeholder="Pharmacy name"
              icon="User"
            />

            <InputField
              label="Phone Number"
              name="phone"
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone number"
              icon="User"
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              icon="Mail"
              autoComplete="email"
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              icon="Lock"
              autoComplete="new-password"
            />

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm password"
              icon="Lock"
              autoComplete="new-password"
            />

            <SubmitButton text={loading ? "Registering..." : "Register as Vendor"} />
          </form>

          {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
          {success && <p className="mt-3 text-center text-sm text-green-600">{success}</p>}

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <span
              className="cursor-pointer font-medium text-green-600 hover:underline"
              onClick={() => navigate("/vendor-login")}
            >
              Login as Vendor
            </span>
          </p>
        </FormContainer>
      </div>

      <PharmaFooter />
    </div>
  );
}
