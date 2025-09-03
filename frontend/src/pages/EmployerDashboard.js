import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEnvelope, FaFileAlt, FaCheck, FaTimes } from "react-icons/fa";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Fetch jobs
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(data.jobs.filter((job) => job.employer._id === userId));
      setLoadingJobs(false);
    } catch (err) {
      toast.error("Failed to fetch jobs");
      setLoadingJobs(false);
    }
  };

  // Fetch applicants
  const fetchApplicants = async (jobId) => {
    setLoadingApplicants(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/applications/job/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplicants(data);
      setSelectedJob(jobId);
      setLoadingApplicants(false);
    } catch (err) {
      toast.error("Failed to fetch applicants");
      setLoadingApplicants(false);
    }
  };

  // Update application status
  const updateStatus = async (appId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${appId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Application ${status}`);
      fetchApplicants(selectedJob);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen flex bg-gray-200 dark:bg-gray-900">
        
        {/* Sidebar */}
        <div className="w-1/3 flex flex-col justify-between p-10
          bg-gradient-to-b from-purple-600 to-pink-500
          dark:from-purple-900 dark:to-purple-700">
          <div className="text-center">
            <h1 className="text-6xl font-extrabold text-black dark:text-white mb-6">Welcome</h1>
            <p className="text-2xl italic text-black dark:text-gray-300">
              "Empowering your hiring journey, one job at a time."
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

        {/* Main Dashboard */}
        <div className="flex-1 p-10 overflow-y-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
            Employer Dashboard
          </h1>

          {/* Jobs Section */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Your Jobs</h2>
          {loadingJobs ? (
            <p className="text-gray-700 dark:text-gray-300">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">You have not posted any jobs yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition cursor-pointer"
                >
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">{job.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">{job.description}</p>
                  <p className="text-sm mb-1 dark:text-gray-200"><strong>Skills:</strong> {job.skills.join(", ")}</p>
                  <p className="text-sm mb-1 dark:text-gray-200"><strong>Salary:</strong> ${job.salary}</p>
                  <p className="text-sm mb-2 dark:text-gray-200"><strong>Location:</strong> {job.location}</p>
                  <button
                    onClick={() => fetchApplicants(job._id)}
                    className="mt-2 w-full bg-blue-600 text-white rounded-full py-2 font-semibold hover:bg-blue-700 transition"
                  >
                    View Applicants
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Applicants Section */}
          {selectedJob && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
                Applicants
              </h2>
              {loadingApplicants ? (
                <p className="text-gray-700 dark:text-gray-300">Loading applicants...</p>
              ) : applicants.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No applicants yet.</p>
              ) : (
                <div className="space-y-6">
                  {applicants.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center transition hover:shadow-2xl"
                    >
                      <div className="flex-1 space-y-1 dark:text-gray-100">
                        <p className="font-semibold">{app.developer.name}</p>
                        <p className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <FaEnvelope /> <span>{app.developer.email}</span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">{app.message}</p>
                        <p className="flex items-center space-x-2 text-blue-600">
                          <FaFileAlt /> 
                          <a
                            href={`http://localhost:5000/uploads/${app.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Resume
                          </a>
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          <span className={
                            app.status === "accepted" ? "text-green-600" :
                            app.status === "rejected" ? "text-red-600" :
                            "text-gray-600 dark:text-gray-300"
                          }>
                            {app.status}
                          </span>
                        </p>
                      </div>

                      {app.status === "applied" && (
                        <div className="mt-4 sm:mt-0 flex space-x-3">
                          <button
                            onClick={() => updateStatus(app._id, "accepted")}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                          >
                            <FaCheck className="mr-2"/> Accept
                          </button>
                          <button
                            onClick={() => updateStatus(app._id, "rejected")}
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                          >
                            <FaTimes className="mr-2"/> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
