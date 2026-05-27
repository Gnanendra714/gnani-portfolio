import "../styles/journey.css";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import axios from "axios";

function Journey() {
  // JOURNEY DATA

  const [timelineData, setTimelineData] = useState([]);

  // FETCH JOURNEY

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const res = await axios.get(
          "https://gnani-portfolio-server.onrender.com/api/journey",
        );

        setTimelineData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchJourney();
  }, []);

  return (
    <section className="timeline-section" id="journey">
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
        <div className="timeline-header">
          <span className="timeline-subtitle">TIMELINE</span>

          <h1>The Journey</h1>
        </div>

        <div className="timeline-container">
          {timelineData.map((item, index) => (
            <div
              className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
              key={item._id}
            >
              <div className="timeline-dot"></div>

              <div className="timeline-content">
                <span>{item.year}</span>

                <h2>{item.title}</h2>

                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Journey;
