import { useEffect, useState } from "react";
import API from "../services/api";
import { FaGithub, FaExternalLinkAlt, FaEdit, FaTrash } from "react-icons/fa";

import "../styles/projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tools: "",
    github: "",
    live: "",
  });

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");

      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // HANDLE INPUTS
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT PROJECT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const projectData = {
        ...formData,
        tools: formData.tools.split(",").map((tool) => tool.trim()),
      };

      if (editId) {
        await API.put(`/projects/${editId}`, projectData);

        alert("Project Updated");
      } else {
        await API.post("/projects", projectData);

        alert("Project Added");
      }

      fetchProjects();

      setFormData({
        title: "",
        description: "",
        tools: "",
        github: "",
        live: "",
      });

      setEditId(null);
    } catch (error) {
      console.log(error);
    }
  };

  // EDIT PROJECT
  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      tools: project.tools.join(", "),
      github: project.github,
      live: project.live,
    });

    setEditId(project._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE PROJECT
  const handleDelete = async (id) => {
    try {
      await API.delete(`/projects/${id}`);

      alert("Project Deleted");

      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects Management</h1>

        <p>
          Manage portfolio projects, tech stacks, GitHub repositories and live
          demos.
        </p>
      </div>

      {/* FORM */}

      <form className="project-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="tools"
            placeholder="React, Node.js, MongoDB"
            value={formData.tools}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <div className="form-row">
          <input
            type="text"
            name="github"
            placeholder="GitHub Link"
            value={formData.github}
            onChange={handleChange}
          />

          <input
            type="text"
            name="live"
            placeholder="Live Demo Link"
            value={formData.live}
            onChange={handleChange}
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            {editId ? "Update Project" : "Add Project"}
          </button>

          {editId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditId(null);

                setFormData({
                  title: "",
                  description: "",
                  tools: "",
                  github: "",
                  live: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* PROJECT GRID */}

      <div className="projects-grid">
        {projects.map((project) => (
          <div className="project-card" key={project._id}>
            <h2>{project.title}</h2>

            <p>{project.description}</p>

            {/* TOOLS */}

            <div className="project-tools">
              {project.tools.map((tool, index) => (
                <span key={index}>{tool}</span>
              ))}
            </div>

            {/* LINKS */}

            <div className="project-links">
              {project.github && (
                <a href={project.github} target="_blank">
                  <FaGithub />
                  GitHub
                </a>
              )}

              {project.live && (
                <a href={project.live} target="_blank">
                  <FaExternalLinkAlt />
                  Live Demo
                </a>
              )}
            </div>

            {/* ACTIONS */}

            <div className="project-actions">
              <button className="edit-btn" onClick={() => handleEdit(project)}>
                <FaEdit />
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(project._id)}
              >
                <FaTrash />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
