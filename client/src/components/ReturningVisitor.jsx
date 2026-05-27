import "../styles/returningVisitor.css";

import updatesData from "../utils/updatesData";

function ReturningVisitor({ visitorName }) {
  return (
    <div className="returning-container">
      <div className="returning-glow"></div>

      <div className="returning-content">
        <div className="returning-crown">♛</div>

        <h1>Welcome Back, {visitorName}</h1>

        <h2>The empire awaits your return.</h2>

        <p>Continue your journey.</p>

        <div className="updates-box">
          {updatesData.map((update) => (
            <div key={update.id} className="update-item">
              {update.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReturningVisitor;
