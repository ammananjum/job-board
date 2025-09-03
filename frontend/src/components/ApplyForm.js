import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ApplyForm = ({ jobId, onClose, onApplied }) => {
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !resume) {
      toast.error("Please fill all fields and upload your resume");
      return;
    }

    const formData = new FormData();
    formData.append("message", message);
    formData.append("resume", resume);

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:5000/api/applications/${jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      setMessage("");
      setResume(null);
      toast.success("Application submitted successfully!");
      onApplied(); // Refresh job list or applicant list
      onClose();   // Close modal
    } catch (err) {
      setLoading(false);
      toast.error(
        err.response?.data?.message || "Failed to submit application"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Apply for Job</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <textarea
            placeholder="Message to employer"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 border rounded w-full resize-none"
            rows={4}
          />

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
            className="border rounded p-2"
          />

          {resume && (
            <p className="text-sm text-gray-600">Selected file: {resume.name}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;
