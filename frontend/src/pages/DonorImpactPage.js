import React, { useState, useEffect } from "react";
import "./DonorImpactPage.css";
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import Header from '../components/Header';

const COSTS = {
  shelterNight: 35,
  meal: 5,
  crisisSession: 50,
  therapyHour: 75,
};

function DonorImpactPage({ totalDonation = 300 }) {
  const navigate = useNavigate();
  const shelterNights = Math.floor(totalDonation / COSTS.shelterNight);
  const meals = Math.floor(totalDonation / COSTS.meal);
  const crisisSessions = Math.floor(totalDonation / COSTS.crisisSession);
  const therapyHours = Math.floor(totalDonation / COSTS.therapyHour);

  const impactItems = [
    {
      id: "shelter",
      title: "Shelter Nights",
      value: shelterNights,
      description:
        "Nights of safety in a protected environment, giving families peace and dignity.",
      image:
        "https://imageio.forbes.com/specials-images/imageserve/1208448710/GERMANY-HEALTH-VIRUS/960x0.jpg?format=jpg&width=960",
      alt: "A safe and warm shelter room",
    },
    {
      id: "meals",
      title: "Meals Shared",
      value: meals,
      description:
        "Nutritious meals that bring comfort and remind survivors they are not alone.",
      image:
        "https://fortune.com/img-assets/wp-content/uploads/2022/10/GettyImages-1355162946-e1665508487320.jpeg",
      alt: "Warm meal served to someone in need",
    },
    {
      id: "crisis",
      title: "Crisis Sessions",
      value: crisisSessions,
      description:
        "Immediate emotional support at the moment someone feels heard, safe, and supported.",
      image:
        "https://www.verywellmind.com/thmb/xe-jiigBBKsTBeoQT4vLrCtH8Eo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1316037109-befbf7445a0d4fb28c0b81685520ae1e.jpg",
      alt: "Crisis counselor talking to a survivor",
    },
    {
      id: "therapy",
      title: "Therapy Hours",
      value: therapyHours,
      description:
        "Hours of healing where survivors rebuild confidence and rediscover hope.",
      image:
        "https://www.headwayclinic.ca/wp-content/uploads/2024/11/Therapy-session-abstract-e1732998959192.webp",
      alt: "Therapy session fostering healing and growth",
    },
  ];

  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const getVisibleCount = () => {
      if (window.innerWidth < 640) return 1;          
      if (window.innerWidth < 1024) return 2;        
      return 3;                                    
    };

    setVisibleCount(getVisibleCount());

    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = Math.max(impactItems.length - visibleCount, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex]);

  const handleDotClick = (index) => {
    if (index > maxIndex) {
      setCurrentIndex(maxIndex);
    } else {
      setCurrentIndex(index);
    }
  };

  return (
    <>
    <Header />
    <div className="donor-impact-page">
      <header className="impact-header">
        <h1>Your Impact This Month</h1>
        <p>
          Because of your generosity, women and children in crisis found safety,
          warmth, and someone to listen. Here is what your{" "}
          <span className="impact-amount">${totalDonation}</span> has made
          possible this month.
        </p>
      </header>

      <section className="impact-summary">
        <div className="impact-summary-card">
          <h2>Lives Touched</h2>
          <p className="impact-summary-number">
            {shelterNights +
              crisisSessions +
              therapyHours +
              Math.floor(meals / 10)}
          </p>
          <p className="impact-summary-text">
            families slept safely, shared warm meals, and began to heal.
          </p>
        </div>
      </section>

      <section className="impact-carousel">
        <div
          className="impact-carousel-track"
          style={{
            transform: `translateX(-${
              (currentIndex * 100) / (visibleCount || 1)
            }%)`,
          }}
        >
          {impactItems.map((item) => (
            <article className="impact-card" key={item.id}>
              <img src={item.image} alt={item.alt} className="impact-photo" />
              <h3>{item.title}</h3>
              <p className="impact-number">{item.value}</p>
              <p className="impact-description">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="impact-carousel-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={
                index === currentIndex
                  ? "impact-dot impact-dot-active"
                  : "impact-dot"
              }
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="impact-cta">
        <h2>Every Extra Dollar Deepens Your Impact</h2>
        <p>
          Another night of shelter, another warm meal, another voice on the
          crisis line. Your continued support keeps these doors open.
        </p>
        <button
          className="impact-donate-btn"
          onClick={() => navigate("/donate")}
        >
          Donate
        </button>
        <button className="back-dashboard-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </section>
      
    </div>
    <Footer />
    </>
  );
}

export default DonorImpactPage;
