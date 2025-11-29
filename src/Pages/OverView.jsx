import React, { useEffect, useState } from "react";
const webUserId = localStorage.getItem("webMonitoringuserId");

// --- Inline SVG Icons (Reliable replacements for react-icons) ---

// Logo Icon (Hexagon/Diamond)
const DiamondIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2L2 12l10 10 10-10L12 2zM12 5.17l5.83 5.83L12 18.83 6.17 11z" />
  </svg>
);

// Monitoring/Refresh Icon
const RefreshIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.55 16.27a8.77 8.77 0 0 0 11.23.63" />
    <path d="M20.45 7.73a8.77 8.77 0 0 0-11.23-.63" />
  </svg>
);

// Domain Icon (Globe)
const DomainIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2a14.5 14.5 0 0 0 0 20M2 12h20"></path>
  </svg>
);

// Email Icon (Mail)
const EmailIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

// Upload Icon
const UploadIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

// --- Custom Components ---

// Dashboard Stats Card
const StatsCard = ({ icon: Icon, title, value, description, color }) => (
  <div className="p-5 bg-blue-900/50 rounded-xl shadow-xl border border-blue-700/50 flex flex-col justify-between h-full">
    <div className={`flex items-center space-x-3 text-sm font-medium ${color}`}>
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </div>
    <div className="mt-2">
      <h3 className="text-4xl font-bold text-white">{value}</h3>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  </div>
);

// Monitoring Frequency Radios
const MonitoringFrequency = ({ selected, setSelected }) => {
  const options = ["Check Now", "Daily", "Biweekly", "Weekly", "Monthly"];
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center space-x-3 cursor-pointer text-gray-300 hover:text-white"
        >
          <input
            type="radio"
            name="frequency"
            value={option}
            checked={selected === option}
            onChange={() => setSelected(option)}
            className="hidden" // Hide native radio button
          />
          <span
            className={`w-4 h-4 rounded-full border-2 transition-colors duration-200
              ${selected === option
                ? "border-pink-500 bg-pink-500"
                : "border-gray-500 bg-transparent"
              }
            `}
          ></span>
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
};

// --- Main Content Components (Forms) ---

