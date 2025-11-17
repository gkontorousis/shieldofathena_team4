
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import PaymentForm from '../components/PaymentForm';
import { getUserDonations, getEvents, registerForEvent, getUserData } from '../services/firestore';
import Header from '../components/Header';
import './UserDashboard.css';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc,
  setDoc,
  updateDoc,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
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
  }, [user]);


  const handleEventRegister = async (eventId, eventPrice) => {
    if (!user) {
      alert(t.pleaseLogInToRegister);
      return;
    }
    setRegisteringEvent(eventId);
    try {
      await registerForEvent(user.uid, eventId, eventPrice);
      alert(t.successfullyRegistered);
      fetchEvents(); // Refresh events to update places available
      fetchDonations(); // Refresh donations to show the registration payment
    } catch (error) {
      alert(error.message || t.failedToRegister);
    } finally {
      setRegisteringEvent(null);
    }
  };

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  const donationExamples = useMemo(() => ({
    10: { image: 'https://images.unsplash.com/photo-1488521787991-6625b2ba0e01?w=200', text: t.mealForWomenAndChildren },
    25: { image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200', text: t.clothingForWomenAndChildren },
    50: { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', text: t.weekOfGroceries },
    100: { image: 'https://images.unsplash.com/photo-1488521787991-6625b2ba0e01?w=200', text: t.utilityBills },
    250: { image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200', text: t.emergencyHousing },
    500: { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', text: t.educationalPrograms },
    1000: { image: 'https://images.unsplash.com/photo-1488521787991-6625b2ba0e01?w=200', text: t.comprehensiveSupport },
  }), [t]);

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
      <Header navItems={[]} />
      <div className="dashboard-header">
        <h1>{t.welcome} {userData?.name || user?.displayName || t.user}!</h1>
        <div className="header-actions">
          <button className="donate-btn" onClick={() => navigate('/donate')}>
            {t.makeAnotherDonation}
          </button>
          <button 
            className="donate-btn" 
            onClick={() => navigate('/my-impact')}>
            {t.viewYourImpactSoFar}
          </button>
          <button className="logout-btn" onClick={() => {logout(); navigate('/')}}>
            {t.logout}
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Donation History Section */}
        <section className="dashboard-section">
          <h2>{t.yourDonationHistory}</h2>
          <div className="total-donated">
            <h3>{t.totalDonated} ${totalDonated.toLocaleString()}</h3>
          </div>
          <div className="donations-timeline">
            {donations.length === 0 ? (
              <p className="no-data">{t.noDonationsYet}</p>
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
                        {new Date(donation.datetime).toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-US')}
                      </p>
                      {donation.recurring && (
                        <span className="recurring-badge">{t.recurring}</span>
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

  <div className="events-grid">
    {events.map(event => {
      // Robust date parsing
      let eventDate = null;

      if (event.date_time) {
        // Firestore Timestamp
        if (typeof event.date_time.toDate === 'function') {
          eventDate = event.date_time.toDate();
        } else {
          // String or JS Date
          eventDate = new Date(event.date_time);
        }

        // If invalid date, fallback to current date (or any default)
       // if (isNaN(eventDate.getTime())) {
         // eventDate = new Date(); // or choose any default
       // }
      } else {
        // If date_time is missing entirely, fallback to current date
        eventDate = new Date(); // ensures something always renders
      }

      const availablePlaces = event.places_available ?? 0;
      const isFull = availablePlaces <= 0;

      return (
        <div key={event.id} className="event-card">
          <h3>{event.theme || "Untitled Event"}</h3>

          <div className="event-details">
            <p>
              <strong>Date & Time:</strong>{" "}
              {eventDate.toLocaleString(
                language === 'fr' ? 'fr-CA' : 'en-US',
                { dateStyle: 'medium', timeStyle: 'short' }
              )}
            </p>
            <p><strong>Location:</strong> {event.location || "Location not available"}</p>
            <p><strong>Places Available:</strong> {availablePlaces}</p>
            <p><strong>Price:</strong> {event.price != null ? `$${event.price}` : "Price not available"}</p>
          </div>

          {/* Registration Button */}
          {isFull ? (
            <button className="register-btn" disabled>
              Registration Full
            </button>
          ) : (
            <button
              className="register-btn"
              onClick={() =>
                navigate('/PaymentForm', {
                  state: {
                    amount: event.price,
                    title: event.theme,
                    description: `Register for ${event.theme}`,
                    paymentType: 'event',
                    eventId: event.id
                  }
                })
              }
            >
              Click here to register and pay
            </button>
          )}
        </div>
      );
    })}
  </div>

  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <button className="register-btn" disabled>
      Load More
    </button>
  </div>
</section>



        {/* Personal Updates Section */}
        <section className="dashboard-section">
          <h2>{t.updatesFromThoseWeHelped}</h2>
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


