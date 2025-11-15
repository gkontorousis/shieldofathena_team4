import React from 'react';
import './Logo.css';

function Logo() {
  // Replace this path with your actual logo image path
  // You can place the logo in: frontend/public/logo.png or frontend/src/assets/logo.png
  const logoPath = '/logo.png'; // Update this path to match where you place the logo file
  
  return (
    <div className="logo-container">
      <img 
        src={logoPath} 
        alt="Shield of Athena Logo" 
        className="logo-image"
        onError={(e) => {
          // Fallback if image doesn't exist - show text logo
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="logo-text-fallback" style={{ display: 'none' }}>
        <div className="logo-line-1">BOUCLIER D'ATHÉNA</div>
        <div className="logo-line-2">
          <span className="bold-text">SHIELD</span>
          <span className="small-text"> of </span>
          <span className="bold-text">ATHENA</span>
        </div>
        <div className="logo-line-3">SERVICES FAMILIAUX | FAMILY SERVICES</div>
      </div>
    </div>
  );
}

export default Logo;
