import React, { useState } from "react";
import axios from "axios";
import "./FacultyLogin.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function FacultyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Enter email and password first");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/faculty/send-otp",
        { email, password }
      );

      setOtpSent(true);
      setSuccess("OTP sent to registered email address");

    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  /* ================= LOGIN ================= */
  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 4) {
      setError("OTP must be 4 digits");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/faculty/login",
        { email, password, otp }
      );

      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("facultyId", data.id);
      localStorage.setItem("facultyName", data.name);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;

      navigate("/faculty-dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">

        <div className="login-left">
          <h1>FACULTY LOGIN</h1>
        </div>

        <div className="login-right">
          <h2>Secure Login</h2>

          <form onSubmit={submitHandler}>

            <div className="input-box">
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-box password-area">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="eye-iconn"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* OTP FIELD */}
            {otpSent && (
              <div className="input-box1">
                <input
                  type="text"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  maxLength="4"
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                  required
                />
              </div>
            )}

            {!otpSent ? (
              <button
                type="button"
                className="login-btn"
                onClick={sendOtp}
              >
                Send OTP
              </button>
            ) : (
              <button className="login-btn">
                Verify & Login
              </button>
            )}
            <p
  className="forgot-link"
  onClick={() => navigate("/forgot-password/faculty")}
>
  Forgot Password?
</p>


            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}
          </form>
        </div>

      </div>
    </div>
  );
}
