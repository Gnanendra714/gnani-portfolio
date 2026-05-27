import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Journey from "./pages/Journey";
import Connect from "./pages/Connect";

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />

      <Route path="/about" element={<About />} />

      <Route path="/skills" element={<Skills />} />

      <Route path="/projects" element={<Projects />} />

      <Route path="/journey" element={<Journey />} />

      <Route path="/connect" element={<Connect />} />
    </Routes>
  );
}

export default App;
