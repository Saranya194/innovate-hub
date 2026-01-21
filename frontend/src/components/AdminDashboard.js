import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import "./AdminDashboard.css";

import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

/* METRIC CARD */
function DashboardMetric({ title, value, className }) {
  return (
    <div className={`admindb-metric-card ${className}`}>
      <span>{title}</span>
      <h3>{value}</h3>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/api/admin/dashboard/metrics")
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading...</p>;

  const barData = {
    labels: ["Research", "SIH", "MSME", "Grants", "Publications", "Awards"],
    datasets: [{
      label: "Total Records",
      data: [
        data.research,
        data.sih,
        data.msme,
        data.grants,
        data.publications,
        data.awards
      ],
      backgroundColor: [
        "#2563eb",
        "#22c55e",
        "#f97316",
        "#eab308",
        "#6366f1",
        "#ef4444"
      ],
      borderRadius: 8
    }]
  };

  const pieData = {
    labels: ["Students", "Faculty"],
    datasets: [{
      data: [data.students, data.faculty],
      backgroundColor: ["#3b82f6", "#10b981"]
    }]
  };

  const lineData = {
    labels: ["Research", "SIH", "MSME", "Grants"],
    datasets: [{
      label: "Innovation Growth",
      data: [data.research, data.sih, data.msme, data.grants],
      borderColor: "#2563eb",
      backgroundColor: "rgba(37,99,235,0.25)",
      fill: true,
      tension: 0.4,
      pointRadius: 4
    }]
  };

  return (
    <AdminLayout>
      <h2 className="admindb-title">Admin System Overview</h2>

      {/* METRICS */}
      <div className="admindb-metrics-grid">
        <DashboardMetric title="Research" value={data.research} className="blue" />
        <DashboardMetric title="Startups" value={data.startups} className="slate" />
        <DashboardMetric title="Publications" value={data.publications} className="indigo" />
        <DashboardMetric title="Grants" value={data.grants} className="yellow" />
        <DashboardMetric title="SIH" value={data.sih} className="green" />
        <DashboardMetric title="MSME" value={data.msme} className="orange" />
        <DashboardMetric title="Awards" value={data.awards} className="red" />
        <DashboardMetric title="Students" value={data.students} className="sky" />
        <DashboardMetric title="Faculty" value={data.faculty} className="emerald" />
        <DashboardMetric title="Departments" value={7} className="purple" />
      </div>

      {/* CHARTS GRID */}
      <div className="admindb-charts-grid">

        {/* BAR */}
        <div className="admindb-chart-card admindb-bar">
          <h4>Overall Contributions</h4>
          <div className="admindb-chart-inner">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* PIE */}
        <div className="admindb-chart-card admindb-pie">
          <h4>User Distribution</h4>
          <div className="admindb-chart-inner">
            <Pie
              data={pieData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } }
              }}
            />
          </div>
        </div>

        {/* LINE */}
        <div className="admindb-chart-card admindb-line">
          <h4>Innovation Trend</h4>
          <div className="admindb-chart-inner">
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
