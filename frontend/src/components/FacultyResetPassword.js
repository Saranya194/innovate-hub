import React, { useState } from "react";
import axios from "axios";
import "./ResetPassword.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function FacultyResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/api/faculty/reset-password", {
        oldPassword,
        newPassword,
      });

      alert("Password updated successfully ✅");

      // 🔥 Force logout
      localStorage.clear();
      delete axios.defaults.headers.common["Authorization"];

      // ✅ Redirect to faculty login
      navigate("/faculty-login");

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-box">

        <div className="reset-left">
          <h1>RESET PASSWORD</h1>
        </div>

        <div className="reset-right">
          <h2>Faculty Reset Password</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-box password-area">
  <input
    type={showOld ? "text" : "password"}
    placeholder="Old Password"
    value={oldPassword}
    onChange={(e) => setOldPassword(e.target.value)}
    required
  />
  <span
    className="eye-icon"
    onClick={() => setShowOld(!showOld)}
  >
    {showOld ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

            <div className="input-box password-area">
  <input
    type={showNew ? "text" : "password"}
    placeholder="New Password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    required
  />
  <span
    className="eye-icon"
    onClick={() => setShowNew(!showNew)}
  >
    {showNew ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>
            <button className="reset-btn">UPDATE PASSWORD</button>
            {error && <p className="reset-error">{error}</p>}
          </form>
        </div>

      </div>
    </div>
  );
}
