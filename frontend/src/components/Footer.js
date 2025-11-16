import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import './Footer.css';

function Footer() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <footer id="footer" className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">{t.emergencyResources}</h3>
          <div className="footer-item">
            <span className="footer-label">{t.police}</span>
            <a href="tel:911" className="footer-link">9-1-1</a>
          </div>
          <div className="footer-item">
            <span className="footer-label">{t.sosViolenceConjugale}</span>
            <div className="footer-links">
              <a href="tel:5148739010" className="footer-link">514-873-9010</a>
              <span className="footer-separator">{t.or}</span>
              <a href="tel:18003639010" className="footer-link">1-800-363-9010</a>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">{t.shieldOfAthenaOffices}</h3>
          <div className="footer-item">
            <span className="footer-label">{t.montrealOffice}</span>
            <div className="footer-links">
              <a href="tel:5142748117" className="footer-link">514-274-8117</a>
              <span className="footer-separator">{t.or}</span>
              <a href="tel:18772748117" className="footer-link">1-877-274-8117</a>
            </div>
          </div>
          <div className="footer-item">
            <span className="footer-label">{t.lavalOffice}</span>
            <a href="tel:4506886584" className="footer-link">450-688-6584</a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">{t.multilingualSexualViolenceHelpLines}</h3>
          <div className="footer-item">
            <span className="footer-label">{t.montreal}</span>
            <a href="tel:5142702900" className="footer-link">514-270-2900</a>
          </div>
          <div className="footer-item">
            <span className="footer-label">{t.laval}</span>
            <a href="tel:4506882117" className="footer-link">450-688-2117</a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">{t.contactUs}</h3>
          <div className="footer-item">
            <span className="footer-label">{t.emailLabel}</span>
            <a href="mailto:bouclierdathena@bellnet.ca" className="footer-link">bouclierdathena@bellnet.ca</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {t.allRightsReserved}</p>
      </div>
    </footer>
  );
}

export default Footer;

