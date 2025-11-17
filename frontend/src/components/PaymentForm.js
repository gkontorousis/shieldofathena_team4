import React, { useState } from 'react';
import './PaymentForm.css';

function PaymentForm({ 
  amount, 
  title = 'Complete Payment',
  description,
  onSubmit, 
  onCancel,
  loading = false,
  error = null,
  showBillingInfo = true,
  paymentType = 'donation' // 'donation' or 'event'
}) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [billingCountry, setBillingCountry] = useState('CA');

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const formatCvv = (value) => {
    return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').substring(0, 4);
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleCvvChange = (e) => {
    const formatted = formatCvv(e.target.value);
    setCvv(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      return;
    }
    if (!expiryDate || expiryDate.length !== 5) {
      return;
    }
    if (!cvv || cvv.length < 3) {
      return;
    }
    if (!cardholderName) {
      return;
    }

    const paymentData = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryDate,
      cvv,
      cardholderName,
      amount,
      billingInfo: showBillingInfo ? {
        address: billingAddress,
        city: billingCity,
        state: billingState,
        zip: billingZip,
        country: billingCountry,
      } : null,
      paymentType,
    };

    onSubmit(paymentData);
  };

  return (
    <div className="payment-form-container">
      <div className="payment-form-header">
        <h2>{title}</h2>
        {description && <p className="payment-description">{description}</p>}
        <div className="payment-amount-display">
          <span className="amount-label">Total Amount</span>
          <span className="amount-value">${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="payment-section">
          <h3>Card Information</h3>
          
          <div className="form-group">
            <label htmlFor="cardholderName">Cardholder Name</label>
            <input
              type="text"
              id="cardholderName"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength="5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                maxLength="4"
                required
              />
            </div>
          </div>
        </div>

        {showBillingInfo && (
          <div className="payment-section">
            <h3>Billing Address</h3>
            
            <div className="form-group">
              <label htmlFor="billingAddress">Street Address</label>
              <input
                type="text"
                id="billingAddress"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="billingCity">City</label>
                <input
                  type="text"
                  id="billingCity"
                  value={billingCity}
                  onChange={(e) => setBillingCity(e.target.value)}
                  placeholder="Montreal"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="billingState">Province/State</label>
                <input
                  type="text"
                  id="billingState"
                  value={billingState}
                  onChange={(e) => setBillingState(e.target.value)}
                  placeholder="Quebec"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="billingZip">Postal/Zip Code</label>
                <input
                  type="text"
                  id="billingZip"
                  value={billingZip}
                  onChange={(e) => setBillingZip(e.target.value)}
                  placeholder="H1A 1A1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="billingCountry">Country</label>
                <select
                  id="billingCountry"
                  value={billingCountry}
                  onChange={(e) => setBillingCountry(e.target.value)}
                  required
                >
                  <option value="CA">Canada</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="payment-error-message">
            {error}
          </div>
        )}

        <div className="payment-form-actions">
          {onCancel && (
            <button
              type="button"
              className="payment-cancel-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="payment-submit-btn"
            disabled={loading}
          >
            {loading ? 'Processing...' : paymentType === 'event' ? 'Complete Registration' : 'Complete Payment'}
          </button>
        </div>
      </form>

      <div className="payment-security">
        <p className="security-note">
          🔒 Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
}

export default PaymentForm;

