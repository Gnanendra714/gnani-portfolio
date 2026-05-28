import "../styles/skills.css";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import axios from "axios";

function Skills() {
  // SKILLS DATA

  const [skillsData, setSkillsData] = useState([]);

  // FETCH SKILLS

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/skills");

        setSkillsData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSkills();
  }, []);

  // LOADING SAFETY

  if (!skillsData) return null;

  return (
    <section className="skills-section" data-aos="fade-up" id="skills">
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
        <span className="skills-subtitle">MY TECH STACK</span>

        <h1>Skills & Technologies</h1>

        <div className="skills-grid">
          {skillsData.map((group) => (
            <div className="skills-card" key={group._id}>
              <h2>{group.category}</h2>

              <div className="skills-list">
                {group.skills.map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Skills;
