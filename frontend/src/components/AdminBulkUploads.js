import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function AdminBulkUploads() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
     axios
  .get("/api/coordinator/admin/coordinator/uploads")
  .then((res) => setFiles(res.data))
  .catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <h2>Coordinator Bulk Uploads</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Coordinator Type</th>
            
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No uploads found
              </td>
            </tr>
          )}

          {files.map((f) => (
            <tr key={f._id}>
              <td>
                {f.ownerRole === "central_coordinator"
                  ? "Central Coordinator"
                  : "Incubation Coordinator"}
              </td>
              
              <td>
                <a
                  href={`http://localhost:5000/api/download/${f.file}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
