import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ResearchPapers from "./ResearchPapers";
import StartupActivities from "./StartupActivities";
import Publications from "./Publications";
import GrantsFunding from "./GrantsFunding";
import SIH from "./SIH";
import MSME from "./MSME";
import RecognitionAwards from "./RecognitionAwards";
import axios from "axios";
import Chatbot from "./Chatbot";
import ViewCertificates from "./ViewCertificates";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import "./StudentDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);


export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [analytics, setAnalytics] = useState(null);
   // ✅ ALWAYS READ INSIDE COMPONENT
  const studentId = localStorage.getItem("studentId");

  console.log("STUDENT ID USED:", studentId); // 🔥 DEBUG

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/api/dashboard/student");
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to load dashboard analytics");
      }
    };

    fetchAnalytics();
  }, []);

  const barData = analytics && {
    labels: [
      "Research",
      "Startups",
      "Publications",
      "SIH",
      "MSME",
      "Awards",
    ],
    datasets: [
      {
        label: "Student Contributions",
        data: [
          analytics.research,
          analytics.startups,
          analytics.publications,
          analytics.sih,
          analytics.msme,
          analytics.awards,
        ],
        backgroundColor: "#2563eb",
      },
    ],
  };

  const pieData = analytics && {
    labels: ["Grants Received", "Remaining"],
    datasets: [
      {
        data: [analytics.totalGrants, 100000],
        backgroundColor: ["#22c55e", "#e5e7eb"],
      },
    ],
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="dashboard-main">
        <Header />

        <div className="dashboard-content">
          {activeSection === "dashboard" && analytics && (
            <>
              <h3>Your Recent Metrics</h3>

              <div className="metrics-grid">
                <div className="metric-box">
                  <h4>Research Papers</h4>
                  <p>{analytics.research}</p>
                </div>

                <div className="metric-box">
                  <h4>Publications</h4>
                  <p>{analytics.publications}</p>
                </div>

                <div className="metric-box">
                  <h4>Grants Received</h4>
                  <p>₹{analytics.totalGrants}</p>
                </div>

                <div className="metric-box">
                  <h4>SIH Participations</h4>
                  <p>{analytics.sih}</p>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-box">
                  <h4>Overall Contributions</h4>
                  <Bar data={barData} />
                </div>

                <div className="chart-box">
                  <h4>Grant Utilization</h4>
                  <Pie data={pieData} />
                </div>
              </div>
            </>
          )}

          {activeSection === "researchPapers" && <ResearchPapers />}
          {activeSection === "startup" && <StartupActivities />}
          {activeSection === "publications" && <Publications />}
          {activeSection === "grants" && <GrantsFunding />}
          {activeSection === "sih" && <SIH />}
          {activeSection === "msme" && <MSME />}
          {activeSection === "recognition" && <RecognitionAwards />}
           {/* ✅ CERTIFICATES */}
          {activeSection === "certificates" && studentId ? (
            <ViewCertificates
              role="student"
              userId={studentId}
            />
          ) : activeSection === "certificates" ? (
            <p className="no-cert">No certificates available</p>
          ) : null}


        </div>
         <Chatbot />
      </div>
    </div>
  );
}
