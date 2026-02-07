import "./Sidebar.css";
import {
  FaHome,
  FaBook,
  FaLightbulb,
  FaFileAlt,
  FaFlask,
  FaAward,
  FaUpload
} from "react-icons/fa";

export default function CoordinatorSidebar({ activeSection, setActiveSection }) {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Coordinator Panel</h2>

      <ul className="sidebar-menu">
        <li
          className={activeSection === "dashboard" ? "active" : ""}
          onClick={() => setActiveSection("dashboard")}
        >
          <FaHome /> Dashboard
        </li>

        <li onClick={() => setActiveSection("researchPapers")}>
          <FaBook /> Research Papers
        </li>

        <li onClick={() => setActiveSection("startup")}>
          <FaLightbulb /> Startup Activities
        </li>

        <li onClick={() => setActiveSection("publications")}>
          <FaFileAlt /> Publications
        </li>

        <li onClick={() => setActiveSection("grants")}>
          <FaFlask /> Grants & Funding
        </li>

        <li onClick={() => setActiveSection("sih")}>
          <FaFlask /> SIH
        </li>

        <li onClick={() => setActiveSection("msme")}>
          <FaFlask /> MSME
        </li>

        <li onClick={() => setActiveSection("recognition")}>
          <FaAward /> Recognition & Awards
        </li>

        {/* ✅ ONLY FOR COORDINATORS */}
        <li onClick={() => setActiveSection("bulkUpload")}>
          <FaUpload /> Bulk Upload
        </li>
      </ul>
    </div>
  );
}
