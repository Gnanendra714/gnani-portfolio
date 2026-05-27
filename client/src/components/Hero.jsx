import "../styles/hero.css";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import axios from "axios";

function Hero() {
  const visitorName = localStorage.getItem("visitorName") || "GNANI";

  // HERO DATA FROM BACKEND

  const [heroData, setHeroData] = useState(null);

  // TYPING STATES

  const [text, setText] = useState("");

  const [index, setIndex] = useState(0);

  const [charIndex, setCharIndex] = useState(0);

  // FETCH HERO DATA

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get(
          "https://gnani-portfolio-server.onrender.com/api/hero",
        );

        setHeroData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHero();
  }, []);

  // TYPING TEXTS FROM DATABASE

  const roles = heroData?.typingTexts || [];

  // TYPING EFFECT

  useEffect(() => {
    const currentRole = roles[index] || "";

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

  // LOADING SAFETY

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
          {heroData.title}
        </motion.h1>

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
