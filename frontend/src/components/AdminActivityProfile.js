import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import "./AdminActivityProfile.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

/* 🔤 Header formatter */
const formatHeader = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

/* 🔹 Display dash for empty values */
const displayValue = (v) =>
  v === null || v === undefined || v === "" ? "-" : v;

/* 📎 File field per activity */
const FILE_FIELD = {
  research: "paperPdf",
  sih: "sihFile",
  msme: "msmePdf",
  awards: "certificatePdf",
};

export default function AdminActivityProfile() {
  const { activity, role, id } = useParams();
  const [profile, setProfile] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/admin/activity/${activity}/${role}/${id}`)
      .then((res) => {
        setProfile(res.data.profile);
        setRecords(res.data.records || []);
      })
      .catch(console.error);
  }, [activity, role, id]);

  if (!profile) return <p className="loading">Loading...</p>;

  const fileKey = FILE_FIELD[activity];

  /* ⬇️ EXPORT CSV */
  const exportCSV = () => {
  if (!records.length) return;

  const headers = Object.keys(records[0]).filter(
    (k) =>
      !["_id", "ownerId", "ownerRole", "__v"].includes(k) &&
      k !== fileKey
  );

  const rows = [
    headers.map(formatHeader).join(","), // table-style headers
    ...records.map((r) =>
      headers.map((h) => displayValue(r[h])).join(",")
    ),
  ];

  const blob = new Blob([rows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${activity}_${profile.name}.csv`;
  link.click();
};


  return (
    <div className="activity-profile">

      {/* 🔷 TOP BAR */}
      <div className="profile-bar">
        <div>
          <h2>{profile.name}</h2>
          <span>
            {role === "student"
              ? `${profile.department} · Year ${profile.year}`
              : `${profile.designation} · ${profile.department}`}
          </span>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/admin-dashboard";
          }}
        >
          Logout
        </button>
      </div>

      {/* 🔷 METRIC */}
      <div className="metric-row">
        <div className="metric-box">
          Total {activity.toUpperCase()} : <b>{records.length}</b>
        </div>
      </div>

      {/* 🔷 BAR CHART */}
      <div className="chart-card">
        <h3>{activity.toUpperCase()} Submissions</h3>
        <div className="chart-wrapper">
          <Bar
            data={{
              labels: ["Submitted"],
              datasets: [
                {
                  data: [records.length],
                  backgroundColor: "#2563eb",
                  barThickness: 36,
                  borderRadius: 0,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 6,
                  ticks: { stepSize: 1 },
                },
              },
            }}
          />
        </div>
      </div>

      {/* 🔷 TABLE */}
      <div className="table-card">
        <div className="table-header">
          <h3>{activity.toUpperCase()} Details</h3>
          <button className="export-btn" onClick={exportCSV}>
            Export CSV
          </button>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {records.length > 0 &&
                  Object.keys(records[0])
                    .filter(
                      (k) =>
                        !["_id", "ownerId", "ownerRole", "__v"].includes(k) &&
                        k !== fileKey
                    )
                    .map((k) => (
                      <th key={k}>{formatHeader(k)}</th>
                    ))}
                {fileKey && <th>File</th>}
              </tr>
            </thead>

            <tbody>
              {records.map((r) => (
                <tr key={r._id}>
                  {Object.keys(r)
                    .filter(
                      (k) =>
                        !["_id", "ownerId", "ownerRole", "__v"].includes(k) &&
                        k !== fileKey
                    )
                    .map((k) => (
                      <td key={k}>{displayValue(r[k])}</td>
                    ))}

                  {fileKey && (
                    <td>
                      {r[fileKey] ? (
                       <a
  className="download-btn"
  href={`http://localhost:5000/api/download/${r[fileKey]}`}
>
  Download
</a>

                      ) : (
                        "-"
                      )}
                    </td>
                  )}
                </tr>
              ))}

              {!records.length && (
                <tr>
                  <td colSpan="100%" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
