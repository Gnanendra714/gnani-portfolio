import { useState, useEffect } from "react";

import IntroGate from "../components/IntroGate";
import WelcomeScreen from "../components/WelcomeScreen";
import ReturningVisitor from "../components/ReturningVisitor";

import Navbar from "../components/Navbar";

import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Journey from "../components/Journey";
import Connect from "../components/Connect";

function Home() {
  const [visitorName, setVisitorName] = useState("");

  const [showIntro, setShowIntro] = useState(false);

  const [showWelcome, setShowWelcome] = useState(false);

  const [showReturning, setShowReturning] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("visitorName");

    // FIRST VISITOR

    if (!savedName) {
      setShowIntro(true);
    }

    // RETURNING VISITOR
    else {
      setVisitorName(savedName);

      setShowReturning(true);

      setTimeout(() => {
        setShowReturning(false);
      }, 3000);
    }
  }, []);

  // HANDLE NAME SUBMIT

  const handleNameSubmit = (name) => {
    localStorage.setItem("visitorName", name);

    setVisitorName(name);

    setShowIntro(false);

    setShowWelcome(true);

    setTimeout(() => {
      setShowWelcome(false);
    }, 2600);
  };

  // INTRO GATE

  if (showIntro) {
    return <IntroGate onSubmit={handleNameSubmit} />;
  }

  // FIRST VISIT WELCOME

  if (showWelcome) {
    return <WelcomeScreen visitorName={visitorName} />;
  }

  // RETURNING VISITOR SCREEN

  if (showReturning) {
    return <ReturningVisitor visitorName={visitorName} />;
  }

  // MAIN PORTFOLIO

  return (
    <>
      <Navbar />

      <Hero />

      <About />

      <Skills />

      <Projects />

      <Journey />

      <Connect />
    </>
  );
}

export default Home;
