import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
const webUserId = localStorage.getItem("webMonitoringuserId");

const Dashboards = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#e91e63", "#ff9800", "#4caf50", "#2196f3"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring/dashboard?userId=${webUserId}`
        );
        setData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#052847] flex items-center justify-center text-white">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#052847] flex items-center justify-center text-red-400">
        Error loading data
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#052847] text-white p-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Total Incidents */}
        <div className="bg-[#06365e] p-5 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold">Total Incidents</h2>
            <FaChartLine className="text-blue-400" />
          </div>
          <p className="text-3xl font-bold">{data.totalIncidents}</p>
          <p className="text-green-400 text-sm mt-1">
            +{data.totalIncidentsChange}% from last month
          </p>
        </div>

        {/* Open Incidents */}
        <div className="bg-[#06365e] p-5 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold">Open Incidents</h2>
            <FaExclamationTriangle className="text-pink-500" />
          </div>
          <p className="text-3xl font-bold">{data.openIncidents}</p>
          <p className="text-green-400 text-sm mt-1">
            +{data.openIncidentsChange}% from last month
          </p>
        </div>

        {/* Resolved */}
        <div className="bg-[#06365e] p-5 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold">Resolved</h2>
            <FaCheckCircle className="text-green-400" />
          </div>
          <p className="text-3xl font-bold">{data.resolved}</p>
          <p className="text-green-400 text-sm mt-1">
            +{data.resolvedChange}% from last month
          </p>
        </div>


      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Incidents by Severity */}
        <div className="bg-[#06365e] p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-pink-400 mb-4">
            <FaShieldAlt /> Incidents by Severity
          </h2>
          {data.incidentsBySeverity && data.incidentsBySeverity.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.incidentsBySeverity}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ severity, percentage }) =>
                    `${severity} ${percentage}%`
                  }
                >
                  {data.incidentsBySeverity.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-48 text-gray-400">
              No incidents data available
            </div>
          )}
        </div>

        {/* Breach Types */}
        <div className="bg-[#06365e] p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-purple-400 mb-4">
            <FaChartLine /> Breach Types
          </h2>
          {data.breachTypes && data.breachTypes.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.breachTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#e91e63" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-48 text-gray-400">
              No breach type data available
            </div>
          )}
        </div>
      </div>

      {/* Bottom Card */}

    </div>
  );
};

export default Dashboards;
