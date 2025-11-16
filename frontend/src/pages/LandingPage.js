import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import ReactPlayer from 'react-player';
import './LandingPage.css';
import PixelatedImage from '../components/PixelatedImage';
import AchievementsSection from '../components/AchievementsSection';
import Header from '../components/Header';
import Footer from '../components/Footer';


function LandingPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const navItems = [
    { label: t.mission, sectionId: 'mission-section' },
    { label: t.mysteryImage, sectionId: 'mystery-section' },
    { label: t.monthlyUpdates, sectionId: 'monthly-updates' },
  ];

  return (
    <div className="landing-page">
      <Header navItems={navItems} />

      <section className="video-section">
        <div className="video-container">
          <ReactPlayer
            url="https://youtu.be/-3sc4QkwaxE"
            playing={true}
            loop={true}
            muted={true}
            controls={true}
            width="100%"
            height="100%"
            config={{
              youtube: {
                playerVars: { autoplay: 1, modestbranding: 1, loop: 1, playlist: '-3sc4QkwaxE' },
              },
            }}
          />
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