// Component for the Domain Monitoring Tab
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DomainMonitoringForm = ({ emailsFornoti }) => {
  const [domainName, setDomainName] = useState("");
  const [frequency, setFrequency] = useState("Check Now");
  const [checkNow, setCheckNow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Automatically manage checkNow logic
  useEffect(() => {
    if (frequency === "Check Now") {
      setCheckNow(true);
    } else {
      setCheckNow(false);
    }
  }, [frequency]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,10}$/;


    if (!domainName) {
      toast.error("Please enter a domain name!");
      setLoading(false);
      return;
    }

    if (!domainRegex.test(domainName)) {
      toast.error("Invalid Domain Format. Please Enter the Correct Domain!");
      setLoading(false);
      return;
    }

    if (!frequency) {
      toast.error("Please select a monitoring frequency!");
      setLoading(false);
      return;
    }

    const finalFrequency =
      frequency === "Check Now" ? "daily" : frequency.toLowerCase();

    const payload = {
      domain: domainName,
      frequency: finalFrequency,
      notifyEmails: [emailsFornoti],
      createdBy: webUserId,
      checkNow: checkNow,
    };

    try {
      const response = await axios.post(
        "http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring/watch/domain",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response:", response.data);
      const breaches = response?.data?.breaches || [];

      if (checkNow) {
        // for "Check Now" mode
        if (breaches.length > 0) {
          toast.success(
            `${breaches.length} breach(es) found! Please check the incidents page.`
          );
        } else {
          toast.info(response.data.message || "No breaches found during the check.");
        }
      } else {
        // Normal monitoring mode with custom messages
        const frequencyMessages = {
          daily:
            "Daily domain monitoring enabled. We’ll scan your domain every day at 9:00 AM IST and immediately notify you if we find any new dark-web exposure or suspicious activity.",
          weekly:
            "Weekly domain monitoring activated. We’ll scan your domain every Monday at 9:00 AM IST and alert you if we detect any suspicious activity.",
          biweekly:
            "Bi-weekly domain monitoring enabled. We’ll run a domain scan every 14 days at 9:00 AM IST and notify you immediately if any breach indicators appear.",
          monthly:
            "Monthly domain monitoring selected. We’ll scan your domain on the 1st of every month at 9:00 AM IST and inform you of any potential exposure.",
        };

        const message =
          frequencyMessages[finalFrequency] ||
          ` Monitoring started for ${domainName} (${finalFrequency}).`;

        toast.success(message, { autoClose: 4000 });
      }

      setDomainName("");
      setFrequency("");
    } catch (error) {
      console.error("Error starting monitoring:", error);

      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      console.log("Error Message:", errMsg);
      toast.error(errMsg); // Optional UI toast
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return "Checking now...";
    if (frequency === "Check Now") return "Check Now";
    return "Start Monitoring";
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
      <div className="space-y-1">
        <h4 className="text-lg font-medium text-gray-300 flex items-center space-x-2">
          <DiamondIcon className="h-5 w-5 text-pink-500" />
          <span>Monitor Domain for Breaches</span>
        </h4>
        <p className="text-sm text-gray-400">
          Enter your domain to monitor for dark web exposure and data breaches.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="domain"
          className="block text-sm font-medium text-gray-300"
        >
          Domain Name
        </label>
        <input
          type="text"
          id="domain"
          value={domainName}
          onChange={(e) => {
            // Remove spaces & @ instantly
            const cleaned = e.target.value
              .replace(/@/g, "")
              .replace(/\s+/g, "");
            setDomainName(cleaned);
          }}
          className="w-full px-4 py-3 bg-gray-950/30 border border-blue-700 rounded-lg text-white placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          placeholder="example.com" // correct format placeholder
          required
          pattern="^[a-zA-Z0-9-]+\.[a-zA-Z]{2,10}$" // one dot + valid extension
        />
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-300 mb-4 flex items-center space-x-2">
          <RefreshIcon className="h-5 w-5 text-pink-500" />
          <span>Monitoring Frequency</span>
        </h4>
        <MonitoringFrequency selected={frequency} setSelected={setFrequency} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 mt-8 text-lg font-semibold rounded-lg text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${loading
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
          }`}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        <span>{getButtonText()}</span>
      </button>
    </form>
  );
};

const EmailMonitoringForm = ({ emailsFornoti }) => {
  const [frequency, setFrequency] = useState("Check Now");
  const [fileName, setFileName] = useState("No file chosen");
  const [file, setFile] = useState(null);
  const [uploadMode, setUploadMode] = useState("manual");
  const [manualEmails, setManualEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkNow, setCheckNow] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle file input
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setFile(e.target.files[0]);
    } else {
      setFileName("No file chosen");
      setFile(null);
    }
  };

  // ✅ Handle checkNow condition automatically
  useEffect(() => {
    if (frequency === "Check Now") {
      setCheckNow(true);
    } else {
      setCheckNow(false);
    }
  }, [frequency]);

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!frequency) {
      toast.error("Please select a monitoring frequency!");
      setLoading(false);
      return;
    }

    const finalFrequency =
      frequency === "Check Now" ? "daily" : frequency.toLowerCase();

    try {
      if (uploadMode === "manual") {
        if (!manualEmails.trim()) {
          toast.error("Please enter  email before submitting!");
          setLoading(false);
          return;
        }

        // ✅ Manual API call
        const body = {
          targetType: "email",
          targetValue: manualEmails.trim(),
          frequency: finalFrequency,
          notifyEmails: [emailsFornoti],
          createdBy: webUserId,
          checkNow: checkNow,
        };

        const res = await axios.post(
          "http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring/watch",
          body,
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("Manual email monitoring started:", res.data);

        // ✅ Response handling
        if (checkNow) {
          // ✅ Instant check mode
          const breaches = res?.data?.breaches || [];
          if (breaches.length > 0) {
            toast.success(
              `${breaches.length} breach(es) found! Please check the incidents page.`
            );
          } else {
            toast.info(res.data.message || "No breaches found during the check.");
          }
        } else {
          // ✅ Frequency-based success messages
          const frequencyMessages = {
            daily:
              "Daily email monitoring enabled. We’ll scan this email address every day at 9:00 AM IST and immediately notify you if it appears in any dark-web dumps or suspicious activity is found.",
            weekly:
              "Weekly email monitoring activated. We’ll scan this email address every Monday at 9:00 AM IST and alert you if we detect any suspicious exposure.",
            biweekly:
              "Bi-weekly email monitoring enabled. We’ll scan this email every 14 days at 9:00 AM IST and notify you immediately if it’s found in any breach or leak.",
            monthly:
              "Monthly email monitoring selected. We’ll scan this email on the 1st of every month at 9:00 AM IST and notify you of any potential exposure.",
          };

          const message =
            frequencyMessages[finalFrequency] ||
            `Monitoring started for ${manualEmails} (${finalFrequency}).`;

          toast.success(message);
        }

        setManualEmails("");
      } else {
        // ✅ Upload mode
        if (!file) {
          toast.error("Please upload a file before submitting!");
          setLoading(false);
          return;
        }

        const finalFrequency =
          frequency === "Check Now" ? "daily" : frequency.toLowerCase();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("frequency", finalFrequency);
        formData.append("notifyEmails", [emailsFornoti]);
        formData.append("createdBy", webUserId);
        formData.append("checkNow", checkNow);

        const res = await axios.post(
          "http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring/watch/email/upload",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (checkNow) {
          // ✅ Instant check mode
          const breaches = res?.data?.breaches || [];
          if (breaches.length > 0) {
            toast.success(
              `${breaches.length} breach(es) found! Please check the incidents page.`
            );
          } else {
            toast.info(res.data.message || "No breaches found during the check.");
          }
        } else {
          // ✅ Frequency-based success messages
          const frequencyMessages = {
            daily:
              "Daily email monitoring enabled. We’ll scan this email address every day at 9:00 AM IST and immediately notify you if it appears in any dark-web dumps or suspicious activity is found.",
            weekly:
              "Weekly email monitoring activated. We’ll scan this email address every Monday at 9:00 AM IST and alert you if we detect any suspicious exposure.",
            biweekly:
              "Bi-weekly email monitoring enabled. We’ll scan this email every 14 days at 9:00 AM IST and notify you immediately if it’s found in any breach or leak.",
            monthly:
              "Monthly email monitoring selected. We’ll scan this email on the 1st of every month at 9:00 AM IST and notify you of any potential exposure.",
          };

          const message =
            frequencyMessages[finalFrequency] ||
            `Monitoring started for ${manualEmails} (${finalFrequency}).`;

          toast.success(message);
        }
        setFile(null);
        setFileName("No file chosen");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to start monitoring. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return "Checking now...";
    if (frequency === "Check Now") return "Check Now";
    if (uploadMode === "manual") return "Start Monitoring";
    return "Upload & Start Monitoring";
  };

  // --- Download Template File ---
  const handleTemplateDownload = async () => {
    try {
      const res = await axios.get(
        "http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring/watch/email/template",
        {
          responseType: "blob", // IMPORTANT
        }
      );

      // Excel blob ko URL me convert karo
      const fileURL = window.URL.createObjectURL(new Blob([res.data]));

      // Download trigger
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "email_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Template downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download template!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h4 className="text-lg font-medium text-gray-300 flex items-center space-x-2">
          <EmailIcon className="h-5 w-5 text-pink-500" />
          <span>Monitor Email Addresses</span>
        </h4>
        <p className="text-sm text-gray-400">
          Upload a list of employee email addresses to monitor for data
          breaches.
        </p>
      </div>

      {/* Frequency */}
      <div>
        <h4 className="text-lg font-medium text-gray-300 mb-4 flex items-center space-x-2">
          <RefreshIcon className="h-5 w-5 text-pink-500" />
          <span>Monitoring Frequency</span>
        </h4>
        <MonitoringFrequency selected={frequency} setSelected={setFrequency} />
      </div>

      {/* Mode Selection */}
      <div className="flex space-x-4 mt-4">
        <button
          type="button"
          onClick={() => setUploadMode("manual")}
          className={`px-4 py-2 rounded-lg border ${uploadMode === "manual"
              ? "bg-pink-600 text-white border-pink-600"
              : "border-gray-600 text-gray-300 hover:bg-gray-700"
            }`}
        >
          Manual Entry
        </button>
        <button
          type="button"
          onClick={() => setUploadMode("upload")}
          className={`px-4 py-2 rounded-lg border ${uploadMode === "upload"
              ? "bg-pink-600 text-white border-pink-600"
              : "border-gray-600 text-gray-300 hover:bg-gray-700"
            }`}
        >
          Upload by Excel/CSV
        </button>
      </div>

      {/* Conditional Inputs */}
      {uploadMode === "manual" ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Enter Email Address
          </label>
          <input
            type="email"
            value={manualEmails}
            onChange={(e) => setManualEmails(e.target.value)}
            placeholder="example@gmail.com"
            className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 border border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex  items-center gap-3">
            <label className="block text-sm font-medium text-gray-300">
              Upload Email List (CSV/Excel)
            </label>

            <button
              className="px-2 py-1 bg-pink-600 text-white text-xs rounded-lg hover:bg-pink-500 transition-colors"
              type="button"
              onClick={handleTemplateDownload}
            >
              Download Template
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <label className="cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".csv,.xlsx,.xls,.txt"
              />
              <span className="px-4 py-2 bg-pink-600 text-white rounded-lg shadow-md hover:bg-pink-500 transition-colors">
                Choose File
              </span>
            </label>
            <span className="text-gray-400 truncate">{fileName}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: CSV, XLSX, XLS, TXT (one email per line)
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 mt-8 text-lg font-semibold rounded-lg text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${loading
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
          }`}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        <UploadIcon className="h-5 w-5" />
        <span>{getButtonText()}</span>
      </button>
    </form>
  );
};

// --- Main Application Component ---
const Overview = () => {
  const [activeFormTab, setActiveFormTab] = useState("domain"); // domain or email
  const currentYear = new Date().getFullYear();
  const [emailsFornoti, setEmailsForNoti] = useState([]);

  const fetchUserProfile = async () => {
    const API = `http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring-users/${webUserId}`;

    const authToken = localStorage.getItem("webMonitoringToken");

    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(res);
      setEmailsForNoti(res.data.email);

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
  }, []);

  // Data for the top status cards (Image 1)
  return (
    <div className="min-h-screen bg-[#0b203a] flex flex-col font-sans">
      {/* 2. Main Dashboard Content Area */}
      <main className="flex-grow flex flex-col items-center pt-10 pb-20 px-4">
        <div className="max-w-7xl w-full mx-auto">
          {/* 2.1. Status Cards (Image 852979.png - Top Section) */}

          {/* 2.2. Monitoring Form Container (Images 852979.png and 8529b5.png - Bottom Section) */}
          <div className="bg-[#1e3a63] border border-blue-700/50 rounded-2xl shadow-2xl p-6">
            {/* Tab Navigation for Domain/Email */}
            <div className="flex w-full bg-blue-950/50 p-1 rounded-xl shadow-inner mb-8">
              <button
                onClick={() => setActiveFormTab("domain")}
                className={`flex-1 flex items-center justify-center py-3 text-sm font-medium transition-all duration-300 rounded-lg
                  ${activeFormTab === "domain"
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xl"
                    : "text-gray-400 hover:text-white"
                  }
                `}
              >
                <DomainIcon className="h-5 w-5 mr-2" />
                <span>Domain Monitoring</span>
              </button>

              <button
                onClick={() => setActiveFormTab("email")}
                className={`flex-1 flex items-center justify-center py-3 text-sm font-medium transition-all duration-300 rounded-lg
                  ${activeFormTab === "email"
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xl"
                    : "text-gray-400 hover:text-white"
                  }
                `}
              >
                <EmailIcon className="h-5 w-5 mr-2" />
                <span>Email Monitoring</span>
              </button>
            </div>

            {/* Render Active Form */}
            <div className="text-white">
              {activeFormTab === "domain" ? (
                <DomainMonitoringForm emailsFornoti={emailsFornoti} />
              ) : (
                <EmailMonitoringForm emailsFornoti={emailsFornoti} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Overview;
