import "../styles/hero.css";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import axios from "axios";

function Hero() {
  const visitorName = localStorage.getItem("visitorName") || "GNANI";

  // HERO DATA

  const [heroData, setHeroData] = useState(null);

  // TYPING STATES

  const [text, setText] = useState("");

  const [index, setIndex] = useState(0);

  const [charIndex, setCharIndex] = useState(0);

  // FETCH HERO

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get(
          "https://gnani-portfolio-server.onrender.com/api/hero",
        );

        console.log(res.data);

        setHeroData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHero();
  }, []);

  // DATABASE ROLES

  const roles = heroData?.roles || [];

  // TYPING EFFECT

  useEffect(() => {
    if (roles.length === 0) return;

    const currentRole = roles[index];

    if (charIndex < currentRole.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + currentRole[charIndex]);

        setCharIndex((prev) => prev + 1);
      }, 80);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setText("");

        setCharIndex(0);

        setIndex((prev) => (prev + 1) % roles.length);
      }, 1800);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, index, roles]);

  // LOADING

  if (!heroData) return null;

  return (
    <section className="hero-section" id="hero">
      <div className="hero-glow"></div>

      <motion.div
        className="hero-content"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 1.2,
        }}
      >
        {/* CROWN */}

        <motion.div
          className="hero-crown"
          initial={{
            y: -20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 1,
          }}
        >
          ♛
        </motion.div>

        {/* WELCOME */}

        <motion.p
          className="hero-welcome"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.5,
          }}
        >
          WELCOME, {visitorName.toUpperCase()}
        </motion.p>

        {/* NAME */}

        <motion.h1
          className="hero-title"
          initial={{
            y: 40,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            delay: 0.8,
            duration: 1,
          }}
        >
          {heroData.name}
        </motion.h1>

        {/* TYPING TEXT */}

        <motion.div
          className="hero-typing"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.3,
          }}
        >
          {text}

          <span className="cursor">|</span>
        </motion.div>

        {/* DESCRIPTION */}

        <motion.p
          className="hero-description"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.8,
          }}
        >
          {heroData.description}
        </motion.p>
      </motion.div>
    </section>
  );
}

export default Hero;
