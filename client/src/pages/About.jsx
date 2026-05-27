import { useEffect } from "react";

import Navbar from "../components/Navbar";

import AboutSection from "../components/About";

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      <AboutSection />
    </>
  );
}

export default About;
