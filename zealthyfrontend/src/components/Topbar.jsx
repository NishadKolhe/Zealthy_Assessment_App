import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Topbar.css";

export default function TopBar({
  title = "MiniEMR",
  navLabel = "Dashboard",
  navPath = "/",
  onLogout,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>

        <button
          className="topbar-dashboard-btn"
          onClick={() => navigate(navPath)}
        >
          {navLabel}
        </button>
      </div>

      <div className="topbar-right">
        <button className="topbar-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
