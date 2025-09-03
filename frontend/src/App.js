import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Method from "./pages/Method";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import EmployerDashboard from "./pages/EmployerDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import TopCompanies from "./pages/TopCompanies"; // <-- Import TopCompanies

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // Not logged in
  if (!token) return <Navigate to="/login" />;

  // Role mismatch
  if (role && userRole !== role) return <Navigate to="/" />;

  return children;
};

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/top-companies" element={<TopCompanies />} /> {/* <-- Added */}
          <Route path="/method" element={<Method />} />

          {/* Employer Dashboard (employer only) */}
          <Route
            path="/employer-dashboard"
            element={
              <ProtectedRoute role="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Developer Dashboard (developer only) */}
          <Route
            path="/developer-dashboard"
            element={
              <ProtectedRoute role="developer">
                <DeveloperDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
