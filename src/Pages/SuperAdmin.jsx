import React from "react";
import { FiDownload } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

const SuperAdmin = () => {
  const user = {
    name: "Udit kumar",
    email: "dashboard123@yopmail.com",
    phone: "1234567890",
    company: "LMS",
    lastLogin: "No Login",
  };

  return (
    <div className="p-6 bg-[#0b203a] min-h-screen">

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-[#06365e] rounded-xl shadow p-5 items-center justify-center text-center">
          <p className="text-white text-xl">Total Users</p>
          <h2 className="text-3xl font-bold mt-2 text-pink-400">39</h2>
        </div>

        <div className="bg-[#06365e] rounded-xl shadow p-5 text-center">
          <p className="text-white text-xl">Total Email Monitored</p>
          <h2 className="text-3xl font-bold mt-2 text-pink-400">33</h2>
        </div>

        <div className="bg-[#06365e] rounded-xl shadow p-5 text-center">
          <p className="text-white text-xl">Total Domain Monitored</p>
          <h2 className="text-3xl font-bold mt-2 text-pink-400">6</h2>
        </div>

      </div>

      {/* User Information Section */}
      <div className="bg-[#052847] rounded-xl shadow p-6 mt-6">
        
        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <FaBuilding className="text-xl text-pink-600" />
          <h2 className="text-3xl font-semibold text-white">User Information</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto text-gray-300 flex justify-center">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-[#052847]">
                <th className="text-left p-3">Full Name</th>
                <th className="text-left p-3">Email ID</th>
                <th className="text-left p-3">Phone Number</th>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Last Login</th>
                <th className="text-center p-3">Download Info</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone || "-"}</td>
                <td className="p-3 pl-6">{user.company || "-"}</td>
                <td className="p-3 pl-4">{user.lastLogin}</td>
                <td className="text-center p-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FiDownload size={20} />
                  </button>
                </td>
              </tr>
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
};

export default SuperAdmin;
