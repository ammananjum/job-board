import React, { useEffect, useState } from "react";
import axios from "axios";
import ApplyForm from "../components/ApplyForm";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [minSalary, setMinSalary] = useState("");

  // Mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch jobs
  const fetchJobs = async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://9ace0c41-d172-46f8-ad9f-22a593437d12-00-2jpuy195o8qc9.sisko.replit.dev/api/jobs?page=${pageNum}`
      );
      setJobs(data.jobs || data);
      setPage(data.page || 1);
      setPages(data.pages || 1);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch jobs");
      setLoading(false);
    }
  };

  // Fetch top companies for featured section
  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get("https://9ace0c41-d172-46f8-ad9f-22a593437d12-00-2jpuy195o8qc9.sisko.replit.dev/api/companies");
      setCompanies(data.slice(0, 3)); // Top 3 companies
    } catch (err) {
      console.log("Failed to fetch companies");
    }
  };

  useEffect(() => {
    fetchJobs(page);
    fetchCompanies();
  }, [page]);

  const handleApplied = () => {
    alert("Application submitted successfully!");
  };

  const handleApply = (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setSelectedJob(jobId);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());
    const matchesSkill = skillFilter
      ? job.skills.some((s) =>
          s.toLowerCase().includes(skillFilter.toLowerCase())
        )
      : true;
    const matchesLocation = locationFilter
      ? job.location.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    const matchesSalary = minSalary ? job.salary >= minSalary : true;
    return matchesSearch && matchesSkill && matchesLocation && matchesSalary;
  });

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-slate-200 via-purple-300 to-black dark:from-gray-900 dark:via-purple-900 dark:to-black">
        {/* Navbar */}
        <header className="p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo + Brand */}
            <div className="flex items-center space-x-3">
              <div className="h-14 w-14 rounded-full border-4 border-purple-600 overflow-hidden flex items-center justify-center">
                <img
                  src="/logoX.jpg"
                  alt="Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <h1 className="text-3xl font-extrabold text-black dark:text-white">
                JobBoardX
              </h1>
            </div>

            {/* Desktop menu */}
            <nav className="hidden md:flex space-x-6">
              {["Home", "Top Companies", "Method", "About", "Contact"].map(
                (link) => (
                  <button
                    key={link}
                    onClick={() =>
                      link === "Home"
                        ? navigate("/")
                        : link === "Top Companies"
                        ? navigate("/top-companies")
                        : window.scrollTo({
                            top: document.getElementById(link.toLowerCase())
                              ?.offsetTop,
                            behavior: "smooth",
                          })
                    }
                    className="text-black dark:text-white font-bold text-lg hover:underline hover:underline-offset-4 hover:text-purple-700"
                  >
                    {link}
                  </button>
                )
              )}
            </nav>

            {/* Join Now button */}
            <div className="hidden md:block">
              <button
                className="px-6 py-2 rounded-full border-2 border-purple-600 bg-black text-white font-semibold hover:bg-purple-600 transition"
                onClick={() => navigate("/login")}
              >
                Join Now
              </button>
            </div>

            {/* Mobile menu icon */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-black dark:text-white text-2xl"
              >
                {menuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden mt-2 bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col space-y-2">
              {["Home", "Top Companies", "Method", "About", "Contact"].map(
                (link) => (
                  <button
                    key={link}
                    onClick={() => {
                      setMenuOpen(false);
                      link === "Home"
                        ? navigate("/")
                        : link === "Top Companies"
                        ? navigate("/top-companies")
                        : window.scrollTo({
                            top: document.getElementById(link.toLowerCase())
                              ?.offsetTop,
                            behavior: "smooth",
                          });
                    }}
                    className="text-black dark:text-white font-bold text-lg hover:underline hover:underline-offset-4 hover:text-purple-700"
                  >
                    {link}
                  </button>
                )
              )}
              <button
                className="mt-2 px-6 py-2 rounded-full border-2 border-purple-600 bg-black text-white font-semibold hover:bg-purple-600 transition"
                onClick={() => navigate("/login")}
              >
                Join Now
              </button>
            </div>
          )}
        </header>

        {/* Hero / Heading */}
        <div className="text-center text-black dark:text-white mb-6 mt-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold">
            Unlock Your Career Potential
          </h2>
          <p className="text-lg sm:text-xl mt-2">
            Find the job that fits your passion
          </p>
        </div>

        {/* Featured Top Companies */}
        <div className="max-w-7xl mx-auto mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition flex flex-col items-center text-center"
              >
                <img
                  src={company.logo || "https://via.placeholder.com/100"}
                  alt={company.name}
                  className="w-24 h-24 object-contain mb-4 rounded-full border border-gray-200 dark:border-gray-700"
                />
                <h4 className="text-xl font-semibold mb-1 dark:text-white">
                  {company.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  <strong>Industry:</strong> {company.industry || "Tech"}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  <strong>Location:</strong> {company.location || "Remote"}
                </p>
                <span
                  className={`px-3 py-1 rounded-full font-semibold ${
                    company.currentlyHiring
                      ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                      : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
                  }`}
                >
                  {company.currentlyHiring ? "Hiring Now" : "Not Hiring"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <input
            type="text"
            placeholder="Search by title or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full sm:w-1/3"
          />
          <input
            type="text"
            placeholder="Filter by skill"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="p-2 border rounded w-full sm:w-1/4"
          />
          <input
            type="text"
            placeholder="Filter by location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="p-2 border rounded w-full sm:w-1/4"
          />
          <input
            type="number"
            placeholder="Minimum Salary"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            className="p-2 border rounded w-full sm:w-1/6"
          />
        </div>

        {/* Jobs Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-center mt-10 col-span-full">Loading jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <p className="text-center col-span-full text-gray-600 dark:text-gray-300">
              No jobs found.
            </p>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2 dark:text-white">
                    {job.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {job.description}
                  </p>
                  <p className="mb-1 dark:text-gray-200">
                    <strong>Skills:</strong> {job.skills.join(", ")}
                  </p>
                  <p className="mb-1 dark:text-gray-200">
                    <strong>Salary:</strong> ${job.salary}
                  </p>
                  <p className="mb-2 dark:text-gray-200">
                    <strong>Location:</strong> {job.location}
                  </p>
                </div>
                <button
                  onClick={() => handleApply(job._id)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Apply
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
            disabled={page === pages}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Apply Modal */}
        {selectedJob && (
          <ApplyForm
            jobId={selectedJob}
            onClose={() => setSelectedJob(null)}
            onApplied={handleApplied}
          />
        )}

        {/* ===================== About Section ===================== */}
<section
  id="about"
  className="flex flex-col md:flex-row w-full min-h-screen bg-white text-black "
>
  {/* Left Image */}
  <div className="md:w-1/2 h-64 md:h-auto">
    <img
      src="/img.png"
      alt="About Us"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Right Text */}
  <div className="md:w-1/2 flex flex-col justify-center items-start p-10 space-y-4">
    <h2 className="text-5xl font-bold mb-2">About Us</h2>
    <p className="text-xl font-bold">
      At JobBoardX, our mission is to bridge the gap between talented
      professionals and companies seeking top talent. We believe every
      individual deserves a career that excites and challenges them.
    </p>
    <p className="text-lg">
      Our platform provides a seamless job searching experience, highlighting
      opportunities across industries and locations. Whether you're looking
      for your first job, a career change, or a chance to grow, JobBoardX
      is here to guide you.
    </p>
    <p className="text-lg">
      We are committed to building a community where both companies and
      candidates thrive, helping shape the future of work with transparency,
      fairness, and innovation.
    </p>
    <button
      onClick={() =>
        window.scrollTo({
          top: document.getElementById("contact")?.offsetTop,
          behavior: "smooth",
        })
      }
      className="mt-4 px-6 py-4 bg-black text-white font-bold rounded shadow hover:bg-purple-100 transition"
    >
      Contact Us 
    </button>
  </div>
</section>


        {/* ===================== Contact/Footer Section ===================== */}
        <footer
          id="contact"
          className="w-full bg-purple-700 text-white text-center p-10"
        >
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p>Email: info@jobboardx.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: 123 Main Street, City, Country</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
