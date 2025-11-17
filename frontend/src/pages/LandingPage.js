import React, { useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";
import ReactPlayer from "react-player";
import "./LandingPage.css";
import PixelatedImage from "../components/PixelatedImage";
import AchievementsSection from "../components/AchievementsSection";
import UpcomingEventsSection from "../components/UpcomingEventsSection";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Mosaic from "../components/mosaic-components/js/Mosaic.js";

function LandingPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const navItems = [
    { label: t.mission, sectionId: "mission-section" },
    { label: t.mysteryImage, sectionId: "mystery-section" },
    { label: t.monthlyUpdates, sectionId: "monthly-updates" },
    { label: t.upcomingEvents, sectionId: "upcoming-events" },
  ];

  const playerConfig = useMemo(
    () => ({
      youtube: {
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          loop: 1,
          playlist: "-3sc4QkwaxE",
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
          modestbranding: 1,
        },
      },
    }),
    []
  );

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
          <p>{t.missionText}</p>
        </div>
      </section>

      {/* <section className="pixelated-section">
        <div className="pixelated-content">
          <h2>{t.uncoverMystery}</h2>
          <p>
            {t.mysteryText}
          </p>
          <PixelatedImage />
        </div>
      </section> */}

      <section className="mosaic-section">
        <div className="mosaic-content">
          <h2>Uncover the Mystery</h2>
          <p>
            Every $10 you donate will reveal a new pixel of this hidden image.
            Help us uncover the full picture of hope and change!
          </p>
          <Mosaic />
        </div>
      </section>

      <AchievementsSection />

      <UpcomingEventsSection />

      <Footer />
    </div>
  );
}

export default LandingPage;
