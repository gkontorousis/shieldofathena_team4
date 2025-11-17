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
import { useState, useEffect } from 'react';
import { getEvents } from '../services/firestore';


function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const englishVideo = "https://youtu.be/-3sc4QkwaxE";
  const frenchVideo = "https://youtu.be/o5scm1xrxYA";
  const videoUrl = language === "fr" ? frenchVideo : englishVideo;
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await getEvents();
        setEvents(allEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);
  
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
      
      <section id="upcoming-events" className="upcoming-events-section">
  <h2>{t.upcomingEvents}</h2>
  <div className="events-grid">
    {events.length === 0 ? (
      <p>{language === 'fr' ? "Aucun événement à venir" : "No upcoming events"}</p>
    ) : (
      events
        .filter(e => e.date_time && e.date_time > new Date())
        .map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.theme || (language === 'fr' ? "Événement sans titre" : "Untitled Event")}</h3>
            <p>
              <strong>{language === 'fr' ? "Date & Heure" : "Date & Time"}:</strong>{" "}
              {event.date_time.toLocaleString(
                language === 'fr' ? 'fr-CA' : 'en-US',
                { dateStyle: 'medium', timeStyle: 'short' }
              )}
            </p>
            <p>
              <strong>{language === 'fr' ? "Lieu" : "Location"}:</strong>{" "}
              {event.location || (language === 'fr' ? "Lieu non disponible" : "Location not available")}
            </p>
            <p>
              <strong>{language === 'fr' ? "Prix" : "Price"}:</strong>{" "}
              {event.price != null ? `$${event.price}` : (language === 'fr' ? "Prix non disponible" : "Price not available")}
            </p>
          </div>
        ))
    )}
  </div>
</section>
      
      <Footer />
    </div>
  );
}

export default LandingPage;

