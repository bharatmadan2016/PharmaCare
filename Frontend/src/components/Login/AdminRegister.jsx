import React from "react";
import AdminIcon from "../../assets/Admin.png";
import RoleRegisterPage from "./RoleRegisterPage.jsx";

export default function AdminRegister() {
  return (
    <RoleRegisterPage
      accentClass="from-purple-50 to-purple-100"
      icon={AdminIcon}
      title="Create Admin Account"
      subtitle="Register as an administrator"
      role="Admin"
      loginPath="/admin-login"
      loginLabel="Login as Admin"
      submitLabel="Register as Admin"
      successRedirectPath="/admin-login"
      successMessage="Admin registration successful! Redirecting to login..."
    />
  );
}
