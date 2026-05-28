import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/layout.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-section">
        <Navbar />

        <div className="main-content">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;
