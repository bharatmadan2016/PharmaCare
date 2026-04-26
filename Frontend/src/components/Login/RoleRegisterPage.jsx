import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service.js";
import FormContainer from "./FormContainer";
import PageHeader from "./PageHeader";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import BackButton from "../Layout/BackButton.jsx";

export default function RoleRegisterPage({
  accentClass = "from-green-50 to-green-100",
  icon,
  title,
  subtitle,
  role,
  loginPath,
  loginLabel,
  submitLabel,
  successRedirectPath,
  successMessage,
  uiOnly = false,
  uiOnlyMessage = "Registration UI is ready. Backend connection will be added soon.",
}) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (uiOnly) {
        setSuccess(uiOnlyMessage);
      } else {
        await registerUser({
          name,
          email,
          password,
          role,
        });
        setSuccess(successMessage);
        setTimeout(() => navigate(successRedirectPath), 1800);
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-linear-to-b ${accentClass}`}>
      <div className="py-10">
        <FormContainer>
          <div className="mb-4">
            <BackButton label="Back" onClick={() => navigate(-1)} />
          </div>

          <PageHeader icon={icon} title={title} subtitle={subtitle} />

          <form onSubmit={handleSubmit}>
            <InputField
              label="Full Name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              icon="User"
              autoComplete="name"
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon="Mail"
              autoComplete="email"
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              icon="Lock"
              autoComplete="new-password"
            />

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              icon="Lock"
              autoComplete="new-password"
            />

            <SubmitButton text={loading ? "Registering..." : submitLabel} />
          </form>

          {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
          {success && <p className="mt-3 text-center text-sm text-green-600">{success}</p>}

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <span
              className="cursor-pointer font-medium text-green-600 hover:underline"
              onClick={() => navigate(loginPath)}
            >
              {loginLabel}
            </span>
          </p>
        </FormContainer>
      </div>

      <PharmaFooter />
    </div>
  );
}
