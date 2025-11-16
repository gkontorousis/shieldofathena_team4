import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import Logo from './Logo';
import './Header.css';

function Header({ navItems = [] }) {
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
      // If element not found, try navigating to home page first
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const retryElement = document.getElementById(sectionId);
          if (retryElement) {
            retryElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      } else {
        setTimeout(() => {
          const retryElement = document.getElementById(sectionId);
          if (retryElement) {
            retryElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      }
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
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo">
          <Logo />
        </div>
        {navItems.length > 0 && (
          <nav className="header-nav">
            {navItems.map((item, index) => (
              <button
                key={index}
                className="header-nav-btn"
                onClick={() => {
                  if (item.sectionId) {
                    scrollToSection(item.sectionId);
                  } else if (item.path) {
                    navigate(item.path);
                  } else if (item.onClick) {
                    item.onClick();
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
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
  );
}

export default Header;

