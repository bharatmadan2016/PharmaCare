import React from "react";
import { useNavigate } from "react-router-dom";
import Users from "../../assets/Users.png";
import Admin from "../../assets/Admin.png";
import Vendor from "../../assets/Vendor.png";
import Customer from "../../assets/Customer.png";
import RoleCard from "./RoleCard.jsx";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import BackButton from "../Layout/BackButton.jsx";
import "./LoginOuter.css";

const LoginOuter = ({ mode = "login" }) => {
  const navigate = useNavigate();
  const isRegisterMode = mode === "register";

  return (
    <div className="min-h-screen bg-[#F0F4F8] selection:bg-blue-100">
      <div className="LoginOuter px-4 pb-20 pt-12 flex flex-col items-center">
        <div className="w-full max-w-7xl px-6 mb-4">
          <BackButton
            label="Back to Home"
            onClick={() => navigate("/")}
          />
        </div>
        
        <div className="Logo mb-8">
          <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl transform hover:rotate-6 transition-transform duration-500">
            <img className="w-20 h-20 object-contain" src={Users} alt="PharmaCare Logo" />
          </div>
        </div>

        <div className="Page_Header max-w-3xl text-center mb-16">
          <h1 className="text-6xl font-black tracking-tight text-slate-900 mb-6">
            Welcome to <span className="text-[#009973]">PharmaCare</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            {isRegisterMode
              ? "Join our healthcare network today. Select a role that best describes you to begin your journey."
              : "Access your healthcare portal. Please choose your role to proceed with personalized services."}
          </p>
        </div>

        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4 items-stretch">
            <RoleCard
              image={Customer}
              title="I am a Customer"
              description={"• Order medicines online\n• Browse verified pharmacies\n• Compare local prices\n• Live order tracking"}
              btnText={isRegisterMode ? "Register Now" : "Continue Login"}
              btnColor="bg-gradient-to-r from-blue-600 to-indigo-600"
              onClick={() => navigate(isRegisterMode ? "/customer-register" : "/customer-login")}
            />
            <RoleCard
              image={Vendor}
              title="I am a Vendor"
              description={"• List your pharmacy\n• Digital inventory management\n• Process online orders\n• Grow your business"}
              btnText={isRegisterMode ? "Join as Vendor" : "Vendor Portal"}
              btnColor="bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={() => navigate(isRegisterMode ? "/vendor-register" : "/vendor-login")}
            />
            <RoleCard
              image={Admin}
              title="I am an Admin"
              description={"• System administration\n• User management\n• Business analytics\n• Security controls"}
              btnText={isRegisterMode ? "Admin Request" : "Admin Panel"}
              btnColor="bg-gradient-to-r from-slate-700 to-slate-900"
              onClick={() => navigate(isRegisterMode ? "/admin-register" : "/admin-login")}
            />
          </div>
        </div>
      </div>
      <PharmaFooter />
    </div>
  );
};

export default LoginOuter;
