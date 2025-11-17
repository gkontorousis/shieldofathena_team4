import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import Header from '../components/Header';
import './ThankYouPage.css';

function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const donation = location.state?.donation;

  const shareMessage = `${t.justDonated}${donation?.amount || 0}${t.toShieldOfAthena}${donation?.description || ''}${t.joinMe}`;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareMessage)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(window.location.origin)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`,
    instagram: 'https://www.instagram.com/', // Instagram doesn't support direct sharing via URL
  };

  const handleShare = (platform) => {
    if (platform === 'instagram') {
      alert(t.copyMessage);
      navigator.clipboard.writeText(shareMessage);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (!donation) {
    return (
      <div className="thank-you-page">
        <Header navItems={[]} />
        <div className="thank-you-container">
          <h1>{t.thankYou}</h1>
          <p>{t.donationReceived}</p>
          <button onClick={() => navigate('/')}>{t.returnToHome}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="thank-you-page">
      <Header navItems={[]} />
      <div className="thank-you-container">
        <div className="thank-you-icon">✓</div>
        <h1>{t.thankYouForDonation}</h1>
        <p className="thank-you-message">
          {t.generosityMessage}
        </p>

        <div className="donation-summary">
          <h2>{t.donationSummary}</h2>
          <div className="summary-item">
            <span className="summary-label">{t.amount}</span>
            <span className="summary-value">${donation.amount.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t.type}</span>
            <span className="summary-value">
              {donation.recurring ? t.recurringMonthly : t.oneTime}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t.impact}</span>
            <span className="summary-value">{donation.description}</span>
          </div>
        </div>

        {!user && (
          <div className="create-account-prompt">
            <h3>{t.createAccountPrompt}</h3>
            <p>
              {t.createAccountMessage}
            </p>
            <button
              className="create-account-btn"
              onClick={() => navigate('/auth')}
            >
              {t.createAccountButton}
            </button>
          </div>
        )}

        <div className="share-section">
          <h3>{t.shareGenerosity}</h3>
          <p>{t.shareMessage}</p>
          <div className="social-share-buttons">
            <button
              className="share-btn facebook"
              onClick={() => handleShare('facebook')}
            >
              {t.facebook}
            </button>
            <button
              className="share-btn twitter"
              onClick={() => handleShare('twitter')}
            >
              {t.twitter}
            </button>
            <button
              className="share-btn linkedin"
              onClick={() => handleShare('linkedin')}
            >
              {t.linkedin}
            </button>
            <button
              className="share-btn instagram"
              onClick={() => handleShare('instagram')}
            >
              {t.instagram}
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button className="home-btn" onClick={() => navigate('/')}>
            {t.returnToHome}
          </button>
          {user && (
            <button className="dashboard-btn" onClick={() => navigate('/dashboard')}>
              {t.viewDashboard}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;

