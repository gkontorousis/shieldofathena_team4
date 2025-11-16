import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createDonation } from '../services/firestore';
import PaymentForm from '../components/PaymentForm';
import './DonationPage.css';

function DonationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const donationAmounts = [
    {
      amount: 10,
      description: 'A donation of $10 would buy a meal for women and children',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&fit=crop',
    },
    {
      amount: 25,
      description: 'A donation of $25 would buy clothing for women and children',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&fit=crop',
    },
    {
      amount: 50,
      description: 'A donation of $50 would provide a week of groceries for a family',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&fit=crop',
    },
    {
      amount: 100,
      description: 'A donation of $100 would help cover utility bills for a month',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&fit=crop',
    },
    {
      amount: 250,
      description: 'A donation of $250 would provide emergency housing assistance',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&fit=crop',
    },
    {
      amount: 500,
      description: 'A donation of $500 would support educational programs for children',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&fit=crop',
    },
  ];

  const handleDonate = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount <= 0) {
      setError('Please select or enter a valid donation amount');
      return;
    }

    setError('');
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (paymentData) => {
    setLoading(true);
    setError('');

    try {
      // TODO: Integrate with actual payment processor (Stripe, PayPal, etc.)
      // For now, we'll simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // After successful payment, create donation record
      await createDonation(user?.uid || null, paymentData.amount, recurring);

      // Navigate to thank you page with donation details
      const amount = selectedAmount || parseFloat(customAmount);
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
      setError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setError('');
  };

  const amount = selectedAmount || parseFloat(customAmount);
  const donationDescription = selectedAmount
    ? donationAmounts.find((d) => d.amount === selectedAmount)?.description
    : amount ? `A donation of $${amount}` : '';

  if (showPaymentForm && amount > 0) {
    return (
      <div className="donation-page">
        <div className="donation-container payment-container">
          <PaymentForm
            amount={amount}
            title="Complete Your Donation"
            description={donationDescription}
            onSubmit={handlePaymentSubmit}
            onCancel={handlePaymentCancel}
            loading={loading}
            error={error}
            showBillingInfo={true}
            paymentType="donation"
          />
        </div>
      </div>
    );
  }

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
                src="/kids_drawing.jpg"
                alt="Child's drawing"
                className="benefit-image"
              />
              <p>
                <strong>For a donation of at least $25</strong>, we will send you a
                drawing from a child helped by the organization.
              </p>
            </div>
            <div className="benefit-item">
              <img
                src="/dinner_table.jpg"
                alt="Donor community event"
                className="benefit-image"
              />
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
            disabled={loading || !amount || amount <= 0}
          >
            {loading ? 'Processing...' : 'Continue to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonationPage;

