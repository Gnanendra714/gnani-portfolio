import "../styles/projects.css";

import { motion } from "framer-motion";

import { FaGithub, FaExternalLinkAlt, FaTimes } from "react-icons/fa";

import { useEffect, useState } from "react";

import axios from "axios";

function Projects() {
  // =====================================================
  // PROJECTS DATA
  // =====================================================

  const [projectsData, setProjectsData] = useState([]);

  // =====================================================
  // SELECTED PROJECT FOR VIEW MORE
  // =====================================================

  const [selectedProject, setSelectedProject] = useState(null);

  // =====================================================
  // FETCH PROJECTS
  // =====================================================

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          "https://gnani-portfolio-server.onrender.com/api/projects",
        );

        setProjectsData(res.data);
      } catch (error) {
        console.log("Projects fetch error:", error);
      }
    };

    fetchProjects();
  }, []);

  // =====================================================
  // OPEN DESCRIPTION MODAL
  // =====================================================

  const openDescription = (project) => {
    setSelectedProject(project);
  };

  // =====================================================
  // CLOSE DESCRIPTION MODAL
  // =====================================================

  const closeDescription = () => {
    setSelectedProject(null);
  };

  return (
    <>
      {/* =====================================================
          PROJECTS SECTION
      ===================================================== */}

      <section className="projects-section" data-aos="fade-up" id="projects">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          viewport={{
            once: true,
          }}
        >
          {/* =================================================
              SUBTITLE
          ================================================= */}

          <span className="projects-subtitle">PORTFOLIO</span>

          {/* =================================================
              TITLE
          ================================================= */}

          <h1>Royal Creations</h1>

          {/* =================================================
              PROJECTS
          ================================================= */}

          <div className="projects-grid">
            {projectsData.map((project) => (
              <div className="project-card" key={project._id}>
                {/* =============================================
                    PROJECT TITLE
                ============================================= */}

                <h2>{project.title}</h2>

                {/* =============================================
                    PROJECT DESCRIPTION
                ============================================= */}

                <div className="project-description">
                  <p>{project.description}</p>

                  {project.description && project.description.length > 120 && (
                    <button
                      type="button"
                      className="view-more-btn"
                      onClick={() => openDescription(project)}
                    >
                      View More
                    </button>
                  )}
                </div>

                {/* =============================================
                    TECHNOLOGIES
                ============================================= */}

                <div className="tech-stack">
                  {project.tools?.map((item, index) => (
                    <span key={index}>{item}</span>
                  ))}
                </div>

                {/* =============================================
                    PROJECT LINKS
                ============================================= */}

                <div className="project-buttons">
                  {/* GITHUB */}

                  {project.github?.trim() && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button type="button">
                        <FaGithub />
                        GitHub
                      </button>
                    </a>
                  )}

                  {/* LIVE DEMO */}

                  {project.live?.trim() && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button type="button">
                        <FaExternalLinkAlt />
                        Live Demo
                      </button>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* =======================================================
          PROJECT DESCRIPTION MODAL
      ======================================================= */}

      {selectedProject && (
        <div className="project-modal-overlay" onClick={closeDescription}>
          <div
            className="project-modal"
            onClick={(event) => event.stopPropagation()}
          >
            {/* CLOSE BUTTON */}

            <button
              type="button"
              className="project-modal-close"
              onClick={closeDescription}
              aria-label="Close description"
            >
              <FaTimes />
            </button>

            {/* PROJECT TITLE */}

            <h2>{selectedProject.title}</h2>

            {/* FULL DESCRIPTION */}

            <p>{selectedProject.description}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Projects;
