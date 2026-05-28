import { useEffect, useState } from "react";

import API from "../services/api";

import "../styles/homecms.css";

const HomeCMS = () => {
  const [formData, setFormData] = useState({
    name: "",

    roles: "",

    description: "",
  });

  // FETCH HERO

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await API.get("/hero");

      if (res.data) {
        setFormData({
          name: res.data.name || "",

          roles: res.data.roles?.join(", ") || "",

          description: res.data.description || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // INPUT CHANGE

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // UPDATE

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/hero", {
        ...formData,

        roles: formData.roles.split(",").map((role) => role.trim()),
      });

      alert("Home Updated");
    } catch (error) {
      console.log(error);
    }
  };

  // CANCEL

  const handleCancel = () => {
    fetchHero();
  };

  return (
    <div className="homecms-page">
      <div className="homecms-header">
        <p>HOME MANAGEMENT</p>

        <h1>Hero Section</h1>
      </div>

      <form className="homecms-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Main Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="roles"
          placeholder="Typing Roles (comma separated)"
          value={formData.roles}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="homecms-buttons">
          <button type="submit" className="update-btn">
            Update Home
          </button>

          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomeCMS;
