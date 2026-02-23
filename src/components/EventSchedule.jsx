import React, { useState, useEffect } from 'react';
import rockImage from '../assets/rock.webp';
import fashionImage from '../assets/fasion.avif'; // Note: spelled as 'fasion' in assets
import qawwaliImage from '../assets/qawwali.jpg';
import djNightImage from '../assets/dj night.jpg';
import starNightImage from '../assets/star night.jpeg';

const socialStyles = `
.social-icon-link {
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.social-icon-link:hover {
  transform: scale(1.2);
}
`;

const EventSchedule = () => {
    const [activeDay, setActiveDay] = useState('Day 1');
    const [bgIndex, setBgIndex] = useState(0);

    // Mapped background images for each day (can be single string or array for slideshow)
    const dayBackgrounds = {
        'Day 1': rockImage,
        'Day 2': djNightImage,
        'Day 3': qawwaliImage,
        'Day 4': starNightImage
    };

    // Cycle background if it's a slideshow
    useEffect(() => {
        const currentBgs = dayBackgrounds[activeDay];
        if (Array.isArray(currentBgs) && currentBgs.length > 1) {
            const interval = setInterval(() => {
                setBgIndex((prev) => (prev + 1) % currentBgs.length);
            }, 5000); // Change every 5 seconds
            return () => clearInterval(interval);
        } else {
            setBgIndex(0);
        }
    }, [activeDay]);

    // Ensure reveal animations trigger on tab switch
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const revealElements = document.querySelectorAll('.reveal:not(.visible)');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [activeDay]);

    const currentBgs = dayBackgrounds[activeDay];
    const activeBg = Array.isArray(currentBgs) ? currentBgs[bgIndex] : currentBgs;

    // Day-specific Hero Details
    const dayHeroDetails = {
        'Day 1': {
            title: 'Band Performance Kickoff',
            subtitle: 'THE BEGINNING OF THE LEGACY',
            description: 'Feel the pulse of the campus as we ignite Abhivyakti with the electrifying energy of Band Performance and high-fashion elegance.'
        },
        'Day 2': {
            title: 'Electrifying DJ Night',
            subtitle: 'A SYMPHONY OF TRADITION & BEATS',
            description: 'Experience a vibrant blend of musical battles and creative energy, culminating in an electrifying DJ Night.'
        },
        'Day 3': {
            title: 'Mystical Sufi Night',
            subtitle: 'RHYTHMS OF THE HEART',
            description: 'From high-energy dance duels to the meditative calm of our Xero Night, witness the power of artistic diversity.'
        },
        'Day 4': {
            title: 'Star Night',
            subtitle: 'THE ULTIMATE CREATIVE DUEL',
            description: 'As the sun sets on Abhivyakti, experience an unforgettable celebrity concert.'
        }
    };

    // Highlighted events data
    const highlightedEvents = {
        'Day 1': [
            { time: '5:10PM - 5:50PM', title: 'Light and Dark (Fashion Show)', description: 'A mystical journey through style and contrast on the grand runway.', category: 'MAIN EVENT' },
            {
                time: '6:00PM onwards',
                title: 'Band Performance ft. Melomaniac Band',
                description: 'Experience the ultimate musical high with Band Performance, where the atmosphere reaches its peak with electrifying beats.',
                category: 'HIGHLIGHT',
                socialLink: 'https://www.instagram.com/melomaniac_theband?igsh=cGZjYjM5Z2QzcjQ2',
                username: '@melomaniac_theband'
            }
        ],
        'Day 2': [
            { time: '4:00PM - 4:40PM', title: 'Rhythmics Rock event', description: 'Experience the ultimate music battle where melody meets competition.', category: 'HIGHLIGHT' },
            {
                time: '6:00PM onwards',
                title: 'DJ Night ft. BLANE',
                description: 'Get ready to groove as the campus transforms into a high-energy dance floor. Featuring the sensational DJ band BLANE, bringing you an electrifying night of non-stop beats and pure energy!',
                category: 'MAIN EVENT',
                socialLink: 'https://www.instagram.com/blanemusic_/',
                username: '@blanemusic_'
            }
        ],
        'Day 3': [
            {
                time: '6:00PM onwards',
                title: 'Xero Night ft. THE SUFI BAND',
                description: 'A soulful evening with THE SUFI BAND. Experience mystical melodies and deep emotions that will touch your heart in this divine musical journey.',
                category: 'MAIN EVENT',
                socialLink: 'https://www.instagram.com/thesufikhayalband?igsh=MXQxaDgwb2xvbXB5dg==',
                username: '@thesufikhayalband'
            }
        ],
        'Day 4': [
            {
                time: '6:00PM onwards',
                title: 'Star Night ft. DARSHAN RAVAL',
                description: 'A magical night with the heartthrob Darshan Raval to close the festival with a bang.',
                category: 'GRAND FINALE',
                socialLink: 'https://www.instagram.com/darshanravaldz/',
                username: '@darshanravaldz'
            }
        ]
    };

    const days = [
        { id: 'Day 1', label: 'Day 1', date: 'Feb 18th' },
        { id: 'Day 2', label: 'Day 2', date: 'Feb 19th' },
        { id: 'Day 3', label: 'Day 3', date: 'Feb 20th' },
        { id: 'Day 4', label: 'Day 4', date: 'Feb 21st' }
    ];

    return (
        <div className="schedule-outer-container">
            <style>{socialStyles}</style>
            <div className="schedule-tabs">
                {days.map((day) => (
                    <button
                        key={day.id}
                        className={`tab-btn ${activeDay === day.id ? 'active' : ''}`}
                        onClick={() => {
                            setActiveDay(day.id);
                            setBgIndex(0); // Reset slideshow index on tab change
                        }}
                    >
                        {day.label} <span className="tab-date">({day.date})</span>
                    </button>
                ))}
            </div>

            <div
                className="schedule-wrapper"
                style={{
                    '--schedule-bg': `url("${activeBg}")`,
                }}
            >
                <div className="schedule-overlay"></div>

                <div className="schedule-container">
                    {/* Day Highlight Hero Area */}
                    <div className="day-hero-info reveal from-top" key={`hero-${activeDay}`}>
                        <span className="day-subtitle">{dayHeroDetails[activeDay].subtitle}</span>
                        <h2 className="day-hero-title">{dayHeroDetails[activeDay].title}</h2>
                        <p className="day-hero-description">{dayHeroDetails[activeDay].description}</p>
                    </div>

                    <div className="schedule-content">
                        <div className="timeline">
                            {highlightedEvents[activeDay].map((event, index) => (
                                <div key={index} className="timeline-item reveal from-left" style={{ transitionDelay: `${index * 0.15}s` }}>
                                    <div className="time-tag">{event.time}</div>
                                    <div className="schedule-card glass">
                                        <div className="card-info">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <h3>{event.title}</h3>
                                                {event.socialLink && (
                                                    <a
                                                        href={event.socialLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="social-icon-link"
                                                        title="Check out their work on Instagram"
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                                    >
                                                        <img
                                                            src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                                                            alt="Instagram"
                                                            style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                                        />
                                                        {event.username && <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{event.username}</span>}
                                                    </a>
                                                )}
                                            </div>
                                            <p>{event.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventSchedule;
