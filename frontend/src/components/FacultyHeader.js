import React, { useState, useEffect } from "react";
import "./Header.css";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FacultyHeader() {
  const [dropdown, setDropdown] = useState(false);
  const [facultyName, setFacultyName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("facultyName");
    if (name) setFacultyName(name);
  }, []);

  /* ================= RESET PASSWORD ================= */
  const goToResetPassword = () => {
    setDropdown(false);
    navigate("/faculty-reset-password");
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
    navigate("/"); // ✅ HOME PAGE
  };

  return (
    <div className="header">
      <h3>
        Welcome, <span>{facultyName || "Faculty"}</span>
      </h3>

      <div
        className="profile-area"
        onClick={() => setDropdown(!dropdown)}
      >
        <FaUserCircle className="profile-icon" />

        {dropdown && (
          <div className="dropdown">
            <p className="dropdown-name">{facultyName}</p>

            <button onClick={goToResetPassword}>
              Reset Password
            </button>

            <button
  onClick={() => {
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = "/";
  }}
>
  Logout
</button>
          </div>
        )}
      </div>
    </div>
  );
}
