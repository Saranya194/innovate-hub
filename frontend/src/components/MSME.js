import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CommonForm.css";
import "./MSME.css";
import FaceVerifyModal from "./FaceVerifyModal"; // ✅ ADDED

export default function MSME() {
  const initialState = {
    title: "",
    incubateeName: "",
    mentorDetails: "",
    ideaSector: "",
    totalCost: "",
    problemStatement: "",
    msmePdf: null,
  };

  const role = localStorage.getItem("adminRole");
const isCoordinator =
  role === "central_coordinator" || role === "incubation_coordinator";

  const [formData, setFormData] = useState(initialState);
  const [msmes, setMsmes] = useState([]);
  const [fileKey, setFileKey] = useState(Date.now());

  /* ===============================
     FACE VERIFY STATES (ADDED)
  =============================== */
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [verified, setVerified] = useState(false);

  /* ===============================
     FETCH
  =============================== */
  const fetchMSME = async () => {
    const res = await axios.get("http://localhost:5000/api/msme");
    setMsmes(res.data);
  };

  useEffect(() => {
    fetchMSME();
  }, []);

  /* ===============================
     CHANGE
  =============================== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  /* ===============================
     REAL SUBMIT
  =============================== */
  const submitMSME = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) =>
      data.append(key, formData[key])
    );

    await axios.post("http://localhost:5000/api/msme", data);
    alert("MSME saved successfully ✅");

    setFormData(initialState);
    setFileKey(Date.now());
    setVerified(false);
    fetchMSME();
  };

  /* ===============================
     FORM SUBMIT
  =============================== */
  const handleSubmit = (e) => {
    e.preventDefault();
    // 🚫 NO FACE VERIFICATION FOR COORDINATORS
  if (isCoordinator) {
    submitMSME();
    return;
  }
    if (!verified) {
      setShowFaceModal(true);
      return;
    }

    submitMSME();
  };

  return (
    <>
      {/* ================= MSME CARDS ================= */}
      {msmes.length > 0 && (
        <div className="msme-section">
          <h3 className="msme-title">Your MSME Submissions</h3>

          <div className="msme-grid">
              {msmes.map((m) => (
                <div className="msme-card" key={m._id}>
                  <h4 className="msme-card-title">{m.title}</h4>

                  <div className="msme-row">
                    <span className="msme-label">Sector</span>
                    <span className="msme-colon">:</span>
                    <span className="msme-value">{m.ideaSector}</span>
                  </div>

                  <div className="msme-row">
                    <span className="msme-label">Cost</span>
                    <span className="msme-colon">:</span>
                    <span className="msme-value">₹ {m.totalCost}</span>
                  </div>

                  <div className="msme-row">
                    <span className="msme-label">Incubatee</span>
                    <span className="msme-colon">:</span>
                    <span className="msme-value">{m.incubateeName}</span>
                  </div>
                </div>
              ))}
            </div>

        </div>
      )}

      {/* ================= MSME FORM ================= */}
      <div className="form-wrapper">
        <h3 className="form-title">MSME Details</h3>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title of Proposed Idea / Innovation</label>
            <input name="title" value={formData.title} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Incubatee Name</label>
            <input name="incubateeName" value={formData.incubateeName} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Mentor Name & Details</label>
            <input name="mentorDetails" value={formData.mentorDetails} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Idea Sector</label>
            <input name="ideaSector" value={formData.ideaSector} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Total Idea / Project Cost (₹)</label>
            <input type="number" name="totalCost" value={formData.totalCost} onChange={handleChange} />
          </div>

          <div className="form-group full-width">
            <label>Problem Statement</label>
            <textarea name="problemStatement" value={formData.problemStatement} onChange={handleChange} />
          </div>

          <div className="form-group full-width">
            <label>Upload MSME PDF</label>
            <input
              key={fileKey}
              type="file"
              name="msmePdf"
              accept="application/pdf"
              onChange={handleChange}
              required
            />
          </div>

          <button className="submit-btn" type="submit">
            Save MSME
          </button>
        </form>
      </div>

      {/* ================= FACE VERIFY MODAL ================= */}
      {showFaceModal && !isCoordinator && (
        <FaceVerifyModal
          onSuccess={() => {
            setVerified(true);
            setShowFaceModal(false);
            submitMSME(); // ✅ submit only once
          }}
          onClose={() => setShowFaceModal(false)}
        />
      )}
    </>
  );
}
