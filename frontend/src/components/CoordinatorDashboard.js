import { useState, useEffect } from "react";
import CoordinatorSidebar from "./CoordinatorSidebar";
import CoordinatorHeader from "./CoordinatorHeader";

import ResearchPapers from "./ResearchPapers";
import StartupActivities from "./StartupActivities";
import Publications from "./Publications";
import GrantsFunding from "./GrantsFunding";
import SIH from "./SIH";
import MSME from "./MSME";
import RecognitionAwards from "./RecognitionAwards";
import BulkUpload from "./BulkUpload";

import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
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

export default function CoordinatorDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(
          "/api/coordinator/dashboard/metrics"
        );
        setAnalytics(res.data);
      } catch (err) {
        console.error("Coordinator metrics load failed");
      }
    };

    fetchAnalytics();
  }, []);

  const barData = analytics && {
    labels: [
      "Research",
      "Startups",
      "Publications",
      "Grants",
      "SIH",
      "MSME",
      "Awards"
    ],
    datasets: [
      {
        label: "Your Submissions",
        data: [
          analytics.research,
          analytics.startups,
          analytics.publications,
          analytics.grants,
          analytics.sih,
          analytics.msme,
          analytics.awards
        ],
        backgroundColor: "#2563eb"
      }
    ]
  };

  const pieData = analytics && {
    labels: ["Research", "Publications", "Startups"],
    datasets: [
      {
        data: [
          analytics.research,
          analytics.publications,
          analytics.startups
        ],
        backgroundColor: ["#3b82f6", "#22c55e", "#f97316"]
      }
    ]
  };

  return (
    <div className="dashboard-wrapper">
      <CoordinatorSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className="dashboard-main">
        <CoordinatorHeader />

        <div className="dashboard-content">
          {activeSection === "dashboard" && analytics && (
            <>
              <h3>Your Coordinator Metrics</h3>

              <div className="metrics-grid">
                <div className="metric-box">
                  <h4>Research</h4>
                  <p>{analytics.research}</p>
                </div>

                <div className="metric-box">
                  <h4>Publications</h4>
                  <p>{analytics.publications}</p>
                </div>

                <div className="metric-box">
                  <h4>Startups</h4>
                  <p>{analytics.startups}</p>
                </div>

                <div className="metric-box">
                  <h4>Grants</h4>
                  <p>{analytics.grants}</p>
                </div>

                <div className="metric-box">
                  <h4>SIH</h4>
                  <p>{analytics.sih}</p>
                </div>

                <div className="metric-box">
                  <h4>MSME</h4>
                  <p>{analytics.msme}</p>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-box">
                  <h4>Overall Submissions</h4>
                  <Bar data={barData} />
                </div>

                <div className="chart-box">
                  <h4>Contribution Split</h4>
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
          {activeSection === "bulkUpload" && <BulkUpload />}
        </div>
      </div>
    </div>
  );
}
