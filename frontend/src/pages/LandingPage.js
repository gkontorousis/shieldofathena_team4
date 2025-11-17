import React, {useMemo} from 'react';
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { translations } from '../translations/translations';
import ReactPlayer from 'react-player';
import './LandingPage.css';
import PixelatedImage from '../components/PixelatedImage';
import AchievementsSection from '../components/AchievementsSection';
import UpcomingEventsSection from '../components/UpcomingEventsSection';
import Header from '../components/Header';
import Footer from '../components/Footer';


function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const englishVideo = "https://youtu.be/-3sc4QkwaxE";
  const frenchVideo = "https://youtu.be/o5scm1xrxYA";
  const videoUrl = language === "fr" ? frenchVideo : englishVideo;

  const navItems = [
    { label: t.mission, sectionId: 'mission-section' },
    { label: t.mysteryImage, sectionId: 'mystery-section' },
    { label: t.monthlyUpdates, sectionId: 'monthly-updates' },
    { label: t.upcomingEvents, sectionId: 'upcoming-events' },
  ];

  const playerConfig = useMemo(() => ({
    youtube: {
      playerVars: { 
        autoplay: 1, 
        modestbranding: 1, 
        loop: 1, 
        playlist: '-3sc4QkwaxE',
        controls: 1,
        rel: 0,
        iv_load_policy: 3,
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin,
        showinfo: 0,
        fs: 0,
      },
      embedOptions: {
        modestbranding: 1
      }
    },
  }), []);

  return (
    <div className="landing-page">
      <Header navItems={navItems} />

      <section className="video-section">
        <div className="video-container">
          <ReactPlayer
            url={videoUrl}
            playing={true}
            loop={true}
            muted={true}
            controls={true}
            width="100%"
            height="100%"
            light={false}
            pip={false}
            stopOnUnmount={false}
            config={playerConfig}
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

        {user && (
          <div className="video-overlay-button">
          </div>
        )}
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
      
      <UpcomingEventsSection />
      
      <Footer />
    </div>
  );
}

export default LandingPage;

