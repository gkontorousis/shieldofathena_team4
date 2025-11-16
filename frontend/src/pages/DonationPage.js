import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { createDonation } from '../services/firestore';
import './DonationPage.css';

function DonationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const donationAmounts = useMemo(() => [
    {
      amount: 10,
      description: t.donation10,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop',
    },
    {
      amount: 25,
      description: t.donation25,
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&fit=crop',
    },
    {
      amount: 50,
      description: t.donation50,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&fit=crop',
    },
    {
      amount: 100,
      description: t.donation100,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&fit=crop',
    },
    {
      amount: 250,
      description: t.donation250,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&fit=crop',
    },
    {
      amount: 500,
      description: t.donation500,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&fit=crop',
    },
  ], [t]);

  const handleDonate = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount <= 0) {
      setError(t.pleaseSelectValidAmount);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createDonation(user?.uid || null, amount, recurring);

      // Navigate to thank you page with donation details
      navigate('/thank-you', {
        state: {
          donation: {
            amount: amount,
            recurring: recurring,
            description: selectedAmount
              ? donationAmounts.find((d) => d.amount === selectedAmount)?.description
              : language === 'fr' ? `Un don de $${amount}` : `A donation of $${amount}`,
          },
        },
      });
    } catch (err) {
      setError(err.message || t.donationFailed);
      setLoading(false);
    }
  };

  return (
    <div className="donation-page">
      <div className="donation-container">
        <div className="donation-amounts">
          <h2>{t.chooseDonationAmount}</h2>
          <div className="amount-grid">
            {donationAmounts.map((item) => (
              <div
                key={item.amount}
                className={`amount-card ${selectedAmount === item.amount ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedAmount(item.amount);
                  setCustomAmount('');
                }}
              >
                <img
                  src={item.image}
                  alt={item.description}
                  className="amount-card-image"
                />
                <div className="amount-value">${item.amount}</div>
                <div className="amount-description">{item.description}</div>
              </div>
            ))}
          </div>

          <div className="custom-amount-section">
            <h3>{t.orEnterCustomAmount}</h3>
            <div className="custom-amount-input">
              <span>$</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder={t.enterAmount}
                min="1"
                step="0.01"
              />
            </div>
          </div>

          <div className="recurring-section">
            <label className="recurring-checkbox">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
              />
              <span>{t.makeRecurringMonthly}</span>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="donate-button"
            onClick={handleDonate}
            disabled={loading}
          >
            {loading ? t.processing : t.donateNow}
          </button>
        </div>

        {!user && (
          <div className="login-benefits">
            <h3>{t.benefitsOfCreatingAccount}</h3>
            <div className="benefit-item">
              <img
                src="/kids_drawing.jpg"
                alt="Child's drawing"
                className="benefit-image"
              />
              <p>
                <strong>{t.donationBenefit1}</strong>
              </p>
            </div>
            <div className="benefit-item">
              <img
                src="/dinner_table.jpg"
                alt="Donor community event"
                className="benefit-image"
              />
              <p>
                <strong>{t.donationBenefit2}</strong>
              </p>
            </div>
            <button
              className="create-account-btn"
              onClick={() => navigate('/auth')}
            >
              {t.createAccount}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DonationPage;

