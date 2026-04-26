import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, saveAuthSession } from "../../services/auth.service.js";
import FormContainer from "./FormContainer";
import PageHeader from "./PageHeader";
import DemoBox from "./DemoBox";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import AdminIcon from "../../assets/Admin.png";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import BackButton from "../Layout/BackButton.jsx";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      if (data.user.role !== "Admin") {
        throw new Error("Please login with an admin account.");
      }
      saveAuthSession(data);
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 to-purple-100">
      <div className="py-10">
        <FormContainer>
          <div className="mb-4">
            <BackButton label="Back" onClick={() => navigate("/signin")} />
          </div>

          <PageHeader
            icon={AdminIcon}
            title="Admin Login"
            subtitle="Manage the platform"
          />

          <DemoBox email="admin@demo.com" password="admin123" />

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

          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <span
              className="cursor-pointer font-medium text-purple-600 hover:underline"
              onClick={() => navigate("/admin-register")}
            >
              Register as Admin
            </span>
          </p>
        </FormContainer>
      </div>

      <PharmaFooter />
    </div>
  );
}
