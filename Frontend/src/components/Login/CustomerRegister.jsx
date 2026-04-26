import React from "react";
import CustomerIcon from "../../assets/Customer.png";
import RoleRegisterPage from "./RoleRegisterPage.jsx";

export default function CustomerRegister() {
  return (
    <RoleRegisterPage
      accentClass="from-blue-50 to-blue-100"
      icon={CustomerIcon}
      title="Create Customer Account"
      subtitle="Register to order medicines online"
      role="User"
      loginPath="/customer-login"
      loginLabel="Login as Customer"
      submitLabel="Register as Customer"
      successRedirectPath="/customer-login"
      successMessage="Customer registration successful! Redirecting to login..."
    />
  );
}
