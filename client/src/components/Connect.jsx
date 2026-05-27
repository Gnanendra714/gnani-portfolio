import "../styles/connect.css";

import { motion } from "framer-motion";

import { FaGithub, FaLinkedin, FaYoutube, FaInstagram } from "react-icons/fa";

import { useEffect, useState } from "react";

import axios from "axios";

// ICON MAP

const iconMap = {
  FaGithub: FaGithub,

  FaLinkedin: FaLinkedin,

  FaYoutube: FaYoutube,

  FaInstagram: FaInstagram,
};

function Connect() {
  // CONNECT DATA

  const [connectData, setConnectData] = useState(null);

  // FETCH CONNECT DATA

  useEffect(() => {
    const fetchConnect = async () => {
      try {
        const res = await axios.get(
          "https://gnani-portfolio-server.onrender.com/api/connect",
        );

        setConnectData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchConnect();
  }, []);

  // LOADING SAFETY

  if (!connectData) return null;

  return (
    <section className="connect-section" data-aos="fade-up" id="connect">
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
        <span className="connect-subtitle">{connectData.subtitle}</span>

        <h1>{connectData.heading}</h1>

        <p className="connect-description">{connectData.description}</p>

        <div className="connect-grid">
          {connectData.cards.map((card, index) => {
            const Icon = iconMap[card.icon];

            return (
              <a
                href={card.link}
                target="_blank"
                rel="noreferrer"
                className="connect-card"
                key={index}
              >
                <Icon />

                <h2>{card.title}</h2>

                <p>{card.description}</p>
              </a>
            );
          })}
        </div>

        <div className="connect-footer">
          <div className="connect-footer-crown">♛</div>

          <div className="connect-footer-line"></div>

          <p>© 2026 GNANI • Royal Digital Empire</p>
        </div>
      </motion.div>
    </section>
  );
}

export default Connect;
