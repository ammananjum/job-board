import React, { useState } from "react";

const Method = () => {
  const [darkMode, setDarkMode] = useState(false);

  const steps = [
    {
      title: "Create an Account",
      description:
        "Register as a developer to apply for jobs or as an employer to post job listings. Make sure to complete your profile.",
    },
    {
      title: "Explore Jobs or Companies",
      description:
        "Use the Home page to browse jobs by title, skills, location, or salary. Check out Top Companies to see who is hiring.",
    },
    {
      title: "Apply for Jobs",
      description:
        "Developers can apply for any listed job by submitting their resume and a personalized message.",
    },
    {
      title: "Manage Applications",
      description:
        "Employers can review applicants, accept or reject applications, and keep track of all job postings in their dashboard.",
    },
    {
      title: "Stay Updated",
      description:
        "Notifications and email updates keep you informed about new jobs or applications status changes.",
    },
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen p-10 bg-gradient-to-br from-slate-200 via-purple-300 to-black dark:from-gray-800 dark:to-black">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            How It Works
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-white dark:bg-gray-700 text-purple-700 dark:text-white font-semibold rounded shadow hover:scale-105 transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Steps / Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:scale-105 flex flex-col"
            >
              <h2 className="text-2xl font-semibold mb-3 dark:text-white">
                {index + 1}. {step.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Footer Tip */}
        <div className="mt-12 text-center text-gray-800 dark:text-gray-100">
          <p className="text-xl italic">
            "Explore, apply, hire — all in one place!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Method;
