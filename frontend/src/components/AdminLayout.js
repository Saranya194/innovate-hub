import AdminNavbar from "./adminNavbar";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-content">{children}</div>
    </div>
  );
}
