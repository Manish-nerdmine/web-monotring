import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { MdEmail, MdLock } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import bgImage from "../Pages/bg-new1.jpg";
import logo from "../Pages/logo.png";

const ResetFlow = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const navigate = useNavigate();

  const BASE_URL =
    "http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring-users";

  // -----------------------------------------
  // STEP 1 - SEND OTP
  // -----------------------------------------
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter an email!");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/forgot-password`, {
        email,
      });

      toast.success(res.data.message || "OTP sent successfully!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // -----------------------------------------
  // STEP 2 - VERIFY OTP
  // -----------------------------------------
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter valid 6 digit OTP!");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/verify-otp`, {
        email,
        otp,
      });

      toast.success(res.data.message || "OTP verified!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  // -----------------------------------------
  // STEP 3 - RESET PASSWORD
  // -----------------------------------------
  const handleResetPassword = async () => {
    if (!newPass || !confirmPass) {
      toast.error("Please fill all fields!");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/reset-password`, {
        email,
        otp,
        newPassword: newPass,
      });

      toast.success(res.data.message || "Password reset successfully!");

      setTimeout(() => {
        navigate("/signup");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email missing!");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/forgot-password`, {
        email,
      });

      toast.success(res.data.message || "OTP resent successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <ToastContainer />

      <div className="bg-[#033b55] p-8 rounded-2xl w-[450px] shadow-xl">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </div>

        <h1 className="text-white text-2xl font-bold text-center">
          Dark Net Tracker
        </h1>

        <p className="text-gray-300 text-center text-sm mb-6">
          {step === 1 && "Reset your password"}
          {step === 2 && "Enter verification code"}
          {step === 3 && "Create new password"}
        </p>

        <p
          className="flex items-center gap-2 text-gray-300 text-sm mb-4 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          <FaArrowLeft /> Back to login
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <p className="text-gray-300 text-sm mb-3">
              Enter your email and we'll send a verification code.
            </p>

            <div className="bg-[#0e506f] flex items-center gap-3 text-gray-300 px-3 py-3 rounded-lg mb-4">
              <MdEmail className="text-xl" />
              <input
                className="bg-transparent outline-none flex-1"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={handleSendOtp}
              className="w-full bg-pink-600 hover:bg-pink-700 transition text-white py-3 rounded-lg font-semibold"
            >
              Send OTP
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <p className="text-gray-300 text-sm mb-3">
              We've sent a verification code to <b>{email}</b>
            </p>

            <input
              className="bg-[#0e506f] text-gray-100 w-full px-3 py-3 rounded-lg mb-4 outline-none text-center text-xl font-semibold"
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-pink-600 hover:bg-pink-700 transition text-white py-3 rounded-lg font-semibold"
            >
              Verify OTP
            </button>

            <p
              className="text-gray-300 text-center mt-3 cursor-pointer"
              onClick={handleResendOtp}
            >
              Resend OTP
            </p>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <p className="text-gray-300 text-sm mb-3">
              Create a strong new password for your account.
            </p>

            <div className="bg-[#0e506f] flex items-center gap-3 text-gray-300 px-3 py-3 rounded-lg mb-4">
              <MdLock className="text-xl" />
              <input
                className="bg-transparent outline-none flex-1"
                type="password"
                placeholder="New Password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>

            <div className="bg-[#0e506f] flex items-center gap-3 text-gray-300 px-3 py-3 rounded-lg mb-4">
              <MdLock className="text-xl" />
              <input
                className="bg-transparent outline-none flex-1"
                type="password"
                placeholder="Confirm New Password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </div>

            <button
              onClick={handleResetPassword}
              className="w-full bg-pink-600 hover:bg-pink-700 transition text-white py-3 rounded-lg font-semibold"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetFlow;
