import React, { useEffect, useState } from "react";
import AdminNavbar from "./adminNavbar";
import axios from "axios";
import "./AdminCertificates.css";

export default function AdminCertificates() {
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [issued, setIssued] = useState({});

  useEffect(() => {
    axios.get("/api/admin/dashboard/students")
      .then(res => setStudents(res.data));

    axios.get("/api/admin/dashboard/faculty")
      .then(res => setFaculty(res.data));

    // ✅ FETCH ALREADY ISSUED CERTIFICATES
    axios.get("/api/certificates")
      .then(res => {
        const map = {};
        res.data.forEach(c => {
          map[`${c.role}_${c.userId}`] = true;
        });
        setIssued(map);
      });
  }, []);

  const issueCertificate = async (user, role) => {
    try {
      await axios.post("/api/certificates/issue", {
        userId: user._id,
        role,
        name: user.name,
        department: user.department
      });

      alert("Certificate Issued");

      setIssued(prev => ({
        ...prev,
        [`${role}_${user._id}`]: true
      }));

    } catch (err) {
      if (err.response?.status === 409) {
        alert("Certificate already submitted");
      } else {
        alert("Something went wrong");
      }
    }
  };

  const renderTable = (data, role) => (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Research</th>
          <th>Startups</th>
          <th>Publications</th>
          <th>Grants</th>
          <th>SIH</th>
          <th>MSME</th>
          <th>Awards</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map(u => (
          <tr key={u._id}>
            <td>{u.name}</td>
            <td>{u.research}</td>
            <td>{u.startups}</td>
            <td>{u.publications}</td>
            <td>{u.grants}</td>
            <td>{u.sih}</td>
            <td>{u.msme}</td>
            <td>{u.awards}</td>
            <td>
              {issued[`${role}_${u._id}`] ? (
                <button className="issued-btn" disabled>
                  Issued
                </button>
              ) : (
                <button onClick={() => issueCertificate(u, role)}>
                  Generate
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <AdminNavbar />
      <div className="cert-container">
        <h2>Student Certificates</h2>
        {renderTable(students, "student")}

        <h2>Faculty Certificates</h2>
        {renderTable(faculty, "faculty")}
      </div>
    </>
  );
}
