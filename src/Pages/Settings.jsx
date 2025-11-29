import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiGlobe,
  FiMail,
  FiBell,
  FiShield,
  FiDatabase,
  FiMessageSquare,
  FiShoppingBag,
  FiPlus,
  FiHelpCircle,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import SettingsPage from "../Components/Profile";
const wemonitoringUserId = localStorage.getItem("webMonitoringuserId");

export default function Settings() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [notificationEmailsList, setNotificationEmailsList] = useState([]);

  const fetchUserProfile = async () => {
    const API = `http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring-users/${wemonitoringUserId}`;

    const authToken = localStorage.getItem("webMonitoringToken");

    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(res);

      setFullName(res.data.fullName);
      setCompanyName(res.data.companyName);
      setCountry(res.data.country);
      setContactNo(res.data.contactno);
      setNotificationEmailsList(res.data.notificationEmails);

      return res.data;
    } catch (err) {
      const apiError =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong";

      toast.error(apiError);
      return null;
    }
  };

  useEffect(() => {
    fetchUserProfile();
    console.log(notificationEmailsList);
  }, []);

  // STATES
  const [orgEmail, setOrgEmail] = useState("");
  const [orgEmails, setOrgEmails] = useState([]);

  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyEmails, setNotifyEmails] = useState([]);

  const API = `http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring-users/${wemonitoringUserId}`;
  const API2 = `http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring-users/admin/grant-access/${wemonitoringUserId}`;

  //  Yeh token apne login API se receive hota hai
  const authToken = localStorage.getItem("webMonitoringToken");
  const [grantEmail, setGrantEmail] = useState("");
  const [grantName, setGrantName] = useState("");
  const [grantDepartment, setGrantDepartment] = useState("");
  const [grantEmailList, setGrantEmailList] = useState([]);

  // =================== 1️⃣ ORG EMAIL API CALL ===================
  const handleAddOrgEmail = async () => {
    if (!grantEmail || !grantName || !grantDepartment)
      return toast.error("Please fill all the fields");

    if (grantEmailList.includes(grantEmail))
      return toast.error("Email already added!");

    const body = {
      email: grantEmail,
      fullName: grantName,
      department: grantDepartment,
      role: "admin",
    };

    try {
      const res = await axios.post(API2, body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(res.data?.message || "User Access Granted!");
      setGrantEmailList([...grantEmailList, grantEmail]);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setGrantDepartment("");
      setGrantEmail("");
      setGrantName("");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong"
      );
    }
  };

  // =================== 2️⃣ NOTIFICATION EMAIL API CALL ===================
  const handleAddNotifyEmail = async () => {
    if (!notifyEmail.trim()) return;

    if (notifyEmails.includes(notifyEmail.trim())) {
      toast.error("Email already added!");
      return;
    }

    const updatedList = [...notificationEmailsList, notifyEmail];
    setNotifyEmails(updatedList);
    setNotifyEmail("");

    const body = {
      fullName,
      companyName,
      country,
      contactno: contactNo,
      notificationEmails: updatedList,
      isActive: true,
    };

    try {
      const res = await axios.put(API, body, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(res.data?.message || "Notify Email Added!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong"
      );
    }
  };

  useEffect(() => {
    handleAddNotifyEmail();
  }, []);

  const handleDeleteOrgEmail = async (userId) => {
    try {
      const res = await axios.delete(
        `http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring-users/admin/revoke-access/${userId}`
      );

      toast.success("Access revoked!");

      // UI se remove karo
      setGrantEmailList((prev) => prev.filter((item) => item._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to revoke access!");
    }
  };

  const handleDeleteNotifyEmail = async (index, emailId) => {
    try {
      // DELETE API URL
      const url = `http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring-users/me/notification-emails/${wemonitoringUserId}`;

      // API Call
      const response = await axios.delete(url, {
        data: {
          email: emailId, // your payload
        },
      });

      // Success Toast
      toast.success("Email deleted successfully!");

      // Update UI state
      const updated = notificationEmailsList.filter((_, i) => i !== index);
      setNotificationEmailsList(updated);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete email!");
    }
  };

  const fetchGrantedUsers = async () => {
    try {
      const res = await axios.get(
        `http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring-users/admin/grant-access/${wemonitoringUserId}`
      );

      setGrantEmailList(res.data); // API already returning array of users
    } catch (err) {
      toast.error("Failed to fetch granted users!");
    }
  };

  useEffect(() => {
    fetchGrantedUsers();
  }, []);

  console.log(notificationEmailsList);

  return (
    <div className="min-h-screen bg-[#0b203a] text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* --- Title --- */}
        <div>
          <h1 className="text-2xl font-bold mb- flex gap-2 items-center">
            <FiBell className="text-pink-400" /> Dark Web Monitoring Settings
          </h1>
          <p className="text-gray-400">
            Configure your monitoring preferences and alerts
          </p>
        </div>

        {/* ======================================================= */}
        {/* 1️⃣ ORGANIZATION ACCESS SECTION — UPDATED UI LIKE SCREENSHOT */}
        {/* ======================================================= */}

        <section className="bg-[#122b4d] rounded-2xl p-6 shadow-md border border-[#1d355d]">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiShield className="text-pink-400" /> Grant User Access
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Add team members who should receive access to the product
          </p>

          {/* INPUTS */}
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-300">Email Address</label>
              <input
                type="email"
                placeholder="user@example.com"
                value={grantEmail}
                required
                onChange={(e) => setGrantEmail(e.target.value)}
                className="w-full mt-1 bg-[#0b203a] border border-[#1e3a63] text-white px-4 py-3 rounded-xl outline-none"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="text-sm text-gray-300">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={grantName}
                onChange={(e) => setGrantName(e.target.value)}
                className="w-full mt-1 bg-[#0b203a] border border-[#1e3a63] text-white px-4 py-3 rounded-xl outline-none"
              />
            </div>

            {/* Department */}
            <div>
              <label className="text-sm text-gray-300">Department</label>
              <input
                type="text"
                placeholder="Security, IT, etc."
                className="w-full mt-1 bg-[#0b203a] border border-[#1e3a63] text-white px-4 py-3 rounded-xl outline-none"
                value={grantDepartment}
                onChange={(e) => setGrantDepartment(e.target.value)}
              />
            </div>

            {/* Add button */}
            <button
              onClick={handleAddOrgEmail}
              className="bg-pink-600 hover:bg-pink-700 w-fit px-6 py-2.5 rounded-xl flex items-center gap-2"
            >
              <FiPlus /> Add
            </button>
          </div>

          {/* Divider */}
          <hr className="border-[#1e3a63] my-6" />

          {/* USERS LIST */}
          <h3 className="text-gray-200 font-medium mb-2">
            Users with Access ({grantEmailList.length})
          </h3>

          <div className="space-y-3">
            {grantEmailList.map((item) => (
              <div
                key={item._id}
                className="bg-[#1e3a63] p-4 rounded-xl flex items-center justify-between"
              >
                {/* Left — Avatar + User Info */}
                <div className="flex items-center gap-4">
                  <div className="bg-pink-600 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                    {item?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <p className="text-white font-medium">{item.fullName}</p>
                    <p className="text-gray-300 text-sm">{item.email}</p>
                    <p className="text-gray-500 text-xs">
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDeleteOrgEmail(item._id)}
                  className="text-red-400 hover:text-red-500"
                >
                  <FiX size={20} />
                </button>
              </div>
            ))}

            {grantEmailList.length === 0 && (
              <p className="text-gray-400 text-sm">No users added yet.</p>
            )}
          </div>

          {/* INFO BOX — Same UI Like Screenshot */}
          <div className="mt-6 bg-[#0c2650] border border-[#2f5fa5] rounded-2xl p-6 text-gray-300">
            <div className="flex items-center gap-2 mb-3">
              <FiMail className="text-pink-400" size={20} />
              <h3 className="text-white font-semibold">
                What happens when you add a user?
              </h3>
            </div>

            <ul className="text-sm space-y-1">
              <li>
                • They receive an email with login credentials and access
                instructions
              </li>
              <li>• Access is granted immediately </li>
              <li>
                • They can log in and start using the Dark Web Monitoring
                product
              </li>
              <li>
                • You can revoke access anytime by removing them from the list
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-[#122b4d] rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiMail className="text-pink-400" /> Breach Notification Emails
          </h2>

          <p className="text-gray-400 text-sm mb-4">
            Add email addresses where you want to receive breach notifications
          </p>

          <div className="flex gap-3 items-center">
            <input
              type="email"
              placeholder="notification@example.com"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="w-full bg-[#0b203a] border border-[#1e3a63] text-white px-4 py-2 rounded-xl outline-none"
            />

            <button
              onClick={handleAddNotifyEmail}
              className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <FiPlus /> Add
            </button>
          </div>

          <div className="mt-3 text-gray-400 text-sm">
            {notificationEmailsList.length === 0 ? (
              <p>No notification emails added yet.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {notificationEmailsList.map((item, index) => (
                  <li
                    key={index}
                    className="bg-[#1e3a63] px-3 py-2 rounded-lg text-white text-sm flex justify-between items-center"
                  >
                    {item}
                    <button
                      onClick={() => handleDeleteNotifyEmail(index, item)}
                      className="text-red-400 hover:text-red-500 ml-3"
                    >
                      <FiX size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ======================================================= */}
        {/*   OTHER STATIC SECTIONS — 100% ORIGINAL CODE  */}
        {/* ======================================================= */}

        {/* --- Monitored Assets --- */}
        <section className="bg-[#122b4d] rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiShield className="text-pink-400" /> Monitored Assets
          </h2>

          <div className="space-y-6">
            {/* Domains */}
            <div>
              <h3 className="font-medium flex items-center gap-2 text-gray-200">
                <FiGlobe className="text-blue-400" /> Domains
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Monitor your organization’s domains for credentials, data
                breaches, and mentions on dark web forums, paste sites, and
                marketplaces.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-[#1e3a63] text-sm px-3 py-1 rounded-full">
                  Example: company.com
                </span>
                <span className="bg-[#1e3a63] text-sm px-3 py-1 rounded-full">
                  Example: subdomain.company.com
                </span>
              </div>
            </div>

            {/* Email Addresses */}
            <div>
              <h3 className="font-medium flex items-center gap-2 text-gray-200">
                <FiMail className="text-blue-400" /> Email Addresses
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Track specific email addresses for compromised credentials, data
                leaks, and appearances in known breaches.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-[#1e3a63] text-sm px-3 py-1 rounded-full">
                  Example: admin@company.com
                </span>
                <span className="bg-[#1e3a63] text-sm px-3 py-1 rounded-full">
                  Example: user@company.com
                </span>
              </div>
            </div>
          </div>
        </section>


        {/* --- Monitored Sources --- */}
        <section className="bg-[#122b4d] rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiDatabase className="text-pink-400" /> Monitored Sources
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Dark web locations we continuously scan for threats
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#1e3a63] p-4 rounded-xl flex items-start gap-3">
              <FiMessageSquare className="text-blue-400 mt-1" size={20} />
              <div>
                <h3 className="font-semibold">Dark Web Forums</h3>
                <p className="text-sm text-gray-400">
                  Hacker forums and underground communities.
                </p>
              </div>
            </div>

            <div className="bg-[#1e3a63] p-4 rounded-xl flex items-start gap-3">
              <FiDatabase className="text-blue-400 mt-1" size={20} />
              <div>
                <h3 className="font-semibold">Paste Sites</h3>
                <p className="text-sm text-gray-400">
                  Public data dumps and leaked credentials.
                </p>
              </div>
            </div>

            <div className="bg-[#1e3a63] p-4 rounded-xl flex items-start gap-3">
              <FiShoppingBag className="text-blue-400 mt-1" size={20} />
              <div>
                <h3 className="font-semibold">Marketplaces</h3>
                <p className="text-sm text-gray-400">
                  Criminal marketplaces selling stolen data.
                </p>
              </div>
            </div>

            <div className="bg-[#1e3a63] p-4 rounded-xl flex items-start gap-3">
              <FiMessageSquare className="text-blue-400 mt-1" size={20} />
              <div>
                <h3 className="font-semibold">Chat Platforms</h3>
                <p className="text-sm text-gray-400">
                  Encrypted messaging channels and groups.
                </p>
              </div>
            </div>
          </div>
        </section>

        <SettingsPage />

        {/* --- Need Help / Support Section --- */}
        <section className="bg-[#122b4d] rounded-2xl p-6 shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiHelpCircle className="text-pink-400" /> Need help contact us on
          </h2>

          <div className="bg-[#1e3a63] p-4 rounded-xl">
            <p className="text-gray-300 font-semibold text-lg">
              Support@kevlardefence.com
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
