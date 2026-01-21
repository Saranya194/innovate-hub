import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CommonForm.css";
import "./RecognitionAwards.css";

export default function RecognitionAwards() {
  const initialState = {
    awardTitle: "",
    recipientName: "",
    organization: "",
    awardLevel: "Institutional",
    eventName: "",
    awardDate: "",
    prizeAmount: "",
    certificatePdf: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [awards, setAwards] = useState([]);
  const [fileKey, setFileKey] = useState(Date.now());

  /* FETCH */
  const fetchAwards = async () => {
    const res = await axios.get("http://localhost:5000/api/awards");
    setAwards(res.data);
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  /* HANDLE CHANGE */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) =>
      data.append(key, formData[key])
    );

    await axios.post("http://localhost:5000/api/awards", data);
    alert("Award saved ✅");

    setFormData(initialState);
    setFileKey(Date.now());
    fetchAwards();
  };

  return (
    <>
      {/* ===== CARDS ===== */}
      {awards.length > 0 && (
        <div className="award-section">
          <h3 className="award-title">Your Recognition & Awards</h3>

          <div className="award-grid">
            {awards.map((a) => (
              <div className="award-card" key={a._id}>
                <h4 className="award-card-title">{a.awardTitle}</h4>

                <div className="award-row">
                  <span className="award-label">Recipient</span>
                  <span className="award-colon">:</span>
                  <span className="award-value">{a.recipientName}</span>
                </div>

                <div className="award-row">
                  <span className="award-label">Level</span>
                  <span className="award-colon">:</span>
                  <span className="award-value">{a.awardLevel}</span>
                </div>

                <div className="award-row">
                  <span className="award-label">Prize</span>
                  <span className="award-colon">:</span>
                  <span className="award-value">₹ {a.prizeAmount || "-"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== FORM ===== */}
      <div className="form-wrapper">
        <h3 className="form-title">Recognition & Awards</h3>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Award Title</label>
            <input name="awardTitle" value={formData.awardTitle} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Recipient Name</label>
            <input name="recipientName" value={formData.recipientName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Awarding Organization</label>
            <input name="organization" value={formData.organization} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Award Level</label>
            <select name="awardLevel" value={formData.awardLevel} onChange={handleChange}>
              <option>Institutional</option>
              <option>State</option>
              <option>National</option>
              <option>International</option>
            </select>
          </div>

          <div className="form-group">
            <label>Event Name</label>
            <input name="eventName" value={formData.eventName} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Date of Award</label>
            <input type="date" name="awardDate" value={formData.awardDate} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Prize / Cash Amount</label>
            <input type="number" name="prizeAmount" value={formData.prizeAmount} onChange={handleChange} />
          </div>

          <div className="form-group full-width">
            <label>Certificate Upload (PDF)</label>
            <input
              key={fileKey}
              type="file"
              name="certificatePdf"   // 🔥 MUST MATCH BACKEND
              accept="application/pdf"
              onChange={handleChange}
              required
            />
          </div>

          <div className="full-width center">
            <button className="submit-btn">Save Award</button>
          </div>
        </form>
      </div>
    </>
  );
}
