import React from "react";
import "./ThisMonthsImpact.css";

function ThisMonthsImpact({
  title = "This Month's Impact",
  label = "Shelter nights funded",
  nightsFunded = 63,
  goalNights = 100,
}) {
  const percentage = Math.min(100, Math.round((nightsFunded / goalNights) * 100));

  return (
    <section className="impact-progress-card">
      <div className="impact-progress-header">
        <h3>{title}</h3>
        <span className="impact-trend">📈</span>
      </div>

      <div className="impact-progress-row">
        <span className="impact-label">{label}</span>
        <span className="impact-value">
          {nightsFunded} / {goalNights}
        </span>
      </div>

      <div className="impact-progress-bar">
        <div
          className="impact-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="impact-goal-text">
        🎯 Community goal: {goalNights} nights by month end
      </p>
    </section>
  );
}

export default ThisMonthsImpact;
