import React, { useState } from "react";
import axios from "axios"; // 🔥 REQUIRED
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/student/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      /* ================= SAVE LOGIN INFO ================= */
      localStorage.setItem("token", data.token);
 localStorage.setItem("studentId", data.studentId);
      localStorage.setItem("studentName", data.name);

      /* ================= VERY IMPORTANT ================= */
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;

      /* ================= REDIRECT ================= */
      navigate("/student-dashboard");

    } catch (err) {
      setError("Server error. Try again!");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">

        <div className="login-left">
          <h1>WELCOME BACK</h1>
        </div>

        <div className="login-right">
          <h2>Login Here</h2>

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
                className="eye-icon1"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button className="login-btn">LOGIN</button>
            <p
  className="forgot-link"
  onClick={() => navigate("/forgot-password/student")}
>
  Forgot Password?
</p>


            {error && <p className="login-error">{error}</p>}
          </form>
        </div>

      </div>
    </div>
  );
}
