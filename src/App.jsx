import React, { useState, useEffect } from 'react';
import AdminDashboard from './components/AdminDashboard';
import './App.css';
import logo from './assets/logo.png';
import mainLogo from './assets/A logo.png';
import logoLetter from './assets/logo-letter.png';
import UnifiedRegistrationForm from './components/UnifiedRegistrationForm';
import SubEventList from './components/SubEventList';
import CheckStatus from './components/CheckStatus';
import { eventsData } from './data/events';
import EventCarousel from './components/EventCarousel';
import gallery1 from './assets/gallery/gallery-v2-1.jpg';
import gallery3 from './assets/gallery/gallery-v2-3.jpg';
import gallery5 from './assets/gallery/gallery-v2-5.jpg';
import gallery7 from './assets/gallery/gallery-v2-7.jpg';
import gallery8 from './assets/gallery/gallery-v2-8.jpg';
import gallery9 from './assets/gallery/gallery-v2-9.jpg';
import gallery10 from './assets/gallery/gallery-v2-10.jpg';
import gallery11 from './assets/gallery/gallery-v2-11.jpg';
import gallery12 from './assets/gallery/gallery-v2-12.jpg';
import gallery13 from './assets/gallery/gallery-v2-13.jpg';
import gallery14 from './assets/gallery/gallery-v2-14.jpg';
import gallery15 from './assets/gallery/gallery-v2-15.jpg';
import aboutImage from './assets/about-image.jpg';
import slide1 from './assets/about/slide1.jpg';
import slide2 from './assets/about/slide2.jpg';
import slide3 from './assets/about/slide3.jpg';
import slide4 from './assets/about/slide4.jpg';
import slide5 from './assets/about/slide5.jpg';
import digiMonkLogo from './assets/digi-monk-logo.jpeg';
import ScrollRevealText from './components/ScrollRevealText';

const aboutSlides = [slide1, slide2, slide3, slide4, slide5];

import EventSchedule from './components/EventSchedule';
import StarNight from './components/StarNight';

