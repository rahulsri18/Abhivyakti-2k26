import React, { useState, useEffect } from 'react';
import darshan1 from '../assets/darshan 1.jpg';
import darshan2 from '../assets/darshan 2.jpg';
import darshan3 from '../assets/Darshan-Raval-07-1.webp';

const StarNight = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const [bgIndex, setBgIndex] = useState(0);
    const starImages = [darshan3, darshan1, darshan2];

    useEffect(() => {
        const targetDate = new Date('February 21, 2026 18:00:00').getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        const bgInterval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % starImages.length);
        }, 5000);

        return () => {
            clearInterval(interval);
            clearInterval(bgInterval);
        };
    }, []);

    return (
        <section id="star-night" className="star-night-section">
            <div className="star-night-bg-container">
                {starImages.map((img, index) => (
                    <div
                        key={index}
                        className={`star-night-bg ${index === bgIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}
            </div>

            <div className="star-night-overlay"></div>

            <div className="star-night-content container">
                <h1 className="star-title reveal from-bottom">Abhivyakti Star Night</h1>
                <h2 className="artist-name reveal from-bottom" style={{ transitionDelay: '0.2s' }}>DARSHAN RAVAL</h2>

                <p className="concert-tagline reveal from-bottom" style={{ transitionDelay: '0.3s' }}>
                    Join the Blue Squad for an unforgettable night of melody and magic.
                </p>

                <div className="countdown-container reveal from-bottom" style={{ transitionDelay: '0.4s' }}>
                    <div className="countdown-item">
                        <span className="count-number">{timeLeft.days}</span>
                        <span className="count-label">Days</span>
                    </div>
                    <div className="countdown-item">
                        <span className="count-number">{timeLeft.hours}</span>
                        <span className="count-label">Hours</span>
                    </div>
                    <div className="countdown-item">
                        <span className="count-number">{timeLeft.minutes}</span>
                        <span className="count-label">Mins</span>
                    </div>
                    <div className="countdown-item">
                        <span className="count-number">{timeLeft.seconds}</span>
                        <span className="count-label">Secs</span>
                    </div>
                </div>

                <div className="concert-details reveal from-bottom" style={{ transitionDelay: '0.5s' }}>
                    <div className="concert-info-item">
                        <span className="icon">📅</span>
                        <span>21st February, 2026</span>
                    </div>
                    <div className="concert-info-item">
                        <span className="icon">⏰</span>
                        <span>6:00 PM onwards</span>
                    </div>
                    <div className="concert-info-item">
                        <span className="icon">📍</span>
                        <span>
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Shri+Ramswaroop+Memorial+University+Barabanki+Deva+Road"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px dashed rgba(255,255,255,0.5)' }}
                            >
                                SRMU Campus
                            </a>
                        </span>
                    </div>
                </div>

                <div className="concert-actions reveal from-bottom" style={{ transitionDelay: '0.6s' }}>
                    <button className="btn-primary concert-btn">MARK YOUR CALENDAR</button>

                </div>
            </div>
        </section>
    );
};

export default StarNight;
