import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import ReactPlayer from 'react-player';
import './LandingPage.css';
import PixelatedImage from '../components/PixelatedImage';
import AchievementsSection from '../components/AchievementsSection';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef(null);
  const t = translations[language] || translations.en;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      setTimeout(() => {
        const retryElement = document.getElementById(sectionId);
        if (retryElement) {
          retryElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          console.error(`Element with id "${sectionId}" not found`);
        }
      }, 100);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'hy', name: 'Հայերեն' },
    { code: 'ru', name: 'Русский' },
    { code: 'ro', name: 'Română' },
    { code: 'el', name: 'Ελληνικά' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'fa', name: 'فارسی' },
    { code: 'ar', name: 'العربية' },
    { code: 'ur', name: 'اردو' },
  ];

  const selectedLanguage = languages.find(lang => lang.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <div className="header-logo">
            <Logo />
          </div>
          <nav className="header-nav">
            <button className="header-nav-btn" onClick={() => scrollToSection('mission-section')}>
              {t.mission}
            </button>
            <button className="header-nav-btn" onClick={() => scrollToSection('mystery-section')}>
              {t.mysteryImage}
            </button>
            <button className="header-nav-btn" onClick={() => scrollToSection('monthly-updates')}>
              {t.monthlyUpdates}
            </button>
          </nav>
          <div className="header-actions">
            <div className="language-dropdown" ref={languageDropdownRef}>
              <button
                className="language-dropdown-btn"
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              >
                <span>{selectedLanguage.name}</span>
                <span className="language-arrow">▼</span>
              </button>
              {languageDropdownOpen && (
                <div className="language-dropdown-menu">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`language-option ${selectedLanguage.code === lang.code ? 'active' : ''}`}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLanguageDropdownOpen(false);
                      }}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className="header-login-btn"
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
            >
              {user ? t.dashboard : t.logInRegister}
            </button>
            <button className="header-donate-btn" onClick={() => navigate('/donate')}>
              {t.donate}
            </button>
          </div>
        </div>
      </header>

      <section className="video-section">
        <div className="video-container">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=AvrB91Hr9kE"
            playing={true}
            controls={true}
            width="100%"
            height="100%"
            config={{
              youtube: {
                playerVars: { autoplay: 1, modestbranding: 1 },
              },
            }}
          />
          <div className="video-captions">
            <p>
              {t.testimonial}
            </p>
          </div>
        </div>
      </section>

      <section id="mission-section" className="mission-section">
        <div className="mission-content">
          <h2>{t.ourMission}</h2>
          <p>
            {t.missionText}
          </p>
        </div>
      </section>

      <section id="mystery-section" className="pixelated-section">
        <div className="pixelated-content">
          <h2>{t.uncoverMystery}</h2>
          <p>
            {t.mysteryText}
          </p>
          <PixelatedImage />
        </div>
      </section>

      <AchievementsSection />
      
      <Footer />
    </div>
  );
}

export default LandingPage;

