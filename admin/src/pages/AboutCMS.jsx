import { useEffect, useState } from "react";

import API from "../services/api";

import "../styles/aboutcms.css";

const AboutCMS = () => {
  const [formData, setFormData] = useState({
    subtitle: "ABOUT ME",

    heading: "",

    description: "",

    cards: [
      {
        icon: "FaMicrochip",
        title: "",
        description: "",
      },

      {
        icon: "FaCode",
        title: "",
        description: "",
      },
    ],
  });

  // FETCH CURRENT ABOUT DATA

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await API.get("/about");

      const data = Array.isArray(res.data)
        ? res.data.find((item) => item.isActive)
        : res.data;

      if (data) {
        setFormData({
          subtitle: data.subtitle || "ABOUT ME",

          heading: data.heading || "",

          description: data.description || "",

          cards:
            data.cards?.length > 0
              ? data.cards
              : [
                  {
                    icon: "FaMicrochip",
                    title: "",
                    description: "",
                  },

                  {
                    icon: "FaCode",
                    title: "",
                    description: "",
                  },
                ],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // TEXT CHANGE

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // CARD CHANGE

  const handleCardChange = (index, field, value) => {
    const updatedCards = [...formData.cards];

    updatedCards[index][field] = value;

    setFormData({
      ...formData,

      cards: updatedCards,
    });
  };

  // UPDATE ABOUT

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/about", formData);

      fetchAbout();

      alert("About Section Updated");
    } catch (error) {
      console.log(error);
    }
  };

  // CANCEL

  const handleCancel = () => {
    fetchAbout();
  };

  return (
    <div className="aboutcms-page">
      {/* HEADER */}

      <div className="aboutcms-header">
        <p>IDENTITY EVOLUTION SYSTEM</p>

        <h1>About Evolution</h1>
      </div>

      {/* MAIN LAYOUT */}

      <form className="aboutcms-layout" onSubmit={handleSubmit}>
        {/* LEFT */}

        <div className="aboutcms-left">
          <input
            type="text"
            name="heading"
            placeholder="Main Heading"
            value={formData.heading}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Main Description"
            value={formData.description}
            onChange={handleChange}
          />

          <div className="aboutcms-buttons">
            <button type="submit" className="update-btn">
              Update About
            </button>

            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>

        {/* RIGHT */}

        <div className="aboutcms-right">
          <div className="cards-preview-grid">
            {formData.cards.map((card, index) => (
              <div className="preview-card" key={index}>
                <select
                  value={card.icon}
                  onChange={(e) =>
                    handleCardChange(index, "icon", e.target.value)
                  }
                >
                  <option value="FaMicrochip">Embedded Icon</option>

                  <option value="FaCode">Code Icon</option>

                  <option value="FaBrain">AI Icon</option>
                </select>

                <input
                  type="text"
                  placeholder="Card Title"
                  value={card.title}
                  onChange={(e) =>
                    handleCardChange(index, "title", e.target.value)
                  }
                />

                <textarea
                  placeholder="Card Description"
                  value={card.description}
                  onChange={(e) =>
                    handleCardChange(index, "description", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AboutCMS;
