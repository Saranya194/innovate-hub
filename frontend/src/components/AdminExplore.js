import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import "./AdminExplore.css";

/* ================= CONSTANTS ================= */

const DEPARTMENTS = [
  "AI&DS",
  "AI&ML",
  "ASE",
  "CSE",
  "ECE",
  "Civil",
  "Mech",
];

const YEARS = ["I", "II", "III", "IV"];

const DEPT_FULL = {
  "AI&DS": "Artificial Intelligence & Data Science",
  "AI&ML": "Artificial Intelligence & Machine Learning",
  "ASE": "Aero Space Engineering",
  "CSE": "Computer Science & Engineering",
  "ECE": "Electronics & Communication Engineering",
  "Civil": "Civil Engineering",
  "Mech": "Mechanical Engineering",
};

/* NAVBAR ROUTE → ACTIVITY */
const ACTIVITY_MAP = {
  "/admin/research": "research",
  "/admin/startup": "startup",
  "/admin/publications": "publications",
  "/admin/grants": "grants",
  "/admin/sih": "sih",
  "/admin/msme": "msme",
  "/admin/awards": "awards",
};

export default function AdminExplore() {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ CORRECT PLACE
  const activity = ACTIVITY_MAP[location.pathname] || null;

  const [roles, setRoles] = useState(["student", "faculty"]);
  const [departments, setDepartments] = useState([]);
  const [years, setYears] = useState([]);
  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState(false);

  /* RESET RESULTS ON NAV CHANGE */
  useEffect(() => {
    setUsers([]);
    setSearched(false);
  }, [location.pathname]);

  /* TOGGLE HANDLER */
  const toggle = (value, list, setList) => {
    setList(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };

  /* SEARCH */
  const handleSearch = async () => {
    setSearched(true);

    const res = await axios.get("/api/admin/explore/users", {
      params: {
        roles,
        departments,
        years,
        activity,
      },
    });

    setUsers(res.data);
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
            <label>
              <input
                type="checkbox"
                checked={roles.includes("student")}
                onChange={() => toggle("student", roles, setRoles)}
              />
              Student
            </label>
            <label>
              <input
                type="checkbox"
                checked={roles.includes("faculty")}
                onChange={() => toggle("faculty", roles, setRoles)}
              />
              Faculty
            </label>
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

          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </aside>

        {/* RESULTS */}
        <main className="results-panel">
          {searched && (
            <h4 className="results-count">
              Results ({users.length})
            </h4>
          )}

          {users.map((u) => (
            <div className="user-card" key={u._id}>
              <div className="user-left">
                <h5 className="user-name">{u.name}</h5>

                <p className="user-sub">
                  {u.role === "student" && (
                    <>
                      {DEPT_FULL[u.department]} · Year {u.year}
                    </>
                  )}

                  {u.role === "faculty" && (
                    <>
                      {u.designation} · {DEPT_FULL[u.department]}
                    </>
                  )}
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
