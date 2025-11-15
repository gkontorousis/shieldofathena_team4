import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ThankYouPage.css';

function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const donation = location.state?.donation;

  const shareMessage = `I just donated $${donation?.amount || 0} to Shield of Athena! ${donation?.description || ''} Join me in making a difference!`;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareMessage)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(window.location.origin)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`,
    instagram: 'https://www.instagram.com/', // Instagram doesn't support direct sharing via URL
  };

  const handleShare = (platform) => {
    if (platform === 'instagram') {
      alert('Please copy the message and share it on Instagram!');
      navigator.clipboard.writeText(shareMessage);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (!donation) {
    return (
      <div className="thank-you-page">
        <div className="thank-you-container">
          <h1>Thank You!</h1>
          <p>Your donation has been received.</p>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        <div className="thank-you-icon">✓</div>
        <h1>Thank You for Your Donation!</h1>
        <p className="thank-you-message">
          Your generosity is making a real difference in people's lives.
        </p>

        <div className="donation-summary">
          <h2>Donation Summary</h2>
          <div className="summary-item">
            <span className="summary-label">Amount:</span>
            <span className="summary-value">${donation.amount.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Type:</span>
            <span className="summary-value">
              {donation.recurring ? 'Recurring Monthly' : 'One-time'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Impact:</span>
            <span className="summary-value">{donation.description}</span>
          </div>
        </div>

        {!user && (
          <div className="create-account-prompt">
            <h3>Create an Account</h3>
            <p>
              Create an account to track your donations, see your impact, and
              join our donor community!
            </p>
            <button
              className="create-account-btn"
              onClick={() => navigate('/auth')}
            >
              Create Account
            </button>
          </div>
        )}

        <div className="share-section">
          <h3>Share Your Generosity</h3>
          <p>Help spread the word and inspire others to give!</p>
          <div className="social-share-buttons">
            <button
              className="share-btn facebook"
              onClick={() => handleShare('facebook')}
            >
              Facebook
            </button>
            <button
              className="share-btn twitter"
              onClick={() => handleShare('twitter')}
            >
              Twitter
            </button>
            <button
              className="share-btn linkedin"
              onClick={() => handleShare('linkedin')}
            >
              LinkedIn
            </button>
            <button
              className="share-btn instagram"
              onClick={() => handleShare('instagram')}
            >
              Instagram
            </button>
          </div>
        </div>

        <div className="action-buttons">
          <button className="home-btn" onClick={() => navigate('/')}>
            Return to Home
          </button>
          {user && (
            <button className="dashboard-btn" onClick={() => navigate('/dashboard')}>
              View Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;

