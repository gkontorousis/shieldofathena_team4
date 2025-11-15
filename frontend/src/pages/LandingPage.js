import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReactPlayer from 'react-player';
import './LandingPage.css';
import PixelatedImage from '../components/PixelatedImage';
import AchievementsSection from '../components/AchievementsSection';
import Logo from '../components/Logo';

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <div className="header-actions">
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

      <section className="mission-section">
        <div className="mission-content">
          <Logo />
          <h2>Our Mission</h2>
          <p>
            Shield of Athena is dedicated to providing support and assistance to
            individuals and families facing difficult circumstances. We believe
            that everyone deserves dignity, hope, and the opportunity to rebuild
            their lives. Through community support and compassionate action, we
            work to create lasting positive change.
          </p>
        </div>
      </section>

      <section className="pixelated-section">
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
    </div>
  );
}

export default LandingPage;

