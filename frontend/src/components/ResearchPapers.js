import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ResearchPapers.css";
import FaceVerifyModal from "./FaceVerifyModal";

export default function ResearchPapers() {
  /* ===============================
     INITIAL STATE
  =============================== */
  const initialState = {
    paperTitle: "",
    authors: "",
    correspondingAuthor: "",
    journalName: "",
    publisher: "IEEE",
    publicationType: "Journal",
    volume: "",
    issue: "",
    pageNumbers: "",
    publicationDate: "",
    citationCount: "",
    paperPdf: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [fileKey, setFileKey] = useState(Date.now());
  const [papers, setPapers] = useState([]);

  /* ===============================
     FACE VERIFY STATES
  =============================== */
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [verified, setVerified] = useState(false);

  /* ===============================
     HELPERS
  =============================== */
  const resetForm = () => {
    setFormData(initialState);
    setFileKey(Date.now());
    setVerified(false);
  };

  const fetchPapers = async () => {
    const res = await axios.get("http://localhost:5000/api/research");
    setPapers(res.data);
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  /* ===============================
     INPUT CHANGE
  =============================== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "paperPdf" && files?.[0]) {
      if (files[0].type !== "application/pdf") {
        alert("Only PDF files allowed ❌");
        resetForm();
        return;
      }
    }

    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  /* ===============================
     REAL SUBMIT (ONLY ONCE)
  =============================== */
  const submitPaper = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) =>
      data.append(key, formData[key])
    );

    try {
      await axios.post("http://localhost:5000/api/research", data);
      alert("Research Paper saved ✅");
      resetForm();
      fetchPapers();
    } catch (err) {
      alert("Submission failed ❌");
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

    submitPaper();
  };

  /* ===============================
     DELETE
  =============================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this paper?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/research/${id}`);
      setPapers((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Delete failed ❌");
    }
  };

  return (
    <>
      {/* ================= YOUR PAPERS ================= */}
      {papers.length > 0 && (
        <div className="papers-section">
          <h3 className="papers-title">Your Research Papers</h3>

          <div className="papers-grid">
                {papers.map((p) => (
                  <div className="paper-card" key={p._id}>
                    <h4 className="paper-title">{p.paperTitle}</h4>

                    <div className="paper-row">
                      <span className="paper-label">Authors</span>
                      <span className="paper-colon">:</span>
                      <span className="paper-value">{p.authors}</span>
                    </div>

                    <div className="paper-row">
                      <span className="paper-label">Publisher</span>
                      <span className="paper-colon">:</span>
                      <span className="paper-value">{p.publisher}</span>
                    </div>

                    <div className="paper-row">
                      <span className="paper-label">Date</span>
                      <span className="paper-colon">:</span>
                      <span className="paper-value">
                        {p.publicationDate
                          ? new Date(p.publicationDate).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

        </div>
      )}

      {/* ================= ADD FORM ================= */}
      <div className="research-wrapper">
        <h3 className="section-title">Add Research Paper</h3>

        <form className="research-form" onSubmit={handleSubmit}>
          {[
            ["Paper Title", "paperTitle"],
            ["Authors", "authors"],
            ["Corresponding Author", "correspondingAuthor"],
            ["Journal / Conference Name", "journalName"],
          ].map(([label, name]) => (
            <div className="form-group" key={name}>
              <label>{label}</label>
              <input
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="form-group">
            <label>Publisher</label>
            <select
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
            >
              <option>IEEE</option>
              <option>Springer</option>
              <option>Elsevier</option>
              <option>ACM</option>
              <option>Others</option>
            </select>
          </div>

          <div className="form-group">
            <label>Publication Type</label>
            <select
              name="publicationType"
              value={formData.publicationType}
              onChange={handleChange}
            >
              <option>Journal</option>
              <option>Conference</option>
            </select>
          </div>

          {["volume", "issue", "pageNumbers"].map((k) => (
            <div className="form-group" key={k}>
              <label>{k.charAt(0).toUpperCase() + k.slice(1)}</label>
              <input name={k} value={formData[k]} onChange={handleChange} />
            </div>
          ))}

          <div className="form-group">
            <label>Publication Date</label>
            <input
              type="date"
              name="publicationDate"
              value={formData.publicationDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Citation Count</label>
            <input
              type="number"
              name="citationCount"
              value={formData.citationCount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>- PDF Upload</label>
            <input
              key={fileKey}
              type="file"
              name="paperPdf"
              accept="application/pdf"
              onChange={handleChange}
              required
            />
          </div>

          <button className="submit-btn" type="submit">
            Add Research Paper
          </button>
        </form>
      </div>

      {/* ================= FACE VERIFY MODAL ================= */}
      {showFaceModal && (
        <FaceVerifyModal
          onSuccess={() => {
            setVerified(true);
            setShowFaceModal(false);
            submitPaper();
          }}
          onClose={() => setShowFaceModal(false)}
        />
      )}
    </>
  );
}
