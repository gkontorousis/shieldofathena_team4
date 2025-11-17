import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';
import './AchievementsSection.css';

function AchievementsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const achievements = useMemo(() => [
    {
      month: t.october2025,
      description: t.achievement1Desc,
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
          { category: t.emergencyShelter, amount: 2000 },
          { category: t.foodMeals, amount: 1500 },
          { category: t.counselingServices, amount: 1200 },
          { category: t.transportation, amount: 800 },
        ],
      },
    },
    {
      month: t.september2025,
      description: t.achievement2Desc,
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
          { category: t.legalAssistance, amount: 1800 },
          { category: t.communityOutreach, amount: 1500 },
          { category: t.transportation, amount: 1000 },
          { category: t.volunteerExpenses, amount: 500 },
        ],
      },
    },
    {
      month: t.august2025,
      description: t.achievement3Desc,
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
          { category: t.foodMeals, amount: 2000 },
          { category: t.childcareServices, amount: 1500 },
          { category: t.educationalResources, amount: 1000 },
          { category: t.workshopMaterials, amount: 700 },
        ],
      },
    },
  ], [t]);

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
        <h2>{t.ourImpact}</h2>
        <p className="achievements-subtitle">
          {t.seeWhatWeAccomplished}
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
                          alt={language === 'fr' ? `Impact ${achievement.month}` : `${achievement.month} impact`}
                          className="achievement-image"
                        />
                      ))}
                    </div>
                    <div className="achievement-spending">
                      <p>
                        {t.weSpent} <strong>${achievement.spending.total.toLocaleString()}</strong> {t.onTheseActions}{' '}
                        <strong>{achievement.spending.donors} {t.donors}</strong> {t.withMedianDonation}{' '}
                        <strong>${achievement.spending.medianDonation}</strong>.
                      </p>
                      <div className="budget-breakdown">
                        <p className="budget-breakdown-title">
                          {t.spentThisMonth}{achievement.spending.total.toLocaleString()} {t.wentTowards}
                        </p>
                        <ul className="budget-breakdown-list">
                          {achievement.spending.breakdown.map((item, idx) => (
                            <li key={idx} className="budget-item">
                              <span className="budget-amount">${item.amount.toLocaleString()}</span>
                              <span className="budget-category">{t.for} {item.category}</span>
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
              aria-label={language === 'fr' ? `Aller à la diapositive ${index + 1}` : `Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default AchievementsSection;

