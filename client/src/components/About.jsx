import "../styles/about.css";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import axios from "axios";

import { FaMicrochip, FaBrain, FaCode } from "react-icons/fa";

// ICON MAP

const iconMap = {
  FaMicrochip: FaMicrochip,

  FaBrain: FaBrain,

  FaCode: FaCode,
};

function About() {
  // ABOUT DATA

  const [aboutData, setAboutData] = useState(null);

  // FETCH ABOUT DATA

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(
          "https://gnani-portfolio-server.onrender.com/api/about",
        );

        setAboutData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAbout();
  }, []);

  // LOADING SAFETY

  if (!aboutData) return null;

  return (
    <section className="about-section" id="about">
      <div className="about-glow"></div>

      <motion.div
        className="about-content"
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
        <span className="about-subtitle">{aboutData.subtitle}</span>

        <h1>{aboutData.heading}</h1>

        <p className="about-description">{aboutData.description}</p>

        <div className="about-cards">
          {aboutData.cards.map((card, index) => {
            const Icon = iconMap[card.icon];

            return (
              <motion.div
                className="about-card"
                key={index}
                whileHover={{
                  y: -8,
                }}
              >
                <Icon className="about-icon" />

                <h2>{card.title}</h2>

                <p>{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

export default About;
