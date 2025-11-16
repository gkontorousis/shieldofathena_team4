import React, { useState } from 'react';
import './AchievementsSection.css';

function AchievementsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const achievements = [
    {
      month: 'October 2024',
      description: 'Launched multilingual counseling services and provided emergency shelter to 20 women and their children fleeing domestic violence.',
      images: [
        '/pic1.png',
        '/pic2.png',
        '/pic3.png',
      ],
      spending: {
        total: 5500,
        donors: 95,
        medianDonation: 58,
        breakdown: [
          { category: 'Emergency Shelter', amount: 2000 },
          { category: 'Food & Meals', amount: 1500 },
          { category: 'Counseling Services', amount: 1200 },
          { category: 'Transportation', amount: 800 },
        ],
      },
    },
    {
      month: 'September 2024',
      description: 'Conducted community outreach programs and provided legal assistance to 25 women navigating protection orders and custody cases.',
      images: [
        '/pic4.png',
        '/pic5.png',
        '/pic6.png',
      ],
      spending: {
        total: 4800,
        donors: 88,
        medianDonation: 55,
        breakdown: [
          { category: 'Legal Assistance', amount: 1800 },
          { category: 'Community Outreach', amount: 1500 },
          { category: 'Transportation', amount: 1000 },
          { category: 'Volunteer Expenses', amount: 500 },
        ],
      },
    },
    {
      month: 'August 2024',
      description: 'Organized empowerment workshops and support groups for 40 women, while providing childcare services and educational resources for their children.',
      images: [
        '/pic7.png',
        '/pic8.png',
        '/pic9.png',
      ],
      spending: {
        total: 5200,
        donors: 102,
        medianDonation: 51,
        breakdown: [
          { category: 'Food & Meals', amount: 2000 },
          { category: 'Childcare Services', amount: 1500 },
          { category: 'Educational Resources', amount: 1000 },
          { category: 'Workshop Materials', amount: 700 },
        ],
      },
    },
  ];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? achievements.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === achievements.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section id="monthly-updates" className="achievements-section">
      <div className="achievements-content">
        <h2>Our Impact</h2>
        <p className="achievements-subtitle">
          See what we've accomplished together in the past months
        </p>
        
        <div className="carousel-container">
          <button className="carousel-btn carousel-btn-prev" onClick={goToPrevious}>
            ‹
          </button>
          
          <div className="carousel-wrapper">
            <div 
              className="carousel-track" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {achievements.map((achievement, index) => (
                <div key={index} className="carousel-slide">
                  <div className="achievement-card">
                    <h3>{achievement.month}</h3>
                    <div className="achievement-description">{achievement.description}</div>
                    <div className="achievement-images">
                      {achievement.images.map((img, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={img}
                          alt={`${achievement.month} impact`}
                          className="achievement-image"
                        />
                      ))}
                    </div>
                    <div className="achievement-spending">
                      <p>
                        We spent <strong>${achievement.spending.total.toLocaleString()}</strong> on
                        these actions, which were funded by{' '}
                        <strong>{achievement.spending.donors} donors</strong> with a median
                        donation of <strong>${achievement.spending.medianDonation}</strong>.
                      </p>
                      <div className="budget-breakdown">
                        <p className="budget-breakdown-title">
                          The ${achievement.spending.total.toLocaleString()} spent this month went towards:
                        </p>
                        <ul className="budget-breakdown-list">
                          {achievement.spending.breakdown.map((item, idx) => (
                            <li key={idx} className="budget-item">
                              <span className="budget-amount">${item.amount.toLocaleString()}</span>
                              <span className="budget-category">for {item.category}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-btn carousel-btn-next" onClick={goToNext}>
            ›
          </button>
        </div>

        <div className="carousel-dots">
          {achievements.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="load-more-container">
          <button className="load-more-btn">
            Load More
          </button>
        </div>
      </div>
    </section>
  );
}

export default AchievementsSection;

