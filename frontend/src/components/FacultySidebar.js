import React from "react";
import "./Sidebar.css";
import {
  FaHome,
  FaBook,
  FaLightbulb,
  FaFileAlt,
  FaFlask,
  FaAward
} from "react-icons/fa";

export default function FacultySidebar({ activeSection, setActiveSection }) {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Faculty Panel</h2>

      <ul className="sidebar-menu">
        <li
          className={activeSection === "dashboard" ? "active" : ""}
          onClick={() => setActiveSection("dashboard")}
        >
          <span className="icon"><FaHome /></span>
          <span className="text">Dashboard</span>
        </li>

        <li
          className={activeSection === "researchPapers" ? "active" : ""}
          onClick={() => setActiveSection("researchPapers")}
        >
          <span className="icon"><FaBook /></span>
          <span className="text">Research Papers</span>
        </li>

        <li
          className={activeSection === "startup" ? "active" : ""}
          onClick={() => setActiveSection("startup")}
        >
          <span className="icon"><FaLightbulb /></span>
          <span className="text">Startup Activities</span>
        </li>

        <li
          className={activeSection === "publications" ? "active" : ""}
          onClick={() => setActiveSection("publications")}
        >
          <span className="icon"><FaFileAlt /></span>
          <span className="text">Publications</span>
        </li>

        <li
          className={activeSection === "grants" ? "active" : ""}
          onClick={() => setActiveSection("grants")}
        >
          <span className="icon"><FaFlask /></span>
          <span className="text">Grants & Funding</span>
        </li>

        <li
          className={activeSection === "sih" ? "active" : ""}
          onClick={() => setActiveSection("sih")}
        >
          <span className="icon"><FaFlask /></span>
          <span className="text">SIH</span>
        </li>

        <li
          className={activeSection === "msme" ? "active" : ""}
          onClick={() => setActiveSection("msme")}
        >
          <span className="icon"><FaFlask /></span>
          <span className="text">MSME</span>
        </li>

        <li
          className={activeSection === "recognition" ? "active" : ""}
          onClick={() => setActiveSection("recognition")}
        >
          <span className="icon"><FaAward /></span>
          <span className="text">Recognition & Awards</span>
        </li>
      <li
          className={activeSection === "certificates" ? "active" : ""}
          onClick={() => setActiveSection("certificates")}
      >
          <span className="icon"><FaAward /></span>
          <span className="text">View Certificates</span>
      </li>
      
        
      </ul>
    </div>
  );
}
