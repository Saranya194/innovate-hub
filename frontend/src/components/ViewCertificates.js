import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewCertificates.css";

export default function ViewCertificates({ role, userId }) {
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/api/certificates/${role}/${userId}`)
      .then(res => setCerts(res.data))
      .catch(() => setCerts([]));
  }, [role, userId]);

  if (certs.length === 0) {
    return <p className="no-cert">No certificates available</p>;
  }

  return (
    <div className="cert-list">
      {certs.map(c => (
        <div key={c._id}>

          {/* CARD */}
          <div className="cert-card">
            <h4>Your Certificate</h4>
            <p>Issued on: {new Date(c.createdAt).toDateString()}</p>

           {/* ✅ FORCE DOWNLOAD */}
            <a
              href={`http://localhost:5000/api/download/${c.fileName}`}
              className="download-btn"
            >
              Download Certificate (PDF)
            </a>
          </div>

          {/* 🔹 BIG PREVIEW – NO HEADER / FOOTER */}
          <div className="cert-preview-wrapper">
            <embed
              src={`http://localhost:5000/uploads/certificates/${c.fileName}`}
              type="application/pdf"
              className="cert-preview"
            />
          </div>

        </div>
      ))}
    </div>
  );
}
