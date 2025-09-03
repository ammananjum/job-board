import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Predefined top companies list
const TOP_COMPANIES = [
  { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com", industry: "Technology", location: "Redmond, WA" },
  { name: "Google", logo: "https://logo.clearbit.com/google.com", industry: "Technology", location: "Mountain View, CA" },
  { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", industry: "E-commerce", location: "Seattle, WA" },
  { name: "Apple", logo: "https://logo.clearbit.com/apple.com", industry: "Technology", location: "Cupertino, CA" },
  { name: "Facebook", logo: "https://logo.clearbit.com/facebook.com", industry: "Technology", location: "Menlo Park, CA" }
];

const TopCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch active jobs for each top company to determine hiring status
  const fetchCompaniesHiringStatus = async () => {
    try {
      const updatedCompanies = await Promise.all(
        TOP_COMPANIES.map(async (company) => {
          const { data } = await axios.get(
            `http://localhost:5000/api/jobs?companyName=${company.name}`
          );
          const currentlyHiring = data && data.length > 0;
          return { ...company, currentlyHiring };
        })
      );
      setCompanies(updatedCompanies);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch companies");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompaniesHiringStatus();
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen p-10 bg-gradient-to-br from-slate-200 via-purple-300 to-black dark:from-gray-800 dark:to-black">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            Top Companies
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-white dark:bg-gray-700 text-purple-700 dark:text-white font-semibold rounded shadow hover:scale-105 transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Companies Grid */}
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300 text-center mt-10">
            Loading companies...
          </p>
        ) : companies.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            No top companies are available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company) => (
              <div
                key={company.name}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col items-center text-center"
              >
                {/* Company Logo */}
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-24 h-24 object-contain mb-4 rounded-full border border-gray-200 dark:border-gray-700"
                />

                <h2 className="text-xl font-semibold mb-1 dark:text-white">
                  {company.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  <strong>Industry:</strong> {company.industry}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  <strong>Location:</strong> {company.location}
                </p>

                {/* Hiring Status */}
                <span
                  className={`px-3 py-1 rounded-full font-semibold ${
                    company.currentlyHiring
                      ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                      : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
                  }`}
                >
                  {company.currentlyHiring ? "Hiring Now" : "Not Hiring"}
                </span>

                {/* View Jobs Button */}
                {company.currentlyHiring && (
                  <button
                    onClick={() =>
                      (window.location.href = `/jobs?company=${company.name}`)
                    }
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
                  >
                    View Jobs
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCompanies;
