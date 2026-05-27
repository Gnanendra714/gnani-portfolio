import "../styles/navbar.css";

import { useState, useEffect } from "react";

import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");

      sections.forEach((section) => {
        const top = window.scrollY;

        const offset = section.offsetTop - 120;

        const height = section.offsetHeight;

        const id = section.getAttribute("id");

        if (top >= offset && top < offset + height) {
          setActiveSection(id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    {
      label: "Home",
      path: "#hero",
    },

    {
      label: "About",
      path: "#about",
    },

    {
      label: "Skills",
      path: "#skills",
    },

    {
      label: "Projects",
      path: "#projects",
    },

    {
      label: "Journey",
      path: "#journey",
    },

    {
      label: "Connect",
      path: "#connect",
    },
  ];

  return (
    <nav className="navbar">
      <a href="#hero" className="navbar-logo">
        ♛ GNANI
      </a>

      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        {navLinks.map((link, index) => (
          <li key={index}>
            <a
              href={link.path}
              className={
                activeSection === link.path.replace("#", "")
                  ? "active-link"
                  : ""
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
}

export default Navbar;
