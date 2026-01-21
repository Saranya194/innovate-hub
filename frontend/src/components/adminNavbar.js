import { NavLink } from "react-router-dom";
import "./AdminNavbar.css";

export default function AdminNavbar() {
  return (
    <nav className="admin-nav">
      <h2>Admin Panel</h2>

      <div className="nav-links">
        <NavLink to="/admin-dashboard">Dashboard</NavLink>
        <NavLink to="/admin/research">Research</NavLink>
        <NavLink to="/admin/startup">Startups</NavLink>
        <NavLink to="/admin/publications">Publications</NavLink>
        <NavLink to="/admin/grants">Grants</NavLink>
        <NavLink to="/admin/sih">SIH</NavLink>
        <NavLink to="/admin/msme">MSME</NavLink>
        <NavLink to="/admin/awards">Awards</NavLink>
        <NavLink to="/admin/certificates">Certificates</NavLink>
      </div>

      <div className="admin-profile">
        <span>Admin</span>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
