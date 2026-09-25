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
  // FETCH ALL PROJECTS
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
  // FORMAT URL
  // =====================================================

  const formatUrl = (url) => {
    if (!url) return "";

    const cleanUrl = url.trim();

    if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
      return cleanUrl;
    }

    return `https://${cleanUrl}`;
  };

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
                {project.techStack?.map((item, index) => (
                  <span key={index}>{item}</span>
                ))}
              </div>

              {/* =================================================
                  PROJECT LINKS
              ================================================= */}

              <div className="project-buttons">
                {/* GITHUB LINK */}

                {project.githubLink && (
                  <a
                    href={formatUrl(project.githubLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-btn github-btn"
                  >
                    <FaGithub />
                    <span>GitHub</span>
                  </a>
                )}

                {/* LIVE DEMO LINK */}

                {project.liveLink && (
                  <a
                    href={formatUrl(project.liveLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-btn live-btn"
                  >
                    <FaExternalLinkAlt />
                    <span>Live Demo</span>
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
