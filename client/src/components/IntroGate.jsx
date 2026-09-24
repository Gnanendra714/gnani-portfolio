import { useState } from "react";

import axios from "axios";

import "../styles/introGate.css";

function IntroGate({ onSubmit }) {
  const [name, setName] = useState("");

  const handleContinue = async () => {
    if (name.trim() === "") return;

    try {
      // CHECK EXISTING VISITOR ID

      let visitorId = localStorage.getItem("visitorId");

      // CREATE NEW ID ONLY FIRST TIME

      if (!visitorId) {
        visitorId = "visitor_" + Math.random().toString(36).substring(2, 12);

        localStorage.setItem("visitorId", visitorId);
      }

      // DEVICE TYPE

      const device = /Mobi|Android/i.test(navigator.userAgent)
        ? "Mobile"
        : "Laptop/Desktop";

      // BROWSER INFO

      const browser = navigator.userAgent;

      // OPERATING SYSTEM

      const os = navigator.platform;

      // GET LOCATION + IP

      const response = await fetch("https://ipapi.co/json/");

      const data = await response.json();

      const ipAddress = data.ip;

      const country = data.country_name;

      const city = data.city;

      // SEND TO BACKEND

      await axios.post(
        "https://gnani-portfolio-server.onrender.com/api/visitors",
        {
          name,
          visitorId,
          device,
          browser,
          os,
          ipAddress,
          country,
          city,
        },
      );

      // SAVE NAME LOCALLY

      localStorage.setItem("visitorName", name);

      onSubmit(name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="intro-container">
      <div className="intro-glow"></div>

      <form
        className="intro-card"
        onSubmit={(e) => {
          e.preventDefault();

          handleContinue();
        }}
      >
        <div className="crown">♛</div>

        <h1>Welcome to the World of Gnani</h1>

        <p>What should I call you?</p>

        <div className="input-group">
          <label>YOUR NAME</label>

          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button type="submit">CONTINUE</button>
      </form>

      <div className="intro-footer">ROYAL DIGITAL EMPIRE</div>
    </div>
  );
}

export default IntroGate;
