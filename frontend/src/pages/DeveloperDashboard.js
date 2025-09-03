import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaFileAlt } from "react-icons/fa";

const DeveloperDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch developer's applications
  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(
        "https://9ace0c41-d172-46f8-ad9f-22a593437d12-00-2jpuy195o8qc9.sisko.replit.dev/api/applications/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch applications");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <div
          className="w-1/3 flex flex-col justify-between p-10
            bg-gradient-to-b from-purple-500 to-pink-400
            dark:from-purple-900 dark:to-purple-700"
        >
          <div className="text-center">
            <h1 className="text-6xl font-extrabold text-black dark:text-white mb-4">
              Welcome, Developer
            </h1>
            <p className="text-2xl italic text-black dark:text-gray-300">
              "Code your way to success! "
            </p>
          </div>
          <div className="mt-12 flex flex-col space-y-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-6 py-3 w-full rounded-full bg-white dark:bg-gray-700 text-purple-700 dark:text-white font-semibold shadow hover:scale-105 transform transition"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 w-full rounded-full bg-red-600 dark:bg-red-700 text-white font-semibold shadow hover:scale-105 transform transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10 overflow-y-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
            My Applications
          </h1>

          {loading ? (
            <p className="text-gray-700 dark:text-gray-300 text-center mt-10">
              Loading applications...
            </p>
          ) : applications.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              You have not applied to any jobs yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition flex flex-col"
                >
                  <h2 className="text-xl font-semibold mb-2 dark:text-white">
                    {app.job.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {app.job.description}
                  </p>
                  <p className="mb-1 dark:text-gray-200">
                    <strong>Message:</strong> {app.message}
                  </p>
                  <p className="mb-2 flex items-center space-x-2 text-blue-600">
                    <FaFileAlt />
                    <a
                      href={`http://localhost:5000/uploads/${app.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View Resume
                    </a>
                  </p>
                  <p className="mt-auto">
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        app.status === "accepted"
                          ? "text-green-600"
                          : app.status === "rejected"
                          ? "text-red-600"
                          : "text-gray-600 dark:text-gray-300"
                      }
                    >
                      {app.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
