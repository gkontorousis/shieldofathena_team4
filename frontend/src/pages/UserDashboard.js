import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { getUserDonations, getEvents, registerForEvent, getUserData } from '../services/firestore';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './UserDashboard.css';

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
    10: { image: 'https://images.unsplash.com/photo-1488521787991-6625b2ba0e01?w=200', text: t.mealForWomenAndChildren },
    25: { image: '/pic3.png', text: t.clothingForWomenAndChildren },
    50: { image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', text: t.weekOfGroceries },
    100: { image: 'https://images.unsplash.com/photo-1488521787991-6625b2ba0e01?w=200', text: t.utilityBills },
    250: { image: 'pic8.png', text: t.emergencyHousing },
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
      date: '2025-01-28',
      message: `"Because of your support, my children and I finally sleep without fear. It’s the first time we’ve felt this safe in years."`,
    },
    {
      date: '2025-01-20',
      message: `"Your help gave my daughter the supplies she needed for school. She comes home smiling every day now — thank you for giving her hope."`,
    },
    {
      date: '2025-01-12',
      message: `"The food assistance came at the perfect time. Knowing my kids will eat tonight brings me a peace I haven’t felt in a long while."`,
    },
  ];  

  return (
    <div className="user-dashboard">
      <Header navItems={[]} />
       <Header showDashboardNav={[
        { id: 'donation-history', label: t.yourDonationHistory },
        { id: 'community-events', label: t.fundraisingCommunityEvents },
        { id: 'personal-updates', label: t.updatesFromThoseWeHelped },
      ]}
    />
      <div className="dashboard-header">
        <h1>{t.welcome} {userData?.name || user?.displayName || t.user}!</h1>
        <div className="header-actions">
          <button className="donate-btn" onClick={() => navigate('/donate')}>
            {t.makeAnotherDonation}
          </button>
          <button 
            className="donate-btn" 
            onClick={() => navigate('/my-impact')}>
            {t.viewYourImpactSoFar || 'View Your Impact So Far'}
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Donation History Section */}
        <section className="dashboard-section" id="donation-history">
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
          <h2>Fundraising Community Events</h2>

          <div className="events-grid">
            {/* Past Event */}
            <div className="event-card">
              <h3>2025 Annual Lilac Gala</h3>
              <div className="event-details">
                <p><strong>Date & Time:</strong> November 29, 2025</p>
                <p><strong>Location:</strong> Downtown Banquet Hall</p>
                <p><strong>Description:</strong> Elegant dinner, silent auction, and raffle. Celebrating 34 years helping victims of family violence.</p>
                <p><strong>Status:</strong> Event completed</p>
              </div>
            </div>

            {/* Future Event - Full */}
            <div className="event-card">
              <h3>Winter Charity Hike</h3>
              <div className="event-details">
                <p><strong>Date & Time:</strong> December 15, 2025</p>
                <p><strong>Location:</strong> Maple Forest Trails</p>
                <p><strong>Description:</strong> Guided winter hike with hot chocolate at the summit.</p>
                <p><strong>Places Available:</strong> 0</p>
                <p><strong>Price:</strong> $20</p>
              </div>
              <button className="register-btn" disabled>
                Registration Full
              </button>
            </div>

            {/* Future Event - Open */}
            <div className="event-card">
              <h3>Spring Community Cleanup</h3>
              <div className="event-details">
                <p><strong>Date & Time:</strong> April 10, 2025</p>
                <p><strong>Location:</strong> City Park</p>
                <p><strong>Description:</strong> Volunteer cleanup of local park with refreshments provided.</p>
                <p><strong>Places Available:</strong> 20</p>
                <p><strong>Price:</strong> Free</p>
              </div>
              <button
                className="register-btn"
                onClick={() => navigate('/payment')}
              >
                Click here to register and pay
              </button>
            </div>

            {/* Another Future Event - Open */}
            <div className="event-card">
              <h3>Summer Garden Tour</h3>
              <div className="event-details">
                <p><strong>Date & Time:</strong> July 8, 2025</p>
                <p><strong>Location:</strong> Community Botanical Gardens</p>
                <p><strong>Description:</strong> Guided tour with refreshments and a silent auction.</p>
                <p><strong>Places Available:</strong> 10</p>
                <p><strong>Price:</strong> $15</p>
              </div>
              <button
                className="register-btn"
                onClick={() => navigate('/payment')}
              >
                Click here to register and pay
              </button>
            </div>
          </div>

          {/* Load More Button */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="register-btn" disabled>Load More</button>
          </div>
        </section>


        {/* Personal Updates Section */}
        <section className="dashboard-section" id="personal-updates">
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
      <Footer />
    </div>
  );
}

export default UserDashboard;

