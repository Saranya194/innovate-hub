import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "./Header.css";

export default function CoordinatorHeader() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  return (
    <div className="header">
      <h3>Welcome</h3>

      <div
        className="profile-area"
        onClick={() => setOpen(!open)}
      >
        <FaUserCircle className="profile-icon" />

        {open && (
          <div className="dropdown">
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}
