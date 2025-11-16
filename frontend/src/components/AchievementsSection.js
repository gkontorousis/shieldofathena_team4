import React from 'react';
import './AchievementsSection.css';

function AchievementsSection() {
  const achievements = [
    {
      month: 'January 2025',
      description: 'Provided safe housing assistance to 15 women and their families, and distributed 200 meals to those in need.',
      images: [
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&fit=crop',
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop',
      ],
      spending: {
        total: 5000,
        donors: 100,
        medianDonation: 55,
      },
    },
    {
      month: 'December 2024',
      description: 'Organized support groups and provided educational resources to 50 children and their mothers.',
      images: [
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&fit=crop',
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&fit=crop',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&fit=crop',
      ],
      spending: {
        total: 4500,
        donors: 85,
        medianDonation: 60,
      },
    },
    {
      month: 'November 2024',
      description: 'Emergency support and counseling services for 30 women and their families in crisis.',
      images: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&fit=crop',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop',
      ],
      spending: {
        total: 6000,
        donors: 120,
        medianDonation: 50,
      },
    },
  ];

  return (
    <section id="monthly-updates" className="achievements-section">
      <div className="achievements-content">
        <h2>Our Impact</h2>
        <p className="achievements-subtitle">
          See what we've accomplished together in the past months
        </p>
        {achievements.map((achievement, index) => (
          <div key={index} className="achievement-card">
            <h3>{achievement.month}</h3>
            <p className="achievement-description">{achievement.description}</p>
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AchievementsSection;

