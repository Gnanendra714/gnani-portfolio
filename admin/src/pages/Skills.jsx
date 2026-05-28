import { useEffect, useState } from "react";
import API from "../services/api";

import "../styles/skills.css";

const Skills = () => {
  const [skills, setSkills] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    skills: "",
  });

  const [editId, setEditId] = useState(null);

  // FETCH
  const fetchSkills = async () => {
    try {
      const res = await API.get("/skills");

      setSkills(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // INPUTS
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        category: formData.category,
        skills: formData.skills.split(",").map((item) => item.trim()),
      };

      if (editId) {
        await API.put(`/skills/${editId}`, payload);
      } else {
        await API.post("/skills", payload);
      }

      setFormData({
        category: "",
        skills: "",
      });

      setEditId(null);

      fetchSkills();
    } catch (error) {
      console.log(error);
    }
  };

  // EDIT
  const handleEdit = (item) => {
    setEditId(item._id);

    setFormData({
      category: item.category,
      skills: item.skills.join(", "),
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/skills/${id}`);

      fetchSkills();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="skills-page">
      <div className="skills-header">
        <p>TECH STACK CMS</p>

        <h1>Skills Management</h1>
      </div>

      {/* FORM */}

      <form className="skills-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="category"
          placeholder="Frontend / Backend / AI"
          value={formData.category}
          onChange={handleChange}
        />

        <input
          type="text"
          name="skills"
          placeholder="React, Node.js, MongoDB"
          value={formData.skills}
          onChange={handleChange}
        />

        <div className="skills-form-buttons">
          <button type="submit" className="skill-submit-btn">
            {editId ? "Update Skill" : "Add Skill"}
          </button>

          {editId && (
            <button
              type="button"
              className="skill-cancel-btn"
              onClick={() => {
                setEditId(null);

                setFormData({
                  category: "",
                  skills: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* SKILLS */}

      <div className="skills-grid">
        {skills.map((item) => (
          <div className="skill-card" key={item._id}>
            <h2>{item.category}</h2>

            <div className="skill-tags">
              {item.skills.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))}
            </div>

            <div className="skill-actions">
              <button className="edit-btn" onClick={() => handleEdit(item)}>
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
