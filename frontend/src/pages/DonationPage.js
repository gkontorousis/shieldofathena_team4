import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createDonation } from '../services/firestore';
import './DonationPage.css';

function DonationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const donationAmounts = [
    {
      amount: 10,
      description: 'A donation of $10 would buy a meal for a homeless person',
    },
    {
      amount: 25,
      description: 'A donation of $25 would buy a blanket for a homeless person',
    },
    {
      amount: 50,
      description: 'A donation of $50 would provide a week of groceries for a family',
    },
    {
      amount: 100,
      description: 'A donation of $100 would help cover utility bills for a month',
    },
    {
      amount: 250,
      description: 'A donation of $250 would provide emergency housing assistance',
    },
    {
      amount: 500,
      description: 'A donation of $500 would support educational programs for children',
    },
    {
      amount: 1000,
      description: 'A donation of $1000 would fund comprehensive support for a family',
    },
  ];

  const handleDonate = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount <= 0) {
      setError('Please select or enter a valid donation amount');
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
              : `A donation of $${amount}`,
          },
        },
      });
    } catch (err) {
      setError(err.message || 'Donation failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="donation-page">
      <div className="donation-container">
        <h1>Make a Donation</h1>
        <p className="donation-subtitle">
          Your contribution makes a real difference in people's lives
        </p>

        {!user && (
          <div className="login-benefits">
            <h3>Benefits of Creating an Account</h3>
            <div className="benefit-item">
              <img
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200"
                alt="Child's drawing"
                className="benefit-image"
              />
              <p>
                <strong>For a donation of at least $25</strong>, we will send you a
                drawing from a child helped by the organization.
              </p>
            </div>
            <div className="benefit-item">
              <p>
                <strong>Donor community / fundraising events</strong> where you can
                socialize and meet like-minded people (restaurant nights, hikes, etc.)
              </p>
            </div>
            <button
              className="create-account-btn"
              onClick={() => navigate('/auth')}
            >
              Create an Account
            </button>
          </div>
        )}

        <div className="donation-amounts">
          <h2>Choose Your Donation Amount</h2>
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
                <div className="amount-value">${item.amount}</div>
                <div className="amount-description">{item.description}</div>
              </div>
            ))}
          </div>

          <div className="custom-amount-section">
            <h3>Or enter a custom amount:</h3>
            <div className="custom-amount-input">
              <span>$</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="Enter amount"
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
              <span>Make this a recurring monthly donation</span>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="donate-button"
            onClick={handleDonate}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Donate Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonationPage;

