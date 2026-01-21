import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CommonForm.css";
import "./Publications.css";

export default function Publications() {
  const initialState = {
    title: "",
    authors: "",
    type: "Journal",
    publisher: "",
    isbn: "",
    year: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [publications, setPublications] = useState([]);

  /* Fetch publications */
  const fetchPublications = async () => {
    const res = await axios.get("http://localhost:5000/api/publications");
    setPublications(res.data);
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  /* Handle input */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/publications", formData);
      alert("Publication saved successfully 📘");
      setFormData(initialState);
      fetchPublications();
    } catch (err) {
      alert("Failed to save publication ❌");
    }
  };

  return (
    <>
      {/* ========== YOUR PUBLICATIONS (CARDS) ========== */}
      {publications.length > 0 && (
        <div className="publication-section">
          <h3 className="publication-title">Your Publications</h3>

          <div className="publication-grid">
            {publications.map((p) => (
              <div className="publication-card" key={p._id}>
                <h4 className="publication-card-title">{p.title}</h4>

                <div className="publication-row">
                  <span className="publication-label">Authors</span>
                  <span className="publication-colon">:</span>
                  <span className="publication-value">{p.authors}</span>
                </div>

                <div className="publication-row">
                  <span className="publication-label">Type</span>
                  <span className="publication-colon">:</span>
                  <span className="publication-value">{p.type}</span>
                </div>

                <div className="publication-row">
                  <span className="publication-label">Publisher</span>
                  <span className="publication-colon">:</span>
                  <span className="publication-value">{p.publisher}</span>
                </div>

                <div className="publication-row">
                  <span className="publication-label">Year</span>
                  <span className="publication-colon">:</span>
                  <span className="publication-value">{p.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== FORM ========== */}
      <div className="form-wrapper">
        <h3 className="form-title">Publications</h3>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Publication Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Authors</label>
            <input name="authors" value={formData.authors} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Publication Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option>Journal</option>
              <option>Book</option>
              <option>Book Chapter</option>
              <option>Conference</option>
            </select>
          </div>

          <div className="form-group">
            <label>Publisher</label>
            <input name="publisher" value={formData.publisher} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>ISBN / ISSN</label>
            <input name="isbn" value={formData.isbn} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Publication Year</label>
            <input type="number" name="year" value={formData.year} onChange={handleChange} />
          </div>

          <div className="full-width center">
            <button className="submit-btn">Save Publication</button>
          </div>
        </form>
      </div>
    </>
  );
}
