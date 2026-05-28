import { useEffect, useState } from "react";

import API from "../services/api";

import { FaEdit, FaTrash, FaPlus, FaRocket } from "react-icons/fa";

import "../styles/journey.css";

const JourneyCMS = () => {
  const [journeys, setJourneys] = useState([]);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    year: "",
    title: "",
    shortDescription: "",
    detailedStory: "",
    technologies: "",
    achievements: "",
    futureGoal: "",
  });

  // FETCH

  const fetchJourneys = async () => {
    try {
      const res = await API.get("/journey");

      setJourneys(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJourneys();
  }, []);

  // HANDLE INPUT

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
        ...formData,

        technologies: formData.technologies
          .split(",")
          .map((item) => item.trim()),

        achievements: formData.achievements
          .split(",")
          .map((item) => item.trim()),
      };

      if (editId) {
        await API.put(`/journey/${editId}`, payload);
      } else {
        await API.post("/journey", payload);
      }

      setFormData({
        year: "",
        title: "",
        shortDescription: "",
        detailedStory: "",
        technologies: "",
        achievements: "",
        futureGoal: "",
      });

      setEditId(null);

      fetchJourneys();
    } catch (error) {
      console.log(error);
    }
  };

  // EDIT

  const handleEdit = (item) => {
    setEditId(item._id);

    setFormData({
      year: item.year,
      title: item.title,
      shortDescription: item.shortDescription,
      detailedStory: item.detailedStory,
      technologies: item.technologies.join(", "),
      achievements: item.achievements.join(", "),
      futureGoal: item.futureGoal,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE

  const handleDelete = async (id) => {
    try {
      await API.delete(`/journey/${id}`);

      fetchJourneys();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="journey-page">
      {/* HEADER */}

      <div className="journey-header">
        <p>CAREER TIMELINE CMS</p>

        <h1>Journey Management</h1>
      </div>

      {/* FORM */}

      <form className="journey-form" onSubmit={handleSubmit}>
        <div className="journey-row">
          <input
            type="text"
            name="year"
            placeholder="2025"
            value={formData.year}
            onChange={handleChange}
          />

          <input
            type="text"
            name="title"
            placeholder="Full Stack & AI Growth"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <textarea
          name="shortDescription"
          placeholder="Short Description"
          value={formData.shortDescription}
          onChange={handleChange}
        />

        <textarea
          name="detailedStory"
          placeholder="Detailed Story"
          value={formData.detailedStory}
          onChange={handleChange}
        />

        <input
          type="text"
          name="technologies"
          placeholder="React, Node.js, MongoDB"
          value={formData.technologies}
          onChange={handleChange}
        />

        <input
          type="text"
          name="achievements"
          placeholder="Built CMS, Learned MERN"
          value={formData.achievements}
          onChange={handleChange}
        />

        <textarea
          name="futureGoal"
          placeholder="Future Goal"
          value={formData.futureGoal}
          onChange={handleChange}
        />

        <div className="journey-buttons">
          <button type="submit" className="save-btn">
            <FaPlus />

            {editId ? "Update Journey" : "Add Journey"}
          </button>

          {editId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditId(null);

                setFormData({
                  year: "",
                  title: "",
                  shortDescription: "",
                  detailedStory: "",
                  technologies: "",
                  achievements: "",
                  futureGoal: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* TIMELINE */}

      <div className="timeline-container">
        {journeys.map((item) => (
          <div className="timeline-card" key={item._id}>
            <div className="timeline-year">{item.year}</div>

            <div className="timeline-content">
              <h2>{item.title}</h2>

              <p>{item.shortDescription}</p>

              <div className="timeline-tech">
                {item.technologies.map((tech, index) => (
                  <span key={index}>{tech}</span>
                ))}
              </div>

              <div className="timeline-actions">
                <button className="edit-btn" onClick={() => handleEdit(item)}>
                  <FaEdit />
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item._id)}
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyCMS;