function App() {
  const [view, setView] = useState('home'); // 'home', 'category', 'admin'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showStatus, setShowStatus] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Slideshow Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % aboutSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.view === 'category') {
        setSelectedCategory(event.state.category);
        setView('category');
      } else {
        setView('home');
        setSelectedCategory(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openCategory = (category) => {
    setSelectedCategory(category);
    setView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState({ view: 'category', category }, '', `#${category}`);
  };

  const backToHome = () => {
    setView('home');
    setSelectedCategory(null);
    // Only push state if we are not already going back (checks if there's a hash or state)
    if (window.history.state?.view === 'category') {
      window.history.back(); // Simulate browser back if we came from a category
    } else {
      window.history.pushState(null, '', ' '); // Clear hash
    }
  };

  const openRegistration = (event) => {
    if (typeof event === 'string') {
      setSelectedEvent({ title: event, minSize: 1, maxSize: 10 });
    } else {
      setSelectedEvent(event);
    }
  };
  const closeRegistration = () => setSelectedEvent(null);

  const eventIcons = {
    Dance: '💃',
    Music: '🎶',
    Drama: '🎭',
    Poetry: '✒️',
    Anchoring: '🎤',
    Gaming: '🎮'
  };

  const categoryInfo = {
    Dance: { date: 'Feb 18-19', teamSize: '1-12', prize: 'Depends on registration', entryFee: '₹100 - ₹600' },
    Music: { date: 'Feb 18-19', teamSize: '1-2', prize: 'Depends on registration', entryFee: '₹100-150' },
    Drama: { date: 'Feb 18-19', teamSize: '1-10', prize: 'Depends on registration', entryFee: '₹100-200' },
    Poetry: { date: 'Feb 19', teamSize: '1-10', prize: 'Depends on registration', entryFee: 'Free - ₹200' },
    Anchoring: { date: 'Feb 18-19', teamSize: '1-10', prize: 'Depends on registration', entryFee: '₹100-200' },
    Gaming: { date: 'Feb 18-19', teamSize: '1-10', prize: 'Depends on registration', entryFee: '₹50' }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px -50px 0px' // Trigger when card is 50px from entering the viewport
    });

    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => hiddenElements.forEach((el) => observer.unobserve(el));
  }, [view]);

  // Handle footer reveal specifically
  useEffect(() => {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          footerObserver.disconnect();
        }
      });
    }, { threshold: 0.05 });

    const footer = document.querySelector('.contact-section');
    if (footer) footerObserver.observe(footer);

    return () => footerObserver.disconnect();
  }, [view]);

  // Close registration modal when view changes (e.g. Browser Back button)
  useEffect(() => {
    setSelectedEvent(null);
  }, [view]);

  return (
    <div className="app-container">
      {/* Decorative Blobs */}
      <div className="blob" style={{ top: '10%', left: '5%', width: '300px', height: '300px', background: 'var(--color-secondary)' }}></div>

      <nav className="navbar">
        <div className="nav-logo">
          <img src={logo} alt="Abhivyakti Logo" className="logo-img" />
          <span className="logo-text">SRMCEM</span>
        </div>

        {/* Hamburger Menu Icon */}
        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); backToHome(); setIsMenuOpen(false); }}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); backToHome(); setIsMenuOpen(false); setTimeout(() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>Events</a>
          <a href="#about" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>About</a>
          <a href="#gallery" onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' }); }}>Gallery</a>

          <a href="#admin" onClick={(e) => { e.preventDefault(); setView('admin'); setIsMenuOpen(false); window.scrollTo(0, 0); }}>Admin</a>
        </div>
      </nav>

      <main>
        {view === 'home' ? (
          <>
            <section id="home" className="hero-section">
              <div className="hero-content">
                <h4 className="subtitle font-accent">
                  Shri Ramswaroop Memorial College of Engineering and Management<br />
                  <span style={{ display: 'block', marginTop: '2rem', marginBottom: '-3rem', fontFamily: '"Castellar", serif', fontSize: '1em', letterSpacing: '0.3em', textTransform: 'uppercase' }}>presents</span>
                </h4>
                <h1 className="main-title wide-spread">
                  <span className="title-integrated-logo">
                    <img
                      src={mainLogo}
                      alt="A"
                      className="letter-a-logo"
                      style={{
                        opacity: 0,
                        transform: 'translateX(20px)',
                        animation: 'letterReveal 0.5s ease forwards',
                        animationDelay: '2.25s'
                      }}
                    />
                    <span className="shimmer-text reveal-text">
                      {"BHIVYAKTI".split("").map((letter, index, array) => (
                        <span key={index} style={{ "--idx": array.length - 1 - index, animationDelay: `calc(0.75s + ${(array.length - 1 - index) * 0.15}s)` }}>{letter}</span>
                      ))}
                    </span>
                  </span>
                  <span className="highlight reveal-text" style={{ marginLeft: '1rem', marginTop: '-2rem' }}>
                    {"2K26".split("").map((char, index, array) => (
                      <span key={index} style={{ "--idx": array.length - 1 - index, animationDelay: `calc(${(array.length - 1 - index) * 0.15}s)` }}>{char}</span>
                    ))}
                  </span>
                </h1>
                <p className="theme-text typewriter-text">Theme: <i>College Diaries</i></p>
                <div className="hero-btns">
                  <button className="btn-primary" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>Registration Closed</button>
                  <button className="btn-primary" onClick={() => setShowStatus(true)}>Check Status</button>
                </div>
              </div>
            </section>

            <hr className="section-divider" />

            <section id="about" className="about-section">
              <h2 className="section-title">About Abhivyakti</h2>
              <div className="about-container-spread">
                <div className="about-text-content">
                  <ScrollRevealText
                    text="Abhivyakti 2026 is not just a festival; it's an explosion of creativity where tradition meets modern innovation. As our premier cultural event, it serves as a dynamic stage for students to transcend boundaries and express their soul through a kaleidoscope of events—from high-octane dance battles to soul-stirring melodies, every moment is designed to ignite your passion. Dive into the stimulating worlds of literary arts, fashion, and performing arts, where Abhivyakti offers an unparalleled platform to showcase your genius and join a legacy of excellence. Get ready to experience the year's most anticipated celebration, filled with electrifying energy and the spirit of true artistic freedom as you challenge your limits and become a legend in the making!"
                  />
                </div>
                <div className="about-image-right">
                  <div className="slideshow-container">
                    {aboutSlides.map((slide, index) => (
                      <img
                        key={index}
                        src={slide}
                        alt={`Abhivyakti Slide ${index + 1}`}
                        className={`about-img-main slideshow-img ${index === currentSlide ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <hr className="section-divider" />

            <section id="schedule" className="schedule-section">
              <h2 className="section-title">Spotlight Events</h2>
              <EventSchedule />
            </section>

            <hr className="section-divider" />

            <section id="star-night" className="star-night-outer">
              <h2 className="section-title">Special Appearance</h2>
              <StarNight />
            </section>

            <hr className="section-divider" />

            <section id="events" className="events-section full-width">
              <h2 className="section-title">Competitive Events</h2>
              <div className="events-grid cultural-grid">
                {Object.keys(eventsData).map((category, index) => (
                  <div
                    key={category}
                    className={`glass event-card reveal from-top`}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                    onClick={() => openCategory(category)}
                  >
                    <div className="event-icon">{eventIcons[category] || '✨'}</div>
                    <h3>
                      {category}
                      {category === 'Dance' && <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.2rem' }}>(Step Cell)</span>}
                      {category === 'Music' && <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.2rem' }}>(Euphony Cell)</span>}
                      {category === 'Drama' && <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.2rem' }}>(Dracula Cell)</span>}
                      {category === 'Poetry' && <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.2rem' }}>(Literati Cell)</span>}
                      {category === 'Anchoring' && <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.2rem' }}>(Wiwa Cell)</span>}
                      {category === 'Gaming' && <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.2rem' }}>(Media Cell)</span>}
                    </h3>
                    <p style={{ marginBottom: '0.3rem', fontSize: '1.0rem' }}>Unleash your creativity in {category}.</p>

                    <div className="sub-event-details" style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', margin: '0.3rem 0', textAlign: 'left', background: 'rgba(255,255,255,0.3)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                      <div className="detail-row"><span className="detail-label">📅 <b>Date:</b></span> {categoryInfo[category]?.date || 'Feb 18-19'}</div>
                      <div className="detail-row"><span className="detail-label">👥 <b>Team Size:</b></span> {categoryInfo[category]?.teamSize || '1-10'}</div>
                      <div className="detail-row"><span className="detail-label">🏆 <b>Prize:</b></span> {categoryInfo[category]?.prize || 'Depends on registration'}</div>
                      <div className="detail-row"><span className="detail-label">💰 <b>Entry Fee:</b></span> {categoryInfo[category]?.entryFee || '₹100-200'}</div>
                    </div>

                    <button className="btn-primary" style={{ width: '100%', marginTop: '0.3rem', padding: '0.6rem', fontSize: '1.0rem' }}>View Competitions →</button>
                  </div>
                ))}
              </div>

              {/* Mobile Carousel View */}
              <div className="mobile-only">
                <EventCarousel
                  items={Object.keys(eventsData)}
                  renderItem={(category) => (
                    <div
                      key={category}
                      className="glass event-card"
                      onClick={() => openCategory(category)}
                    >
                      <div className="event-icon">{eventIcons[category] || '✨'}</div>
                      <h3>
                        {category}
                        {category === 'Dance' && <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.2rem' }}>(Step Cell)</span>}
                        {category === 'Music' && <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.2rem' }}>(Euphony Cell)</span>}
                        {category === 'Drama' && <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.2rem' }}>(Dracula Cell)</span>}
                        {category === 'Poetry' && <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.2rem' }}>(Literati Cell)</span>}
                        {category === 'Anchoring' && <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.2rem' }}>(Wiwa Cell)</span>}
                        {category === 'Gaming' && <span style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginTop: '0.2rem' }}>(Media Cell)</span>}
                      </h3>
                      <p style={{ marginBottom: '0.3rem', fontSize: '1.0rem' }}>Unleash your creativity in {category}.</p>

                      <div className="sub-event-details" style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', margin: '0.3rem 0', textAlign: 'left', background: 'rgba(255,255,255,0.3)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                        <div className="detail-row"><span className="detail-label">📅 <b>Date:</b></span> {categoryInfo[category]?.date || 'Feb 18-19'}</div>
                        <div className="detail-row"><span className="detail-label">👥 <b>Team Size:</b></span> {categoryInfo[category]?.teamSize || '1-10'}</div>
                        <div className="detail-row"><span className="detail-label">🏆 <b>Prize:</b></span> {categoryInfo[category]?.prize || 'Depends on registration'}</div>
                        <div className="detail-row"><span className="detail-label">💰 <b>Entry Fee:</b></span> {categoryInfo[category]?.entryFee || '₹100-200'}</div>
                      </div>

                      <button className="btn-primary" style={{ width: '100%', marginTop: '0.3rem', padding: '0.6rem', fontSize: '1.0rem' }}>View Competitions →</button>
                    </div>
                  )}
                />
              </div>
            </section>


            <section id="gallery" className="gallery-section">
              <h2 className="section-title">Event Gallery</h2>
              <p className="section-description">Some glimpses from our previous successful events</p>
              <div className="gallery-grid">
                {[gallery1, gallery3, gallery5, gallery7, gallery8, gallery9, gallery10, gallery11, gallery12, gallery13, gallery14, gallery15].map((img, i) => (
                  <div key={i} className="gallery-item glass reveal from-bottom">
                    <img src={img} alt={`Event ${i + 1}`} />
                  </div>
                ))}
              </div>
            </section>



            <section className="highlight-section">
              <h2 className="section-title">How to Register?</h2>
              <div className="steps-container">
                <div className="step-item">
                  <h3>1. Choose Category</h3>
                  <p>Select a category (e.g., Dance, Music) to browse competitions.</p>
                </div>
                <div className="step-item">
                  <h3>2. Select Competition</h3>
                  <p>Pick a specific competition (e.g., Solotaire, Singing) to see details.</p>
                </div>
                <div className="step-item">
                  <h3>3. Register</h3>
                  <p>Click the <b>Register</b> button on your chosen event card and fill in your team details.</p>
                </div>
                <div className="step-item">
                  <h3>4. Pay</h3>
                  <p>Complete the secure payment process to confirm your slot.</p>
                </div>
              </div>
            </section>

            <hr className="section-divider" />

            <section id="contact" className="contact-section reveal from-bottom">
              <div className="contact-content">
                <h2 className="section-title" style={{ color: 'var(--color-bg)', marginBottom: '3rem' }}>Contact Us</h2>
                <div className="footer-layout">

                  {/* Left Column: Contact Info */}
                  <div className="footer-left">
                    <h3 className="footer-heading">Get in Touch</h3>
                    <div className="contact-item-row">
                      <span className="icon">📍</span>
                      <p>
                        <a
                          href="https://www.google.com/maps/search/?api=1&query=Shri+Ramswaroop+Memorial+College+of+Engineering+and+Management+Tiwariganj+Faizabad+Road+Lucknow"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          Shri Ramswaroop Memorial College of Engineering and Management<br />Tiwariganj, Faizabad Road, Lucknow
                        </a>
                      </p>
                    </div>
                    <div className="contact-item-row">
                      <span className="icon">📧</span>
                      <p>
                        <a
                          href="mailto:abhivyakti2k26@gmail.com"
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          abhivyakti2k26@gmail.com
                        </a>
                      </p>
                    </div>
                    <div className="contact-item-row">
                      <span className="icon">📞</span>
                      <p>
                        <a href="tel:9559671593" style={{ color: 'inherit', textDecoration: 'none' }}>+91 95596 71593</a>,{' '}
                        <a href="tel:6307869918" style={{ color: 'inherit', textDecoration: 'none' }}>+91 63078 69918</a>,{' '}
                        <a href="tel:9219240965" style={{ color: 'inherit', textDecoration: 'none' }}>+91 92192 40965</a>
                      </p>
                    </div>
                    <div className="contact-item-row" style={{ marginTop: '1rem' }}>
                      <span className="icon">🌐</span>
                      <p>
                        <a href="https://srmcem.ac.in/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                          Official Website
                        </a>
                      </p>
                    </div>
                    <div className="contact-item-row">
                      <span className="icon">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                          alt="Instagram"
                          style={{ width: '24px', height: '24px', verticalAlign: 'middle' }}
                        />
                      </span>
                      <p>
                        <a href="https://www.instagram.com/srmcem_official?igsh=dXpyODR5YzJ1aTIy" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                          Instagram
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Event List */}
                  <div className="footer-right">
                    <h3 className="footer-heading">Explore Events</h3>
                    <ul className="footer-event-list">
                      {Object.keys(eventsData).map(category => (
                        <li key={category}><a href="#" onClick={(e) => { e.preventDefault(); openCategory(category); }}>{category}</a></li>
                      ))}
                    </ul>
                  </div>

                </div>
                <div className="footer-bottom-bar">
                  <p className="copyright">© 2026 Abhivyakti. All Rights Reserved.</p>
                </div>
              </div>
            </section>
          </>
        ) : view === 'admin' ? (
          <AdminDashboard onBack={backToHome} />
        ) : (
          <section className="events-section sub-events-view">
            <SubEventList
              category={selectedCategory}
              events={eventsData[selectedCategory]}
              onBack={backToHome}
              onRegister={openRegistration}
              animationDirection="from-top"
            />
          </section>
        )}

        {selectedEvent && (
          <UnifiedRegistrationForm
            eventDetails={selectedEvent}
            category={selectedCategory}
            onClose={closeRegistration}
          />
        )}

        {showStatus && (
          <CheckStatus onClose={() => setShowStatus(false)} />
        )}
      </main>


    </div >
  );
}

export default App;
