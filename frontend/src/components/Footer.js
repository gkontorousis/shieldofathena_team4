import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Emergency Resources</h3>
          <div className="footer-item">
            <span className="footer-label">Police</span>
            <a href="tel:911" className="footer-link">9-1-1</a>
          </div>
          <div className="footer-item">
            <span className="footer-label">S.O.S. Violence conjugale</span>
            <div className="footer-links">
              <a href="tel:5148739010" className="footer-link">514-873-9010</a>
              <span className="footer-separator">or</span>
              <a href="tel:18003639010" className="footer-link">1-800-363-9010</a>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Shield of Athena Offices</h3>
          <div className="footer-item">
            <span className="footer-label">Montreal Office</span>
            <div className="footer-links">
              <a href="tel:5142748117" className="footer-link">514-274-8117</a>
              <span className="footer-separator">or</span>
              <a href="tel:18772748117" className="footer-link">1-877-274-8117</a>
            </div>
          </div>
          <div className="footer-item">
            <span className="footer-label">Laval Office</span>
            <a href="tel:4506886584" className="footer-link">450-688-6584</a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Multilingual Sexual Violence Help Lines</h3>
          <div className="footer-item">
            <span className="footer-label">Montreal</span>
            <a href="tel:5142702900" className="footer-link">514-270-2900</a>
          </div>
          <div className="footer-item">
            <span className="footer-label">Laval</span>
            <a href="tel:4506882117" className="footer-link">450-688-2117</a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <div className="footer-item">
            <span className="footer-label">Email</span>
            <a href="mailto:bouclierdathena@bellnet.ca" className="footer-link">bouclierdathena@bellnet.ca</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Shield of Athena. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

