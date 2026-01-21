import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CommonForm.css";
import "./GrantsFunding.css";

export default function GrantsFunding() {
  const initialState = {
    projectTitle: "",
    principalInvestigator: "",
    fundingAgency: "",
    amount: "",
    status: "Ongoing",
    description: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [grants, setGrants] = useState([]);

  /* Fetch grants */
  const fetchGrants = async () => {
    const res = await axios.get("http://localhost:5000/api/grants");
    setGrants(res.data);
  };

  useEffect(() => {
    fetchGrants();
  }, []);

  /* Handle input */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/grants", formData);
      alert("Grant details saved successfully 💰");
      setFormData(initialState);
      fetchGrants();
    } catch (err) {
      alert("Failed to save grant ❌");
    }
  };

  return (
    <>
      {/* ========== YOUR GRANTS (CARDS) ========== */}
      {grants.length > 0 && (
        <div className="grant-section">
          <h3 className="grant-title">Your Grants & Funding</h3>

          <div className="grant-grid">
            {grants.map((g) => (
              <div className="grant-card" key={g._id}>
                <h4 className="grant-card-title">{g.projectTitle}</h4>

                <div className="grant-row">
                  <span className="grant-label">Amount</span>
                  <span className="grant-colon">:</span>
                  <span className="grant-value">₹ {g.amount}</span>
                </div>

                <div className="grant-row">
                  <span className="grant-label">Status</span>
                  <span className="grant-colon">:</span>
                  <span className="grant-value">{g.status}</span>
                </div>

                <div className="grant-row">
                  <span className="grant-label">Agency</span>
                  <span className="grant-colon">:</span>
                  <span className="grant-value">{g.fundingAgency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== FORM ========== */}
      <div className="form-wrapper">
        <h3 className="form-title">Grants & Funding</h3>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title</label>
            <input
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Principal Investigator</label>
            <input
              name="principalInvestigator"
              value={formData.principalInvestigator}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Funding Agency</label>
            <input
              name="fundingAgency"
              value={formData.fundingAgency}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Sanctioned Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Project Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Ongoing</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="full-width center">
            <button className="submit-btn">Save Grant</button>
          </div>
        </form>
      </div>
    </>
  );
}
