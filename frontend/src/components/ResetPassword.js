import React, { useState } from "react";
import axios from "axios";
import "./ResetPassword.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const validatePassword = (p) =>
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,15}$/.test(p);

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!validatePassword(newPassword)) {
    setError(
      "Password must be 6–15 characters and include at least 1 uppercase letter, 1 number, and 1 special character"
    );
    return;
  }

  try {
    await axios.post("/api/student/reset-password", {
      oldPassword,
      newPassword,
    });

    alert("Password Reset successfully ✅");

    localStorage.clear();
    navigate("/login");

  } catch (err) {
    setError(err.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className="reset-wrapper">
      <div className="reset-box">

        {/* LEFT PANEL */}
        <div className="reset-left">
          <h1>RESET PASSWORD</h1>
        </div>

        {/* RIGHT PANEL */}
        <div className="reset-right">
          <h2>Reset Password</h2>

          <form onSubmit={handleSubmit}>

            {/* OLD PASSWORD */}
            <div className="input-box password-area">
              <input
                type={showOld ? "text" : "password"}
                placeholder="Enter Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon2"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* NEW PASSWORD */}
            <div className="input-box password-area">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon2"
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
