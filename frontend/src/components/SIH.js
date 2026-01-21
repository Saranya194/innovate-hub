import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CommonForm.css";
import "./SIH.css";
import FaceVerifyModal from "./FaceVerifyModal"; // ✅ ADDED

export default function SIH() {
  const initialState = {
    teamName: "",
    teamMembers: "",
    mentorName: "",
    problemStatementId: "",
    problemStatementTitle: "",
    category: "Software",
    edition: "2025",
    theme: "",
    sihFile: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [fileKey, setFileKey] = useState(Date.now());
  const [sihList, setSihList] = useState([]);

  /* ===============================
     FACE VERIFY STATES (ADDED)
  =============================== */
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [verified, setVerified] = useState(false);

  /* ===============================
     RESET
  =============================== */
  const resetForm = () => {
    setFormData(initialState);
    setFileKey(Date.now());
    setVerified(false);
  };

  /* ===============================
     FETCH
  =============================== */
  const fetchSIH = async () => {
    const res = await axios.get("http://localhost:5000/api/sih");
    setSihList(res.data);
  };

  useEffect(() => {
    fetchSIH();
  }, []);

  /* ===============================
     HANDLE CHANGE
  =============================== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "sihFile" && files?.[0]) {
      const allowed = [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];
      if (!allowed.includes(files[0].type)) {
        alert("Only PDF / PPT / PPTX allowed ❌");
        resetForm();
        return;
      }
    }

    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  /* ===============================
     REAL SUBMIT (ONLY ONCE)
  =============================== */
  const submitSIH = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) =>
      data.append(key, formData[key])
    );

    try {
      await axios.post("http://localhost:5000/api/sih", data);
      alert("SIH saved successfully ✅");
      resetForm();
      fetchSIH();
    } catch {
      alert("Failed to save SIH ❌");
    }
  };

  /* ===============================
     FORM SUBMIT
  =============================== */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!verified) {
      setShowFaceModal(true);
      return;
    }

    submitSIH();
  };

  return (
    <>
      {/* ================= SIH CARDS ================= */}
      {sihList.length > 0 && (
        <div className="sih-section">
          <h3 className="sih-title">Your Smart India Hackathon Entries</h3>

          <div className="sih-grid">
                {sihList.map((s) => (
                  <div className="sih-card" key={s._id}>
                    <h4 className="sih-card-title">{s.problemStatementTitle}</h4>

                    <div className="sih-row">
                      <span className="sih-label">PS ID</span>
                      <span className="sih-colon">:</span>
                      <span className="sih-value">{s.problemStatementId}</span>
                    </div>

                    <div className="sih-row">
                      <span className="sih-label">Category</span>
                      <span className="sih-colon">:</span>
                      <span className="sih-value">{s.category}</span>
                    </div>

                    <div className="sih-row">
                      <span className="sih-label">Theme</span>
                      <span className="sih-colon">:</span>
                      <span className="sih-value">{s.theme}</span>
                    </div>
                  </div>
                ))}
              </div>

        </div>
      )}

      {/* ================= FORM ================= */}
      <div className="form-wrapper">
        <h3 className="form-title">Smart India Hackathon</h3>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Team Name</label>
            <input name="teamName" value={formData.teamName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Team Members</label>
            <input name="teamMembers" value={formData.teamMembers} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Mentor Name</label>
            <input name="mentorName" value={formData.mentorName} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Problem Statement ID</label>
            <input name="problemStatementId" value={formData.problemStatementId} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Problem Statement Title</label>
            <input name="problemStatementTitle" value={formData.problemStatementTitle} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option>Software</option>
              <option>Hardware</option>
            </select>
          </div>

          <div className="form-group">
            <label>SIH Edition</label>
            <select name="edition" value={formData.edition} onChange={handleChange}>
              <option>2023</option>
              <option>2024</option>
              <option>2025</option>
            </select>
          </div>

          <div className="form-group">
            <label>Theme</label>
            <input name="theme" value={formData.theme} onChange={handleChange} />
          </div>

          <div className="form-group full-width">
            <label>Upload SIH PPT / PDF</label>
            <input
              key={fileKey}
              type="file"
              name="sihFile"
              accept=".pdf,.ppt,.pptx"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Save SIH
          </button>
        </form>
      </div>

      {/* ================= FACE VERIFY MODAL ================= */}
      {showFaceModal && (
        <FaceVerifyModal
          onSuccess={() => {
            setVerified(true);
            setShowFaceModal(false);
            submitSIH(); // ✅ submit only once
          }}
          onClose={() => setShowFaceModal(false)}
        />
      )}
    </>
  );
}
