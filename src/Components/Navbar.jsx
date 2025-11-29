import React from "react";
import { FiLogOut } from "react-icons/fi"; // Logout icon
import logo from "../Pages/logo.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("webMonitoringuserId");
    toast.success("Signed Out Successfully!");
    navigate("/signup");
    setTimeout(() => {
      window.location.reload();
    }, 2000); // 2 seconds
  };
  return (
    <header className="bg-[#113b5c] text-white w-full border-b border-gray-700 shadow-md">
      <div className="max-w-9xl mx-auto h-20 flex justify-between items-center px-8">
        {/* Left side: Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-12 w-18" />
        </div>

        {/* Right side: Sign Out button */}
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-[#113b5c] border border-[#1f4e78] rounded-md 
           hover:bg-purple-600 transition-all duration-200"
          onClick={handleSignOut}
        >
          <FiLogOut className="text-white text-lg" />
          <span className="text-white font-medium">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
