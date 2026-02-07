import React, { useState } from "react";
import axios from "axios";
import "./ResetPassword.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const validatePassword = (p) =>
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,15}$/.test(p);


export default function ForgotPassword() {
  const { role } = useParams(); // student | faculty
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
  e.preventDefault();
  setError("");

  if (!validatePassword(newPassword)) {
    setError(
      "Password must be 6–15 characters and include at least 1 uppercase letter, 1 number, and 1 special character"
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    await axios.post(
      `http://localhost:5000/api/${role}/forgot-password`,
      { email, newPassword }
    );

    alert("Password Upadated successfully ✅");
    navigate(role === "student" ? "/login" : "/faculty-login");

  } catch (err) {
    setError(err.response?.data?.message || "Reset failed");
  }
};

  return (
    <div className="reset-wrapper">
      <div className="reset-box">

        <div className="reset-left">
          <h1>FORGOT PASSWORD</h1>
        </div>

        <div className="reset-right">
          <h2>FORGOT Password</h2>

          <form onSubmit={submitHandler}>

            <div className="input-box">
              <input
                type="email"
                placeholder="Enter Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-box password-area">
              <input
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span className="eye-icon2" onClick={() => setShowNew(!showNew)}>
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="input-box password-area">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon2"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
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
