import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import AdminLayout from "./AdminLayout";
import "./AdminExplore.css";

/* ================= CONSTANTS ================= */

const DEPARTMENTS = ["AI&DS", "AI&ML", "ASE", "CSE", "ECE", "Civil", "Mech"];
const YEARS = ["I", "II", "III", "IV"];
const EDITIONS = ["2023", "2024", "2025"];

const DEPT_FULL = {
  "AI&DS": "Artificial Intelligence & Data Science",
  "AI&ML": "Artificial Intelligence & Machine Learning",
  ASE: "Aero Space Engineering",
  CSE: "Computer Science & Engineering",
  ECE: "Electronics & Communication Engineering",
  Civil: "Civil Engineering",
  Mech: "Mechanical Engineering",
};

const ACTIVITY_MAP = {
  "/admin/research": "research",
  "/admin/startup": "startup",
  "/admin/publications": "publications",
  "/admin/grants": "grants",
  "/admin/sih": "sih",
  "/admin/msme": "msme",
  "/admin/awards": "awards",
};

/* 🔤 Header formatter */
const formatHeader = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export default function AdminExplore() {
  const location = useLocation();
  const navigate = useNavigate();
  const activity = ACTIVITY_MAP[location.pathname] || null;
  const isSIH = activity === "sih";

  const [roles, setRoles] = useState([
  "student",
  "faculty",
  "central_coordinator",
  "incubation_coordinator"
]);

  const [departments, setDepartments] = useState([]);
  const [years, setYears] = useState([]);
  const [edition, setEdition] = useState([]); // only for SIH
  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setUsers([]);
    setSearched(false);
    setEdition([]);
  }, [location.pathname]);

  const toggle = (value, list, setList) => {
    setList(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };

  const handleSearch = async () => {
    setSearched(true);

    const res = await axios.get("/api/admin/explore/users", {
      params: { roles, departments, years, activity },
    });

    // 🚫 Edition filtering ONLY for SIH
    if (!isSIH || edition.length === 0) {
      setUsers(res.data);
      return;
    }

    const filteredUsers = [];

    for (const u of res.data) {
      const r = await axios.get(
        `/api/admin/activity/${activity}/${u.role}/${u._id}`
      );

      const hasEdition = r.data.records.some(
        (rec) => edition.includes(String(rec.edition))
      );

      if (hasEdition) filteredUsers.push(u);
    }

    setUsers(filteredUsers);
  };

  /* ================= EXPORT ALL SUBMISSIONS ================= */
  const exportAllExcel = async () => {
    if (!users.length) {
      alert("No users found");
      return;
    }

    let allRows = [];

    for (const u of users) {
      const res = await axios.get(
        `/api/admin/activity/${activity}/${u.role}/${u._id}`
      );

      res.data.records
        .filter(
          (r) =>
            !isSIH ||
            edition.length === 0 ||
            edition.includes(String(r.edition))
        )
        .forEach((r) => {
          const row = {
            Name: u.name,
            Role: u.role,
            Department: DEPT_FULL[u.department],
            Year: u.year,
            ...(isSIH && { Edition: r.edition }),
          };

          Object.keys(r).forEach((k) => {
            if (
              ["_id", "ownerId", "ownerRole", "__v", "edition"].includes(k) ||
              k.toLowerCase().includes("pdf") ||
              k.toLowerCase().includes("file")
            )
              return;

            let value = r[k];
            if (Array.isArray(value)) value = value.join(", ");
            if (!value) value = "-";

            row[formatHeader(k)] = value;
          });

          allRows.push(row);
        });
    }

    if (!allRows.length) {
      alert("No submissions found");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(allRows);
    const workbook = XLSX.utils.book_new();

    // Bold header row
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c })];
      if (cell) cell.s = { font: { bold: true } };
    }

    worksheet["!cols"] = Object.keys(allRows[0]).map((k) => ({
      wch: Math.max(
        k.length,
        ...allRows.map((r) => String(r[k]).length)
      ),
    }));

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      activity.toUpperCase()
    );

    XLSX.writeFile(
      workbook,
      `${activity.toUpperCase()}_${isSIH ? edition.join("_") || "ALL" : "ALL"}.xlsx`
    );
  };

  return (
    <AdminLayout>
      <div className="explore-page">
        {/* FILTER PANEL */}
        <aside className="filter-panel">
          <h3>Filter By</h3>

          {/* USER TYPE */}
          <div className="filter-group">
            <h4>User Type</h4>
            {[
  "student",
  "faculty",
  "central_coordinator",
  "incubation_coordinator"
].map((r) => (
  <label key={r}>
    <input
      type="checkbox"
      checked={roles.includes(r)}
      onChange={() => toggle(r, roles, setRoles)}
    />
    {r.replace("_", " ")}
  </label>
))}

          </div>

          {/* DEPARTMENT */}
          <div className="filter-group">
            <h4>Department</h4>
            <label>
              <input
                type="checkbox"
                checked={departments.length === 0}
                onChange={() => setDepartments([])}
              />
              All Departments
            </label>

            {DEPARTMENTS.map((d) => (
              <label key={d}>
                <input
                  type="checkbox"
                  checked={departments.includes(d)}
                  onChange={() => toggle(d, departments, setDepartments)}
                />
                {d}
              </label>
            ))}
          </div>

          {/* YEAR */}
          {roles.includes("student") && (
            <div className="filter-group">
              <h4>Year</h4>
              <label>
                <input
                  type="checkbox"
                  checked={years.length === 0}
                  onChange={() => setYears([])}
                />
                All Years
              </label>

              {YEARS.map((y) => (
                <label key={y}>
                  <input
                    type="checkbox"
                    checked={years.includes(y)}
                    onChange={() => toggle(y, years, setYears)}
                  />
                  {y}
                </label>
              ))}
            </div>
          )}

          {/* 🔥 EDITION — ONLY FOR SIH */}
          {isSIH && (
            <div className="filter-group">
              <h4>Edition</h4>
              <label>
                <input
                  type="checkbox"
                  checked={edition.length === 0}
                  onChange={() => setEdition([])}
                />
                All
              </label>

              {EDITIONS.map((e) => (
                <label key={e}>
                  <input
                    type="checkbox"
                    checked={edition.includes(e)}
                    onChange={() => toggle(e, edition, setEdition)}
                  />
                  {e}
                </label>
              ))}
            </div>
          )}

          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </aside>

        {/* RESULTS */}
        <main className="results-panel">
          {searched && (
            <>
              <h4 className="results-count">
                Results ({users.length})
              </h4>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <button className="view-btn" onClick={exportAllExcel}>
                  Export Excel
                </button>
              </div>
            </>
          )}

          {users.map((u) => (
            <div className="user-card" key={u._id}>
              <div className="user-left">
                <h5 className="user-name">{u.name}</h5>
                <p className="user-sub">
  {u.role === "student" && (
    `${DEPT_FULL[u.department]} · Year ${u.year}`
  )}

  {u.role === "faculty" && (
    `${u.designation} · ${DEPT_FULL[u.department]}`
  )}

  {(u.role === "central_coordinator" ||
    u.role === "incubation_coordinator") 
  }
</p>

              </div>

              <button
                className="view-btn"
                onClick={() =>
                  navigate(`/admin/${activity}/${u.role}/${u._id}`)
                }
              >
                View Profile
              </button>
            </div>
          ))}
        </main>
      </div>
    </AdminLayout>
  );
}
