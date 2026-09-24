import "../styles/navbar.css";

import { useState, useEffect } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [activeSection, setActiveSection] = useState("/");

  const location = useLocation();

  const navigate = useNavigate();

  const navLinks = [
    {
      label: "Home",
      path: "/",
      section: "hero",
    },
    {
      label: "About",
      path: "/about",
      section: "about",
    },
    {
      label: "Skills",
      path: "/skills",
      section: "skills",
    },
    {
      label: "Projects",
      path: "/projects",
      section: "projects",
    },
    {
      label: "Journey",
      path: "/journey",
      section: "journey",
    },
    {
      label: "Connect",
      path: "/connect",
      section: "connect",
    },
  ];

  /* =====================================================
     SCROLL TO SECTION
     ===================================================== */

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* =====================================================
     NAVIGATION CLICK
     ===================================================== */

  const handleNavigation = (event, path, section) => {
    event.preventDefault();

    setMenuOpen(false);

    /*
      Update the URL.
      This does NOT reload the page.
    */

    if (location.pathname !== path) {
      navigate(path);
    }

    /*
      Scroll to the selected section.
    */

    setTimeout(() => {
      scrollToSection(section);
    }, 50);
  };

  /* =====================================================
     INITIAL ACTIVE SECTION
     ===================================================== */

  useEffect(() => {
    setActiveSection(location.pathname);
  }, [location.pathname]);

  /* =====================================================
     DETECT SECTION WHILE SCROLLING
     ===================================================== */

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");

      let currentPath = "/";

      sections.forEach((section) => {
        const sectionId = section.getAttribute("id");

        const sectionTop = section.offsetTop - 180;

        const sectionBottom = sectionTop + section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
          const matchingLink = navLinks.find(
            (link) => link.section === sectionId,
          );

          if (matchingLink) {
            currentPath = matchingLink.path;
          }
        }
      });

      setActiveSection(currentPath);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* =================================================
          LOGO
          ================================================= */}

      <Link
        to="/"
        className="navbar-logo"
        onClick={(event) => handleNavigation(event, "/", "hero")}
      >
        ♛ GNANI
      </Link>

      {/* =================================================
          NAVIGATION
          ================================================= */}

      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={activeSection === link.path ? "active-link" : ""}
              onClick={(event) =>
                handleNavigation(event, link.path, link.section)
              }
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* =================================================
          MOBILE MENU
          ================================================= */}

      <div
        className="menu-icon"
        onClick={() => setMenuOpen((previous) => !previous)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
}

export default Navbar;
