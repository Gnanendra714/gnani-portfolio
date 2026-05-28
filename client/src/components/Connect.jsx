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

  // MESSAGE FORM DATA

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // HANDLE INPUTS

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/messages", formData);

      alert("Message Sent Successfully");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.log(error);

      alert("Failed To Send Message");
    }
  };

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

        {/* CONNECT CARDS */}

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

        {/* MESSAGE FORM */}

        <div className="message-section">
          <h2>Leave Us A Message</h2>

          <form className="message-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>

        {/* FOOTER */}

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
