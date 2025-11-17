import React, { useState, useEffect } from "react";
import "./DonorImpactPage.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { getUserDonations } from "../services/firestore";

const COSTS = {
  shelterNight: 35,
  meal: 5,
  crisisSession: 50,
  therapyHour: 75,
};

function DonorImpactPage() {
  const navigate = useNavigate();

  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const { user } = useAuth();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no user, stop loading (nothing to fetch)
  useEffect(() => {
    if (!user) {
      setLoading(false);
    }
  }, [user]);

  // Fetch donations when user is available
  useEffect(() => {
    if (!user) return;

    const fetchDonations = async () => {
      try {
        const data = await getUserDonations(user.uid);
        setDonations(data || []);
      } catch (err) {
        console.error("Error fetching donations for impact page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  // Responsive number of visible cards
  useEffect(() => {
    const getVisibleCount = () => {
      if (window.innerWidth < 640) return 1;  // mobile
      if (window.innerWidth < 1024) return 2; // tablet
      return 3;                               // desktop
    };

    setVisibleCount(getVisibleCount());

    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute totals and impact values
  const totalDonation = donations.reduce(
    (sum, d) => sum + (d.amount || 0),
    0
  );

  const shelterNights = Math.floor(totalDonation / COSTS.shelterNight);
  const meals = Math.floor(totalDonation / COSTS.meal);
  const crisisSessions = Math.floor(totalDonation / COSTS.crisisSession);
  const therapyHours = Math.floor(totalDonation / COSTS.therapyHour);

  const impactItems = [
    {
      id: "shelter",
      title: t.shelterNightsTitle,
      value: shelterNights,
      description: t.shelterNightsDescription,
      image:
        "https://imageio.forbes.com/specials-images/imageserve/1208448710/GERMANY-HEALTH-VIRUS/960x0.jpg?format=jpg&width=960",
      alt: t.shelterNightsAlt,
    },
    {
      id: "meals",
      title: t.mealsSharedTitle,
      value: meals,
      description: t.mealsSharedDescription,
      image:
        "https://fortune.com/img-assets/wp-content/uploads/2022/10/GettyImages-1355162946-e1665508487320.jpeg",
      alt: t.mealsSharedAlt,
    },
    {
      id: "crisis",
      title: t.crisisSessionsTitle,
      value: crisisSessions,
      description: t.crisisSessionsDescription,
      image:
        "https://www.verywellmind.com/thmb/xe-jiigBBKsTBeoQT4vLrCtH8Eo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1316037109-befbf7445a0d4fb28c0b81685520ae1e.jpg",
      alt: t.crisisSessionsAlt,
    },
    {
      id: "therapy",
      title: t.therapyHoursTitle,
      value: therapyHours,
      description: t.therapyHoursDescription,
      image:
        "https://www.headwayclinic.ca/wp-content/uploads/2024/11/Therapy-session-abstract-e1732998959192.webp",
      alt: t.therapyHoursAlt,
    },
  ];

  const maxIndex = Math.max(impactItems.length - visibleCount, 0);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex]);

  // If user isn't logged in, you can either show nothing or a message.
  // Keeping your original behavior (null) here:
  if (!user) {
    return null;
  }

  const handleDotClick = (index) => {
    if (index > maxIndex) {
      setCurrentIndex(maxIndex);
    } else {
      setCurrentIndex(index);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="donor-impact-page">
          <header className="impact-header">
            <h1>{t.impactTitle}</h1>
            <p>{t.impactLoading}</p>
          </header>
        </div>
        <Footer />
      </>
    );
  }

  if (!loading && totalDonation === 0) {
    return (
      <>
        <Header />
        <div className="donor-impact-page">
          <header className="impact-header">
            <h1>{t.impactTitle}</h1>
            <p>{t.impactNoDonationYet}</p>
          </header>

          <section className="impact-cta">
            <h2>{t.impactStartTitle}</h2>
            <p>{t.impactStartDescription}</p>
            <button
              className="impact-donate-btn"
              onClick={() => navigate("/donate")}
            >
              {t.impactStartButton}
            </button>
            <button
              className="back-dashboard-btn"
              onClick={() => navigate("/dashboard")}
            >
              ← {t.backToMyAccount}
            </button>
          </section>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="donor-impact-page">
        <header className="impact-header">
          <h1>{t.impactTitle}</h1>
          <p>
            {t.impactIntroLine1}{" "}
            <span className="impact-amount">${totalDonation}</span>{" "}
            {t.impactIntroLine2}
          </p>
        </header>

        <section className="impact-summary">
          <div className="impact-summary-card">
            <h2>{t.livesTouched}</h2>
            <p className="impact-summary-number">
              {shelterNights +
                crisisSessions +
                therapyHours +
                Math.floor(meals / 10)}
            </p>
            <p className="impact-summary-text">
              {t.livesTouchedDescription}
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
                aria-label={
                  language === "fr"
                    ? `Aller à la diapositive ${index + 1}`
                    : `${t.goToSlide} ${index + 1}`
                }
              />
            ))}
          </div>
        </section>

        <section className="impact-cta">
          <h2>{t.impactCtaTitle}</h2>
          <p>{t.impactCtaDescription}</p>
          <button
            className="impact-donate-btn"
            onClick={() => navigate("/donate")}
          >
            {t.donate}
          </button>
          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← {t.backToMyAccount}
          </button>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default DonorImpactPage;
