import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import './UpcomingEventsSection.css';

function UpcomingEventsSection() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  // Sample events data - in a real app, this would come from Firestore
  const upcomingEvents = [
    {
      id: 1,
      title: 'Community Fundraising Dinner',
      date: 'March 15, 2025',
      time: '6:00 PM',
      location: 'Montreal',
      description: 'Join us for an evening of food, community, and fundraising.',
      image: '/dinner_table.jpg',
    },
    {
      id: 2,
      title: 'Spring Hiking Event',
      date: 'April 20, 2025',
      time: '9:00 AM',
      location: 'Mount Royal',
      description: 'A family-friendly hiking event to raise awareness and funds.',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&fit=crop',
    },
    {
      id: 3,
      title: 'Workshop: Empowering Women',
      date: 'May 10, 2025',
      time: '2:00 PM',
      location: 'Laval Office',
      description: 'Educational workshop focused on empowerment and support.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&fit=crop',
    },
  ];

  const handleViewAllEvents = () => {
    // Navigate to dashboard events section or a dedicated events page
    navigate('/dashboard');
  };

  return (
    <section id="upcoming-events" className="upcoming-events-section">
      <div className="upcoming-events-content">
        <h2>{t.upcomingEventsTitle}</h2>
        <p className="upcoming-events-subtitle">
          {t.upcomingEventsSubtitle}
        </p>
        
        <div className="events-grid">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image-container">
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-image"
                />
              </div>
              <div className="event-details">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-info">
                  <div className="event-info-item">
                    <span className="event-info-label">📅</span>
                    <span>{event.date}</span>
                  </div>
                  <div className="event-info-item">
                    <span className="event-info-label">🕐</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="event-info-item">
                    <span className="event-info-label">📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="event-description">{event.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-events-container">
          <button className="view-all-events-btn" onClick={handleViewAllEvents}>
            {t.viewAllEvents}
          </button>
        </div>
      </div>
    </section>
  );
}

export default UpcomingEventsSection;

