import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./AdminLogin.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

export default function AdminLogin() {
  const { role } = useParams(); // 🔥 IMPORTANT

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

 const submitHandler = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

   localStorage.setItem("token", data.token);
localStorage.setItem("adminName", data.username);
localStorage.setItem("adminRole", data.role);

// 🔥 SET AXIOS HEADER
axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${data.token}`;

    // ✅ ROLE-BASED REDIRECT
    if (data.role === "admin") {
      window.location.href = "/admin-dashboard";
    } else {
      window.location.href = "/coordinator-dashboard";
    }

  } catch {
    setError("Server error. Try again!");
  }
};


  const roleTitle = {
    admin: "Admin",
    central_coordinator: "Central Coordinator",
    incubation_coordinator: "Incubation Coordinator",
  }[role];

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-left">
        <img src="/admin-logo.png" alt="login" />
      </div>

      <div className="admin-login-right">
        <h2>{roleTitle} Login</h2>

        <form onSubmit={submitHandler}>
          <div className="input-box3">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="password-area">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPass(!showPass)} className="eye-icon">
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="error">{error}</p>}
          <button className="login-btn">LOGIN</button>
        </form>
      </div>
    </div>
  );
}
