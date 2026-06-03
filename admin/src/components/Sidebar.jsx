import { useEffect, useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";

import API from "../services/api";

import {
  FaThLarge,
  FaEnvelope,
  FaHome,
  FaUser,
  FaRoad,
  FaFolderOpen,
  FaCode,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  // FETCH UNREAD COUNT

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await API.get("/messages");

        const unread = res.data.filter((msg) => !msg.isRead).length;

        setUnreadCount(unread);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // LOGOUT

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div>
        <h1 className="logo">Gnani Admin</h1>

        <ul className="nav-links">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaThLarge />
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/messages"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaEnvelope />

              <span>
                Messages
                {unreadCount > 0 && ` (${unreadCount})`}
              </span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaHome />
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaUser />
              About
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/journey"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaRoad />
              Journey
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/projects"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaFolderOpen />
              Projects
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/skills"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <FaCode />
              Skills
            </NavLink>
          </li>
        </ul>
      </div>

      <button className="sidebar-logout" onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
