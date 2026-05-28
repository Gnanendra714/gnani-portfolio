import "../styles/journey.css";

import { motion, AnimatePresence } from "framer-motion";

import { useEffect, useState } from "react";

import axios from "axios";

function Journey() {
  const [timelineData, setTimelineData] = useState([]);

  const [selectedJourney, setSelectedJourney] = useState(null);

  // FETCH DATA

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
      <div className="timeline-header">
        <span className="timeline-subtitle">TIMELINE</span>

        <h1>The Journey</h1>
      </div>

      {/* TIMELINE */}

      <div className="timeline-container">
        {timelineData.map((item, index) => (
          <motion.div
            key={item._id}
            className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
            }}
            viewport={{
              once: true,
            }}
            onClick={() => setSelectedJourney(item)}
          >
            {/* DOT */}

            <div className="timeline-dot"></div>

            {/* CARD */}

            <div className="timeline-content">
              <span className="timeline-year">{item.year}</span>

              <h2>{item.title}</h2>

              <p>{item.shortDescription}</p>

              {item.technologies?.length > 0 && (
                <div className="timeline-tech">
                  {item.technologies.map((tech, index) => (
                    <span key={index}>{tech}</span>
                  ))}
                </div>
              )}

              <div className="timeline-readmore">Click to explore →</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL */}

      <AnimatePresence>
        {selectedJourney && (
          <motion.div
            className="journey-modal-overlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => setSelectedJourney(null)}
          >
            <motion.div
              className="journey-modal"
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              transition={{
                duration: 0.35,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE */}

              <button
                className="modal-close"
                onClick={() => setSelectedJourney(null)}
              >
                ✕
              </button>

              {/* YEAR */}

              <span className="modal-year">{selectedJourney.year}</span>

              {/* TITLE */}

              <h1 className="modal-title">{selectedJourney.title}</h1>

              {/* DESCRIPTION */}

              <p className="modal-description">
                {selectedJourney.shortDescription}
              </p>

              {/* STORY */}

              <div className="modal-section">
                <h3>The Story</h3>

                <p className="modal-story">{selectedJourney.detailedStory}</p>
              </div>

              {/* TECHNOLOGIES */}

              {selectedJourney.technologies?.length > 0 && (
                <div className="modal-section">
                  <h3>Technologies</h3>

                  <div className="modal-tags">
                    {selectedJourney.technologies.map((tech, index) => (
                      <span key={index}>{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ACHIEVEMENTS */}

              {selectedJourney.achievements?.length > 0 && (
                <div className="modal-section">
                  <h3>Achievements</h3>

                  <ul className="achievement-list">
                    {selectedJourney.achievements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* FUTURE GOAL */}

              {selectedJourney.futureGoal && (
                <div className="modal-section">
                  <h3>Future Vision</h3>

                  <p className="future-goal">{selectedJourney.futureGoal}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Journey;
