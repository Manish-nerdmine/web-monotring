import React, { useEffect, useState } from "react";
import axios from "axios";
const userId = localStorage.getItem("webMonitoringuserId");

// --- SVG Icon ---
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

// --- Severity Badge ---
const SeverityBadge = ({ severity }) => {
  const colorMap = {
    HIGH: "bg-pink-800 text-pink-200",
    MEDIUM: "bg-yellow-700 text-yellow-100",
    LOW: "bg-green-700 text-green-100",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${colorMap[severity] || "bg-gray-700 text-gray-200"
        }`}
    >
      {severity}
    </span>
  );
};

// --- Status Badge ---
const StatusBadge = ({ status }) => {
  const colorMap = {
    OPEN: "bg-pink-800 text-pink-200",
    RESOLVED: "bg-pink-900 text-pink-300",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${colorMap[status] || "bg-gray-700 text-gray-300"
        }`}
    >
      {status}
    </span>
  );
};

// --- Details Modal ---
const DetailsModal = ({ group, onClose }) => {
  if (!group) return null;
  const firstIncident = group.incidents[0];

  const detectedDate = new Date(firstIncident.detectedAt).toLocaleString(
    "en-IN"
  );
  const severity = firstIncident.severity || "HIGH";
  const status = firstIncident.incidentStatus.toUpperCase();
  const type = firstIncident.targetType;
  const tagetValue = firstIncident.targetValue;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0f2747] text-gray-100 w-full max-w-3xl rounded-2xl shadow-2xl border border-blue-800/40 overflow-hidden max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="flex items-start justify-between p-6 border-b border-blue-800/40 sticky top-0 bg-[#0f2747] z-20">
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              Incident ID:{" "}
              <span className="text-blue-300">{group.incidentId}</span>
            </h3>

            <div className="mt-2 text-sm text-gray-300 flex gap-3 items-center">
              <p>
                <strong>Detected:</strong> {detectedDate}
              </p>
              <p>
                <StatusBadge status={status} />
              </p>
              <p>
                <SeverityBadge severity={severity} />
              </p>
            </div>

            <div className="mt-2 text-sm text-gray-300 flex gap-5">
              <p>
                <strong>Type:</strong> {type}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-pink-500 transition text-xl"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {group.incidents.map((incident, index) => (
            <div
              key={incident._id + index}
              className="bg-[#132c52] border border-blue-800/40 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-blue-300">
                  {incident.breachData?.Name}
                </h4>

                <p className="text-xs bg-gray-600 px-2 py-1 rounded-md">
                  {new Date(incident.breachData?.AddedDate).toLocaleDateString(
                    "en-IN"
                  )}
                </p>
              </div>

              {incident.breachData?.Description &&
                (() => {
                  const sanitizedDescription =
                    incident.breachData.Description?.replaceAll(
                      /<a\b[^>]*>(.*?)<\/a>/gi,
                      '<span style="color:inherit; text-decoration:none; cursor:default;">$1</span>'
                    );

                  return (
                    <p
                      className="text-gray-200 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                    />
                  );
                })()}

              {incident.breachData?.DataClasses?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {incident.breachData.DataClasses.map((item, i) => (
                    <span
                      key={i}
                      className="bg-blue-900/60 border border-blue-800/40 px-3 py-1 text-xs rounded-full text-gray-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-blue-800/40 text-right sticky bottom-0 bg-[#0f2747] z-20">
          <button
            onClick={onClose}
            className="bg-pink-600 hover:bg-pink-500 px-5 py-2 rounded-md font-medium text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const IncidentManagement = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedGroup, setSelectedGroup] = useState(null);

  // ---- PAGINATION STATE ----
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // default 10 per page

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await axios.get(
          `http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring/incidents?userId=${userId}`
        );

        console.log(res);

        if (res.data.success) {
          const grouped = Object.values(
            res.data.data.reduce((acc, inc) => {
              const key = inc.incidentId;
              if (!acc[key])
                acc[key] = {
                  incidentId: key,
                  incidents: [],
                };
              acc[key].incidents.push(inc);
              return acc;
            }, {})
          );

          setIncidents(grouped);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  // Resolve handler
  const handleResolve = async (group) => {
    try {
      const { targetValue, targetType } = group.incidents[0];
      const payload = { targetValue, targetType };

      await axios.post(
        "http://13.50.233.20:7001/auth/api/v1/dark-web-monitoring/incidents/resolve-by-target",
        payload
      );

      setIncidents((prev) =>
        prev.map((g) =>
          g.incidentId === group.incidentId
            ? {
              ...g,
              incidents: g.incidents.map((inc) => ({
                ...inc,
                incidentStatus: "resolved",
              })),
            }
            : g
        )
      );
    } catch (error) {
      console.error("Resolve API Error:", error);
    }
  };

  // Filter logic
  const filteredGroups = incidents.filter((group) => {
    if (filter === "All") return true;
    if (filter === "Open")
      return group.incidents.some((x) => x.incidentStatus === "open");
    if (filter === "Resolved")
      return group.incidents.every((x) => x.incidentStatus === "resolved");
    return true;
  });

  // ---- PAGINATION LOGIC ----
  const totalRecords = filteredGroups.length;
  const effectivePageSize = pageSize === "All" ? totalRecords : pageSize;
  const totalPages = Math.ceil(totalRecords / effectivePageSize);

  const startIndex = (currentPage - 1) * effectivePageSize;
  const endIndex = startIndex + effectivePageSize;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);

  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-[#0b203a] text-white px-6 py-10">
      <div className="max-w-8xl mx-auto bg-[#0b203a] p-5 border border-blue-800 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            <span className="text-pink-600 mr-3">⚠ </span>Incident Management
          </h2>

          <div className="flex space-x-3">
            {["All", "Open", "Resolved"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setFilter(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1 rounded-lg font-medium text-sm ${filter === tab
                    ? "bg-pink-600"
                    : "bg-blue-900 hover:bg-purple-800"
                  }`}
              >
                {tab} (
                {
                  incidents.filter((g) =>
                    tab === "All"
                      ? true
                      : tab === "Open"
                        ? g.incidents.some((i) => i.incidentStatus === "open")
                        : g.incidents.every(
                          (i) => i.incidentStatus === "resolved"
                        )
                  ).length
                }
                )
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-gray-400 text-center py-10">
            Loading incidents...
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-gray-400 text-center py-10">
            No incidents found.
          </div>
        ) : (
          <div className="overflow-x-auto border border-blue-800 rounded-xl">
            <table className="w-full text-sm text-gray-300 text-center">
              {/* 👆 Entire table text center */}

              <thead className="bg-blue-900/40 text-gray-200 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Incident ID</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Target</th>
                  <th className="px-6 py-3">Sources</th>
                  <th className="px-2 py-3">Detected Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Severity</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedGroups.map((group) => {
                  const allTargets = [
                    ...new Set(group.incidents.map((i) => i.targetValue)),
                  ].join(", ");
                  const allTypes = [
                    ...new Set(group.incidents.map((i) => i.targetType)),
                  ].join(", ");
                  const uniqueSources = [
                    ...new Set(
                      group.incidents.map(
                        (i) => i.breachData?.Name || "Unknown"
                      )
                    ),
                  ];

                  const allSources =
                    uniqueSources.length > 10
                      ? `${uniqueSources.slice(0, 10).join(", ")} ... (${uniqueSources.length - 10
                      } more)`
                      : uniqueSources.join(", ");

                  const allDetected = [
                    ...new Set(
                      group.incidents.map((i) =>
                        new Date(i.detectedAt).toLocaleDateString("en-IN")
                      )
                    ),
                  ].join(", ");

                  return (
                    <tr
                      key={group.incidentId}
                      className="border-t border-blue-800 hover:bg-blue-900/20"
                    >
                      <td className="px-6 py-4">{group.incidentId}</td>
                      <td className="px-6 py-4">{capitalizeFirst(allTypes)}</td>

                      <td className="px-6 py-4 flex mt-2 items-center justify-center gap-2">
                        {/* 👆 justify-center fix */}
                        {allTargets.includes("@") ? (
                          <EmailIcon className="h-4 w-4 text-pink-400" />
                        ) : (
                          <DomainIcon className="h-4 w-4 text-pink-400" />
                        )}

                        {capitalizeFirst(allTargets)}
                      </td>

                      <td className="px-6 py-4">{allSources}</td>
                      <td className="px-6 py-4">{allDetected}</td>

                      <td className="px-6 py-4">
                        <StatusBadge
                          status={group.incidents[0].incidentStatus.toUpperCase()}
                        />
                      </td>

                      <td className="px-6 py-4">
                        <SeverityBadge severity={group.incidents[0].severity} />
                      </td>

                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => setSelectedGroup(group)}
                          className="bg-gray-800 hover:bg-purple-800 px-3 py-1 rounded-md text-sm mb-3"
                        >
                          View Details
                        </button>

                        {group.incidents.some(
                          (i) => i.incidentStatus === "open"
                        ) && (
                            <button
                              onClick={() => handleResolve(group)}
                              className="bg-gray-800 hover:bg-purple-800 px-3 py-1 rounded-md text-sm"
                            >
                              Resolve All
                            </button>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {!loading && filteredGroups.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            {/* Page Size */}
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-sm">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(
                    e.target.value === "All" ? "All" : Number(e.target.value)
                  );
                  setCurrentPage(1);
                }}
                className="bg-blue-900 text-gray-200 px-3 py-1 rounded-md border border-blue-700"
              >
                {[5, 10, 20, 50, "All"].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-3 text-gray-200">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`px-3 py-1 rounded-md ${currentPage === 1
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-blue-900 hover:bg-blue-700"
                  }`}
              >
                Previous
              </button>

              <span className="text-sm">
                Page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong>
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-blue-900 hover:bg-blue-700"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedGroup && (
        <DetailsModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </div>
  );
};

export default IncidentManagement;
