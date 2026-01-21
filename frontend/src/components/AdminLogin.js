import React, { useState } from "react";
import "./AdminLogin.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
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
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("adminName", data.username);
      window.location.href = "/admin-dashboard";

    } catch (err) {
      setError("Server error. Try again!");
    }
  };

  return (
    <div className="admin-login-wrapper">

      <div className="admin-login-left">
        <img src="/admin-logo.png" alt="admin" />
      </div>

      <div className="admin-login-right">
        <h2>Admin Login</h2>

        <form onSubmit={submitHandler}>

          {/* USERNAME */}
          <div className="input-box3">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
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
