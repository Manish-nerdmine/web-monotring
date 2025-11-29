import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import bgImage from "../Pages/bg-new1.jpg";
import logo from "../Pages/logo.png";
import PhoneInput from "react-phone-input-2";

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Shared inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup inputs
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [contactno, setContactno] = useState("");

  const [loading, setLoading] = useState(false);

  // OTP popup state
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const SIGNUP_URL =
    "http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring-users/signup";

  const LOGIN_URL =
    "http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring-users/login";

  const VERIFY_OTP_URL = `http://13.50.233.20:7001/auth/api/v1/otp/verify?email=${encodeURIComponent(
    email
  )}&otp=${otp}`;
  // ----------------------------------------
  // SUBMIT FUNCTION (SignIn / SignUp)
  // ----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (isSignIn) {
        // -----------------------------
        // LOGIN WITHOUT OTP
        // -----------------------------
        response = await axios.post(LOGIN_URL, { email, password });

        toast.success("Login Successful!");

        localStorage.setItem("webMonitoringToken", response.data.token);
        localStorage.setItem("webMonitoringuserId", response.data.user);

        // Direct Navigate to Dashboard (NO OTP)
        navigate("/web-dashboard");
        window.location.reload();
        return;
      }

      // -----------------------------
      // SIGNUP → OTP REQUIRED
      // -----------------------------
      response = await axios.post(SIGNUP_URL, {
        fullName,
        email,
        password,
        companyName,
        country,
        contactno,
        isTermsAccepted: true,
      });

      toast.success("OTP sent to your email!");

      localStorage.setItem("webMonitoringToken", response.data.passcode);
      localStorage.setItem("webMonitoringuserId", response.data.user);
      localStorage.setItem("webMonitoringTempUser", response.data.user);

      // 👉 OPEN OTP BOX ONLY FOR SIGNUP
      setShowOtpPopup(true);

    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong!");
    }

    setLoading(false);
  };


  // ----------------------------------------
  // OTP VERIFY FUNCTION
  // ----------------------------------------
  const verifyOtpFunction = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter 6 digit OTP");
      return;
    }

    try {
      const userId = localStorage.getItem("webMonitoringTempUser");

      const response = await axios.post(VERIFY_OTP_URL, {
        user: userId,
        otp: otp,
      });

      toast.success("Email Verified Successfully!");

      // ✅ OTP popup close
      setShowOtpPopup(false);

      // ✅ Success popup open
      setShowSuccessPopup(true);

      // ⏳ 2 sec delay → redirect
      setTimeout(() => {
        navigate("/web-dashboard");
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* MAIN AUTH CARD */}
      <div className="bg-[#013f63] p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
        {/* Logo + Heading */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <h1 className="text-2xl font-bold mt-3">Dark Net Tracker</h1>
          <p className="text-sm text-gray-300">
            Sign in to your account or create a new one
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#003a5c] rounded-lg overflow-hidden mb-6">
          <button
            className={`w-1/2 py-2 font-semibold ${isSignIn ? "bg-[#004b74]" : "bg-transparent"
              }`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </button>

          <button
            className={`w-1/2 py-2 font-semibold ${!isSignIn ? "bg-[#004b74]" : "bg-transparent"
              }`}
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isSignIn && (
            <>
              {/* Full Name */}
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 rounded bg-[#003a5c]"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              {/* Company */}
              <input
                type="text"
                placeholder="Company Name"
                className="w-full px-4 py-2 rounded bg-[#003a5c]"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />

              {/* Country */}
              <input
                type="text"
                placeholder="Country"
                className="w-full px-4 py-2 rounded bg-[#003a5c]"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />

              {/* Contact */}
              <div className="bg-[#003a5c] rounded px-2 py-1">
                <PhoneInput
                  country={"in"}
                  value={contactno}
                  onChange={(phone) => setContactno(phone)}
                  inputStyle={{
                    width: "100%",
                    background: "#003a5c",
                    border: "none",
                    color: "white",
                  }}
                  buttonStyle={{
                    background: "#002b46",
                    border: "none",
                  }}
                />
              </div>
            </>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-[#003a5c]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-[#003a5c]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end">
            <p className="text-gray-300 text-sm underline cursor-pointer mr-2" onClick={() => navigate("/forgot")}>
              Forgot Password
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#d10078] hover:bg-[#b00064] rounded font-semibold"
          >
            {loading ? "Please wait..." : isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>

      {/* ---------------------------- */}
      {/* OTP SUCCESS POPUP */}
      {/* ---------------------------- */}
      {/* OTP Popup */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 text-center">
            {/* Email Icon Circle */}
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l9 6 9-6M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z"
                  />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-800">
              Verify Your Email
            </h2>
            <p className="text-gray-500 text-sm mt-2 mb-1">
              We have sent a 6-digit code to
            </p>

            {/* Email */}
            <p className="text-blue-600  mb-4">{email}</p>

            <p className="text-black text-sm mt-2 mb-4">
              Enter verification code
            </p>

            {/* OTP Boxes */}
            <div className="flex justify-center gap-3 mb-6">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    key={index}
                    maxLength="1"
                    className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:border-purple-500"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]$/.test(value)) {
                        const newOtp = otp.split("");
                        newOtp[index] = value;
                        setOtp(newOtp.join(""));
                        // auto-focus next box
                        if (e.target.nextSibling) {
                          e.target.nextSibling.focus();
                        }
                      }
                    }}
                  />
                ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={verifyOtpFunction}
              className="w-full py-3 bg-purple-900 text-white rounded-lg text-lg font-semibold hover:bg-purple-700"
            >
              Verify Email
            </button>

            {/* Resend */}
            <p className="text-gray-500 text-sm mt-4">
              Didn’t receive code?{" "}
              <span
                className="text-blue-600 cursor-pointer font-semibold"
                onClick={() => toast.info("OTP Resent!")}
              >
                Resend
              </span>
            </p>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-8 text-center animate-bounceIn">
            {/* Tick Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Verification Successful!
            </h2>

            <p className="text-gray-500 mt-2">Redirecting to dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
