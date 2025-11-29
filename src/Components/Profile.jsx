// SettingsPage.jsx
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaUserAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const role = "admin";
  const [country, setCountry] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [notificationEmails, setNotificationEmails] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [companyName, setCompanyName] = useState("");

  // Security form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password visibility
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // user id
  const uId = typeof window !== "undefined" ? localStorage.getItem("webMonitoringuserId") : null;

  // Fetch user details
  useEffect(() => {
    if (!uId) return;

    const fetchUser = async () => {
      try {
        setLoadingProfile(true);
        const res = await axios.get(
          `http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring-users/${uId}`
        );
        console.log("User Details:", res.data);
        setFullName(res.data?.fullName ?? "");
        setEmail(res.data?.email ?? "");
        setCountry(res.data?.country ?? "");
        setContactNo(res.data?.contactNo ?? "");
        setNotificationEmails(res.data?.notificationEmails || []);
        setIsActive(res.data?.isActive ?? true);
        setCompanyName(res.data?.companyName ?? "");
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUser();
  }, [uId]);

  // Profile Save
  async function handleProfileSave(e) {
    e.preventDefault();

    if (!uId) return toast.error("User ID missing!");

    if (!fullName.trim() || !email.trim()) {
      toast.error("Please provide name and email.");
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      country: country.trim(),
      contactno: contactNo.trim(),
      notificationEmails: notificationEmails,
      isActive: isActive,
      companyName: companyName.trim(),
    };

    try {
      setSavingProfile(true);
      await axios.put(
        `http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring-users/${uId}`,
        payload
      );
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile!");
    } finally {
      setSavingProfile(false);
    }
  }

  // Password Update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!uId) return toast.error("User ID missing!");

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    if (!oldPassword || !newPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    try {
      setUpdatingPassword(true);

      const res = await axios.put(
        `http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring-users/me/change-password/${uId}`,
        {
          currentPassword: oldPassword,
          newPassword: newPassword,
        }
      );

      if (res.status === 200) {
        toast.success("Password updated!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update password!");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div >
      <div className="w-full  bg-[#122b4d] rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-purple-100">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-md flex items-center justify-center">
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-indigo-600"
              >
                <path
                  d="M12 2L2 7v10l10 5 10-5V7L12 2z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Profile</h1>
              <p className="text-sm text-gray-200">
                Update your account profile information
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-10 py-10">
          {/* Tabs */}
          <div className="flex border-b mb-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-3 px-6 -mb-px text-sm font-medium flex items-center gap-2 ${activeTab === "profile"
                  ? "border-b-4 border-indigo-600 text-indigo-600"
                  : "text-gray-200 hover:text-gray-200"
                }`}
            >
              <FaUser /> Profile
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`py-3 px-6 -mb-px text-sm font-medium flex items-center gap-2 ${activeTab === "security"
                  ? "border-b-4 border-indigo-600 text-indigo-600"
                  : "text-gray-200 hover:text-gray-200"
                }`}
            >
              <FaLock /> Security
            </button>
          </div>

          {/* Profile Section */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-200">
                  Full Name
                </label>
                <div className="mt-2 flex items-center bg-[#0b203a] border border-gray-200 rounded-md px-4 py-3">
                  <FaUserAlt className="text-gray-200 mr-3" />
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-gray-200"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-200">Email</label>
                <div className="mt-2 flex items-center bg-[#0b203a] border border-gray-200 rounded-md px-4 py-3">
                  <FaEnvelope className="text-gray-200 mr-3" />
                  <input
                    type="email"
                    value={email}
                    className="w-full bg-transparent focus:outline-none text-gray-200"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-200">Role</label>
                <div className="mt-2 flex items-center bg-[#0b203a] border border-gray-200 rounded-md px-4 py-3">
                  <FaUserAlt className="text-gray-200 mr-3" />
                  <input
                    value="Admin"
                    readOnly
                    className="w-full bg-transparent focus:outline-none text-gray-200"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl text-white font-medium transition-transform transform hover:scale-[1.01] ${savingProfile ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  style={{
                    background:
                      "linear-gradient(90deg,#2b2b78, #5d2ea6, #a451b5)",
                  }}
                  disabled={savingProfile || loadingProfile}
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {loadingProfile && (
                <p className="text-sm text-gray-200">Loading profile...</p>
              )}
            </form>
          )}

          {/* Security Section */}
          {activeTab === "security" && (
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-200">
                  Old Password
                </label>
                <div className="mt-2 flex items-center bg-[#0b203a] border border-gray-200 rounded-md px-4 py-3">
                  <FaLock className="text-gray-200 mr-3" />
                  <input
                    type={showOld ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-gray-200"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="ml-3 text-gray-500 hover:text-gray-700"
                  >
                    {showOld ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-200">
                  New Password
                </label>
                <div className="mt-2 flex items-center bg-[#0b203a] border border-gray-200 rounded-md px-4 py-3">
                  <FaLock className="text-gray-200 mr-3" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-gray-200"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="ml-3 text-gray-500 hover:text-gray-700"
                  >
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-200">
                  Confirm Password
                </label>
                <div className="mt-2 flex items-center bg-[#0b203a] border border-gray-200 rounded-md px-4 py-3">
                  <FaLock className="text-gray-200 mr-3" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-gray-200"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="ml-3 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl text-white font-medium transition-transform transform hover:scale-[1.01] ${updatingPassword ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  style={{
                    background:
                      "linear-gradient(90deg,#2b2b78, #5d2ea6, #a451b5)",
                  }}
                  disabled={updatingPassword}
                >
                  {updatingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
