import { useState } from "react";
import axios from "axios";
import "./BulkUpload.css";

export default function BulkUpload() {
  const [files, setFiles] = useState([]);
  const [inputKey, setInputKey] = useState(Date.now());

  const upload = async () => {
    if (files.length === 0) {
      alert("Please select files");
      return;
    }

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    await axios.post("/api/coordinator/upload", formData);

    alert("Uploaded successfully ✅");

    setFiles([]);
    setInputKey(Date.now()); // 🔥 clears file name
  };

  return (
    <div className="upload-wrapper">
      <h3>Bulk Upload</h3>

      <div className="upload-card">
        <input
          key={inputKey}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xlsx"
          onChange={(e) => setFiles([...e.target.files])}
        />

        <button onClick={upload}>Upload Files</button>
      </div>
    </div>
  );
}
