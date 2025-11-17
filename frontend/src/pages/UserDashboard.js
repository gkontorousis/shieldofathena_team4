
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
  const { user } = useAuth();
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
    10: { image: '/pic1.png', text: t.mealForWomenAndChildren },
    25: { image: '/pic2.png', text: t.clothingForWomenAndChildren },
    50: { image: '/pic3.png', text: t.weekOfGroceries },
    100: { image: '/pic4.png', text: t.utilityBills },
    250: { image: '/pic5.png', text: t.emergencyHousing },
    500: { image: '/pic6.png', text: t.educationalPrograms },
    1000: { image: '/pic7.png', text: t.comprehensiveSupport },
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

  const personalUpdates = useMemo(() => [
    {
      date: '2023-11-15',
      message: t.updateMessage1,
    },
    {
      date: '2023-11-10',
      message: t.updateMessage2,
    },
    {
      date: '2023-11-05',
      message: t.updateMessage3,
    },
  ], [t]);

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
<section className="dashboard-section" id="community-events">
  <h2>{t.fundraisingCommunityEvents}</h2>

  <div className="events-grid">
    {events.filter(event => {
      const themeLower = (event.theme || '').toLowerCase();
      // Remove events that contain both "fundraiser" and "dinner", but keep elegant dinner events
      return !(themeLower.includes('fundraiser') && themeLower.includes('dinner'));
    }).map(event => {
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

      // Get event image based on theme or use default
      const getEventImage = (theme) => {
        const themeLower = (theme || '').toLowerCase();
        if (themeLower.includes('cleanup') || themeLower.includes('spring cleanup')) {
          return '/cleanup.avif';
        } else if (themeLower.includes('dinner') || themeLower.includes('gala') || themeLower.includes('fundraising')) {
          return '/dinner_table.jpg';
        } else if (themeLower.includes('hiking') || themeLower.includes('outdoor') || themeLower.includes('walk')) {
          return 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop';
        } else if (themeLower.includes('workshop') || themeLower.includes('empower') || themeLower.includes('education')) {
          return 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop';
        }
        return 'https://images.unsplash.com/photo-1533174072545-7a0b44013246?w=600&h=400&fit=crop';
      };

      return (
        <div key={event.id} className="event-card">
          <div className="event-image-container">
            <img
              src={getEventImage((language === 'fr' && event.theme_fr) ? event.theme_fr : event.theme)}
              alt={(language === 'fr' && event.theme_fr) ? event.theme_fr : (event.theme || t.event)}
              className="event-image"
            />
          </div>
          <div className="event-card-content">
            <h3>{(language === 'fr' && event.theme_fr) ? event.theme_fr : (event.theme || t.untitledEvent)}</h3>

            <div className="event-details">
              <div className="event-info-item">
                <span className="event-info-label">📅</span>
                <span>
                  {eventDate.toLocaleString(
                    language === 'fr' ? 'fr-CA' : 'en-US',
                    { dateStyle: 'medium', timeStyle: 'short' }
                  )}
                </span>
              </div>
              <div className="event-info-item">
                <span className="event-info-label">📍</span>
                <span>{(language === 'fr' && event.location_fr) ? event.location_fr : (event.location || t.locationNotAvailable)}</span>
              </div>
              <div className="event-info-item">
                <span className="event-info-label">👥</span>
                <span>{t.placesAvailable} {availablePlaces}</span>
              </div>
              <div className="event-info-item">
                <span className="event-info-label">💰</span>
                <span>{event.price != null ? `$${event.price}` : t.priceNotAvailable}</span>
              </div>
            </div>
          </div>

          {/* Registration Button */}
          <div style={{ padding: '0 30px 30px 30px' }}>
            {isFull ? (
              <button className="register-btn" disabled>
                {t.registrationFull}
              </button>
            ) : (
              <button
                className="register-btn"
                onClick={() =>
                  navigate('/PaymentForm', {
                    state: {
                      amount: event.price,
                      title: (language === 'fr' && event.theme_fr) ? event.theme_fr : event.theme,
                      description: language === 'fr' 
                        ? `S'inscrire à ${(event.theme_fr || event.theme)}` 
                        : `Register for ${event.theme}`,
                      paymentType: 'event',
                      eventId: event.id
                    }
                  })
                }
              >
                {t.clickToRegister}
              </button>
            )}
          </div>
        </div>
      );
    })}
  </div>

  <div style={{ textAlign: "center", marginTop: "20px" }}>
    <button className="register-btn" disabled>
      {t.loadMore}
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


