import React, { useState, useEffect } from "react";
import "./Header.css";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [dropdown, setDropdown] = useState(false);
  const [studentName, setStudentName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("studentName");
    if (storedName) setStudentName(storedName);
  }, []);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");   // cleaner than window.location
  };

  /* ================= RESET PASSWORD ================= */
  const goToResetPassword = () => {
    setDropdown(false);
    navigate("/reset-password");
  };

  return (
    <div className="header">
      <h3>
        Welcome, <span>{studentName || "Student"}</span>
      </h3>

      <div
        className="profile-area"
        onClick={() => setDropdown(!dropdown)}
      >
        <FaUserCircle className="profile-icon" />

        {dropdown && (
          <div className="dropdown">
            <p className="dropdown-name">{studentName}</p>

            <button onClick={() => window.location.href = "/reset-password"}>
  Reset Password
</button>


            <button onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
