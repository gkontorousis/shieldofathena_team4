import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserDonations, getEvents, registerForEvent, getUserData } from '../services/firestore';
import './UserDashboard.css';

function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [events, setEvents] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registeringEvent, setRegisteringEvent] = useState(null);

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getUserData(user.uid);
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [user]);

  const fetchDonations = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getUserDonations(user.uid);
      setDonations(data);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  }, [user]);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchDonations();
      fetchEvents();
    }
  }, [user, fetchUserData, fetchDonations, fetchEvents]);


  const handleEventRegister = async (eventId, eventPrice) => {
    if (!user) {
      alert('Please log in to register for events');
      return;
    }
    setRegisteringEvent(eventId);
    try {
      await registerForEvent(user.uid, eventId, eventPrice);
      alert('Successfully registered for the event!');
      fetchEvents(); // Refresh events to update places available
      fetchDonations(); // Refresh donations to show the registration payment
    } catch (error) {
      alert(error.message || 'Failed to register for event');
    } finally {
      setRegisteringEvent(null);
    }
  };

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  const donationExamples = {
    10: { image: 'https://images.unsplash.com/photo-1488521787991-6625b2ba0e01?w=200', text: 'Meal for a homeless person' },
    25: { image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200', text: 'Blanket for a homeless person' },
    50: { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', text: 'Week of groceries for a family' },
    100: { image: 'https://images.unsplash.com/photo-1488521787991-6625b2ba0e01?w=200', text: 'Utility bills for a month' },
    250: { image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200', text: 'Emergency housing assistance' },
    500: { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', text: 'Educational programs for children' },
    1000: { image: 'https://images.unsplash.com/photo-1488521787991-6625b2ba0e01?w=200', text: 'Comprehensive family support' },
  };

  const getDonationExample = (amount) => {
    const keys = Object.keys(donationExamples).map(Number).sort((a, b) => b - a);
    for (const key of keys) {
      if (amount >= key) {
        return donationExamples[key];
      }
    }
    return donationExamples[10];
  };

  const personalUpdates = [
    {
      date: '2023-11-15',
      message: 'Thank you to all our donors! Your support helped us provide housing for 5 families this month. One family shared: "We finally have a safe place to call home. Thank you for giving us hope."',
    },
    {
      date: '2023-11-10',
      message: 'The children in our program are thriving! Thanks to your donations, we were able to provide school supplies and tutoring. One child said: "I love learning now! Thank you for helping me."',
    },
    {
      date: '2023-11-05',
      message: 'Emergency food assistance reached 50 families this week. A recipient shared: "This food means my children won\'t go to bed hungry. We are so grateful."',
    },
  ];

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {userData?.name || user?.displayName || 'User'}!</h1>
        <div className="header-actions">
          <button className="donate-btn" onClick={() => navigate('/donate')}>
            Make Another Donation
          </button>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Donation History Section */}
        <section className="dashboard-section">
          <h2>Your Donation History</h2>
          <div className="total-donated">
            <h3>Total Donated: ${totalDonated.toLocaleString()}</h3>
          </div>
          <div className="donations-timeline">
            {donations.length === 0 ? (
              <p className="no-data">No donations yet. Make your first donation!</p>
            ) : (
              donations.map((donation) => {
                const example = getDonationExample(donation.amount);
                return (
                  <div key={donation.id} className="donation-item">
                    <div className="donation-visual">
                      <img src={example.image} alt={example.text} />
                      <div className="donation-amount">${donation.amount}</div>
                    </div>
                    <div className="donation-details">
                      <p className="donation-impact">{example.text}</p>
                      <p className="donation-date">
                        {new Date(donation.datetime).toLocaleDateString()}
                      </p>
                      {donation.recurring && (
                        <span className="recurring-badge">Recurring</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Events Section */}
        <section className="dashboard-section">
          <h2>Fundraising Community Events</h2>
          {loading ? (
            <p>Loading events...</p>
          ) : events.length === 0 ? (
            <p className="no-data">No upcoming events at this time.</p>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event.id} className="event-card">
                  <h3>{event.theme}</h3>
                  <div className="event-details">
                    <p>
                      <strong>Location:</strong> {event.location}
                    </p>
                    <p>
                      <strong>Date & Time:</strong>{' '}
                      {new Date(event.date_time).toLocaleString()}
                    </p>
                    <p>
                      <strong>Places Available:</strong> {event.places_available}
                    </p>
                    <p>
                      <strong>Price:</strong> ${event.price}
                    </p>
                  </div>
                  <button
                    className="register-btn"
                    onClick={() => handleEventRegister(event.id, event.price)}
                    disabled={registeringEvent === event.id || event.places_available === 0}
                  >
                    {registeringEvent === event.id
                      ? 'Registering...'
                      : event.places_available === 0
                      ? 'Sold Out'
                      : 'Register Now'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Personal Updates Section */}
        <section className="dashboard-section">
          <h2>Updates from Those We've Helped</h2>
          <div className="updates-list">
            {personalUpdates.map((update, index) => (
              <div key={index} className="update-card">
                <div className="update-date">{update.date}</div>
                <p className="update-message">{update.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;

