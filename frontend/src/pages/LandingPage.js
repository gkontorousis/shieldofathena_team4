import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReactPlayer from 'react-player';
import './LandingPage.css';
import PixelatedImage from '../components/PixelatedImage';
import AchievementsSection from '../components/AchievementsSection';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const languageDropdownRef = useRef(null);

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

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

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
              Mission
            </button>
            <button className="header-nav-btn" onClick={() => scrollToSection('mystery-section')}>
              Mystery Image
            </button>
            <button className="header-nav-btn" onClick={() => scrollToSection('monthly-updates')}>
              Monthly Updates
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
                        setSelectedLanguage(lang);
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
              {user ? 'Dashboard' : 'Log in / Register'}
            </button>
            <button className="header-donate-btn" onClick={() => navigate('/donate')}>
              Donate
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
              "I was struggling to make ends meet, and Shield of Athena helped me
              get back on my feet. Their support changed my life."
            </p>
          </div>
        </div>
      </section>

      <section id="mission-section" className="mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            The Shield is a charitable organization offering culturally and linguistically adapted education, professional support, intervention and prevention services to help women, their children, and ethnocultural communities break the cycle of violence. We provide a warm, respectful, and secure environment with equal access to services, acting with integrity and professionalism while emphasizing that violence is unacceptable regardless of ethnic, educational, religious, or socioeconomic background.
          </p>
        </div>
      </section>

      <section id="mystery-section" className="pixelated-section">
        <div className="pixelated-content">
          <h2>Uncover the Mystery</h2>
          <p>
            Every $10 you donate will reveal a new pixel of this hidden image.
            Help us uncover the full picture of hope and change!
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

