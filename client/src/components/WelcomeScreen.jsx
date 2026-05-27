import "../styles/welcomeScreen.css";

function WelcomeScreen({ visitorName }) {
  return (
    <div className="welcome-container">
      <div className="welcome-glow"></div>

      <div className="welcome-content">
        <div className="welcome-crown">♛</div>

        <h1>Thank You, {visitorName}</h1>

        <h2>Welcome to my world.</h2>

        <p>✨ Let me show you my work and creations ✨</p>
      </div>
    </div>
  );
}

export default WelcomeScreen;
