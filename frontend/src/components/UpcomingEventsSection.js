import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import { getEvents } from '../services/firestore';
import './UpcomingEventsSection.css';

function UpcomingEventsSection() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language] || translations.en;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        // Filter out fundraiser dinner events, but keep elegant dinner events
        const filteredData = data.filter(event => {
          const themeLower = (event.theme || '').toLowerCase();
          // Remove events that contain both "fundraiser" and "dinner", but keep elegant dinner events
          return !(themeLower.includes('fundraiser') && themeLower.includes('dinner'));
        });
        // Show only first 3 events
        setEvents(filteredData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleViewAllEvents = () => {
    navigate('/dashboard#community-events');
  };

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

  if (loading) {
    return (
      <section id="upcoming-events" className="upcoming-events-section">
        <div className="upcoming-events-content">
          <h2>{t.upcomingEventsTitle}</h2>
          <p className="upcoming-events-subtitle">{t.loadingEvents}</p>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section id="upcoming-events" className="upcoming-events-section">
        <div className="upcoming-events-content">
          <h2>{t.upcomingEventsTitle}</h2>
          <p className="upcoming-events-subtitle">{t.noUpcomingEvents}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="upcoming-events" className="upcoming-events-section">
      <div className="upcoming-events-content">
        <h2>{t.upcomingEventsTitle}</h2>
        <p className="upcoming-events-subtitle">
          {t.upcomingEventsSubtitle}
        </p>
        
        <div className="events-grid">
          {events.map((event) => {
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
            } else {
              eventDate = new Date();
            }

            const availablePlaces = event.places_available ?? 0;
            const isFull = availablePlaces <= 0;

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

