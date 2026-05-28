import "../styles/projects.css";

import { motion } from "framer-motion";

import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

import { useEffect, useState } from "react";

import axios from "axios";

function Projects() {
  // PROJECTS DATA

  const [projectsData, setProjectsData] = useState([]);

  // FETCH PROJECTS

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          "https://gnani-portfolio-server.onrender.com/api/projects",
        );

        setProjectsData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProjects();
  }, []);

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
              <h2>{project.title}</h2>

              <p>{project.description}</p>

              <div className="tech-stack">
                {project.tools?.map((item, index) => (
                  <span key={index}>{item}</span>
                ))}
              </div>

              <div className="project-buttons">
                <a href={project.githubLink} target="_blank">
                  <button>
                    <FaGithub />
                    GitHub
                  </button>
                </a>

                <a href={project.liveLink} target="_blank">
                  <button>
                    <FaExternalLinkAlt />
                    Live Demo
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Projects;
