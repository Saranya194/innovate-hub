import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CommonForm.css";
import "./StartupActivities.css";

export default function StartupActivities() {
  const initialState = {
    startupName: "",
    founders: "",
    category: "EdTech",
    stage: "Idea",
    incubator: "",
    mentor: "",
    description: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [startups, setStartups] = useState([]);

  /* Fetch startups */
  const fetchStartups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/startups");
      setStartups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  /* Handle input */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/startups", formData);
      alert("Startup details saved successfully 🚀");
      setFormData(initialState);
      fetchStartups();
    } catch (err) {
      alert("Failed to save startup ❌");
    }
  };

  return (
    <>
      {/* ========= STARTUP LIST (CARDS) ========= */}
      {/* ================= YOUR STARTUP ACTIVITIES ================= */}
{startups.length > 0 && (
  <div className="startup-section">
    <h3 className="startup-title">Your Startup Activities</h3>

    <div className="startup-grid">
      {startups.map((s) => (
        <div className="startup-card" key={s._id}>
          <h4 className="startup-card-title">{s.startupName}</h4>

          <div className="startup-row">
            <span className="startup-label">Founders</span>
            <span className="startup-colon">:</span>
            <span className="startup-value">{s.founders}</span>
          </div>

          <div className="startup-row">
            <span className="startup-label">Category</span>
            <span className="startup-colon">:</span>
            <span className="startup-value">{s.category}</span>
          </div>

          <div className="startup-row">
            <span className="startup-label">Stage</span>
            <span className="startup-colon">:</span>
            <span className="startup-value">{s.stage}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      {/* ========= FORM ========= */}
      <div className="form-wrapper">
        <h3 className="form-title">Startup Activities</h3>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Startup Name</label>
            <input name="startupName" value={formData.startupName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Founder(s)</label>
            <input name="founders" value={formData.founders} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Startup Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option>EdTech</option>
              <option>HealthTech</option>
              <option>FinTech</option>
              <option>AgriTech</option>
              <option>AI</option>
              <option>Others</option>
            </select>
          </div>

          <div className="form-group">
            <label>Startup Stage</label>
            <select name="stage" value={formData.stage} onChange={handleChange}>
              <option>Idea</option>
              <option>Prototype</option>
              <option>MVP</option>
              <option>Launched</option>
            </select>
          </div>

          <div className="form-group">
            <label>Incubator Name</label>
            <input name="incubator" value={formData.incubator} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Mentor Name</label>
            <input name="mentor" value={formData.mentor} onChange={handleChange} />
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </div>

          <div className="full-width center">
            <button className="submit-btn">Save Startup</button>
          </div>
        </form>
      </div>
    </>
  );
}
