// App.js
import React, { useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import RegistrationBoxes from "./components/RegistrationBoxes";
import Footer from "./components/Footer";
import StudentRegistration from "./components/StudentRegistration";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import AdminLogin from "./components/AdminLogin";
import ResearchPapers from "./components/ResearchPapers";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./components/ResetPassword";
import FacultyRegistration from "./components/FacultyRegistration";
import FacultyLogin from "./components/FacultyLogin";
import FacultyDashboard from "./components/FacultyDashboard";
import FacultyResetPassword from "./components/FacultyResetPassword";
import AdminDashboard from "./components/AdminDashboard";
import AdminExplore from "./components/AdminExplore";
import AdminActivityProfile from "./components/AdminActivityProfile";
import AdminCertificates from "./components/AdminCertificates";
import "./App.css";

/* ================= AXIOS BASE CONFIG ================= */
axios.defaults.baseURL = "http://localhost:5000";

function AppLayout() {
  const location = useLocation();

  // 🔥 Routes where Header & Footer should be hidden
  const hideNavFooterRoutes = [
    "/student-dashboard",
    "/faculty-dashboard",
    "/admin-dashboard",
    "/admin/research",
    "/admin/sih",
    "/admin/msme",
    "/admin/startup",
    "/admin/grants",
    "/admin/publications",
    "/admin/awards",
    "/admin/certificates",
  ];

  // 🔥 Hide for static + dynamic routes
  const hideNavFooter =
    hideNavFooterRoutes.some((path) =>
      location.pathname.startsWith(path)
    ) ||
    location.pathname.startsWith("/admin/profile") ||
    location.pathname.startsWith("/admin/research/") ||
    location.pathname.startsWith("/admin/startup/") ||
    location.pathname.startsWith("/admin/grants/") ||
    location.pathname.startsWith("/admin/publications/") ||
    location.pathname.startsWith("/admin/sih/") ||
    location.pathname.startsWith("/admin/msme/") ||
    location.pathname.startsWith("/admin/awards/");

  return (
    <div className="app-wrapper">
      {/* ✅ FIXED */}
      {!hideNavFooter && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<RegistrationBoxes />} />
          <Route path="/student-register" element={<StudentRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/research-papers" element={<ResearchPapers />} />
          <Route path="/faculty-register" element={<FacultyRegistration />} />
          <Route path="/faculty-login" element={<FacultyLogin />} />

          {/* ADMIN */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/research" element={<AdminExplore />} />
          <Route path="/admin/startup" element={<AdminExplore />} />
          <Route path="/admin/sih" element={<AdminExplore />} />
          <Route path="/admin/msme" element={<AdminExplore />} />
          <Route path="/admin/grants" element={<AdminExplore />} />
          <Route path="/admin/publications" element={<AdminExplore />} />
          <Route path="/admin/awards" element={<AdminExplore />} />
          <Route path="/admin/certificates" element={<AdminCertificates />} />

          {/* 🔥 ACTIVITY PROFILE */}
          <Route
            path="/admin/:activity/:role/:id"
            element={<AdminActivityProfile />}
          />

          {/* STUDENT */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* FACULTY */}
          <Route path="/faculty-dashboard" element={<FacultyDashboard />} />

          {/* PASSWORD */}
          <Route
            path="/reset-password"
            element={
              <ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty-reset-password"
            element={<FacultyResetPassword />}
          />
        </Routes>
      </main>

      {/* ✅ FIXED */}
      {!hideNavFooter && <Footer />}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
