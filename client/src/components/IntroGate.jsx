import { useState } from "react";

import axios from "axios";

import "../styles/introGate.css";

function IntroGate({ onSubmit }) {
  const [name, setName] = useState("");

  const handleContinue = async () => {
    if (name.trim() === "") return;

    try {
      // =====================================================
      // CHECK EXISTING VISITOR ID
      // =====================================================

      let visitorId = localStorage.getItem("visitorId");

      // =====================================================
      // CREATE NEW ID ONLY FIRST TIME
      // =====================================================

      if (!visitorId) {
        visitorId = "visitor_" + Math.random().toString(36).substring(2, 12);

        localStorage.setItem("visitorId", visitorId);
      }

      // =====================================================
      // DEVICE TYPE
      // =====================================================

      const device = /Mobi|Android/i.test(navigator.userAgent)
        ? "Mobile"
        : "Laptop/Desktop";

      // =====================================================
      // BROWSER INFO
      // =====================================================

      const browser = navigator.userAgent;

      // =====================================================
      // OPERATING SYSTEM
      // =====================================================

      const os = navigator.platform;

      // =====================================================
      // DEFAULT LOCATION + IP
      // =====================================================

      let ipAddress = "Unknown";
      let country = "Unknown";
      let city = "Unknown";

      // =====================================================
      // GET LOCATION + IP
      // =====================================================

      try {
        const response = await fetch("https://ipapi.co/json/");

        if (response.ok) {
          const data = await response.json();

          ipAddress = data.ip || "Unknown";
          country = data.country_name || "Unknown";
          city = data.city || "Unknown";
        } else {
          console.log(
            `Location API unavailable: ${response.status} ${response.statusText}`,
          );
        }
      } catch (locationError) {
        console.log("Location lookup failed:", locationError);
      }

      // =====================================================
      // SEND VISITOR DATA TO BACKEND
      // =====================================================

      await axios.post(
        "https://gnani-portfolio-server.onrender.com/api/visitors",
        {
          name: name.trim(),
          visitorId,
          device,
          browser,
          os,
          ipAddress,
          country,
          city,
        },
      );

      // =====================================================
      // SAVE VISITOR NAME LOCALLY
      // =====================================================

      localStorage.setItem("visitorName", name.trim());

      // =====================================================
      // ENTER PORTFOLIO
      // =====================================================

      onSubmit(name.trim());
    } catch (error) {
      console.log("Visitor submission failed:", error);
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
