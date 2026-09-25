import "../styles/projects.css";

import { motion } from "framer-motion";

import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

import { useEffect, useState } from "react";

import axios from "axios";

function Projects() {
  // =====================================================
  // PROJECTS DATA
  // =====================================================

  const [projectsData, setProjectsData] = useState([]);

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
  // FORMAT EXTERNAL URL
  // =====================================================

  const formatUrl = (url) => {
    if (!url) return "#";

    const cleanUrl = url.trim();

    if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
      return cleanUrl;
    }

    return `https://${cleanUrl}`;
  };

  // =====================================================
  // UI
  // =====================================================

  return (
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
        <span className="projects-subtitle">PORTFOLIO</span>

        <h1>Royal Creations</h1>

        <div className="projects-grid">
          {projectsData.map((project) => (
            <div className="project-card" key={project._id}>
              {/* =================================================
                  PROJECT TITLE
              ================================================= */}

              <h2>{project.title}</h2>

              {/* =================================================
                  PROJECT DESCRIPTION
              ================================================= */}

              <p>{project.description}</p>

              {/* =================================================
                  TECHNOLOGY STACK
              ================================================= */}

              <div className="tech-stack">
                {project.tools?.map((item, index) => (
                  <span key={index}>{item}</span>
                ))}
              </div>

              {/* =================================================
                  PROJECT BUTTONS
              ================================================= */}

              <div className="project-buttons">
                {/* GITHUB */}

                {project.githubLink && (
                  <a
                    href={formatUrl(project.githubLink)}
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

                {project.liveLink && (
                  <a
                    href={formatUrl(project.liveLink)}
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
  );
}

export default Projects;
