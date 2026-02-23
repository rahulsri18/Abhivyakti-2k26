import React, { useState, useEffect } from 'react';
import EventCarousel from './EventCarousel';

const SubEventList = ({ category, events, onBack, onRegister, animationDirection = "from-top" }) => {
    const [currentLevelEvents, setCurrentLevelEvents] = useState(events);
    const [isDrilledDown, setIsDrilledDown] = useState(false);

    // Update internal state if the category changes from parent
    useEffect(() => {
        setCurrentLevelEvents(events);
        setIsDrilledDown(false);
    }, [events]);

    // Ensure reveal animations work when drilling down
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal:not(.visible)');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [currentLevelEvents]);

    const handleExplore = (subEvent) => {
        if (subEvent.subEvents) {
            setCurrentLevelEvents(subEvent.subEvents);
            setIsDrilledDown(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleLocalBack = () => {
        setCurrentLevelEvents(events);
        setIsDrilledDown(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="sub-events-container">
            <div className="sub-events-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ margin: 0 }}>{isDrilledDown ? 'Explore Events' : `${category} Events`}</h2>
                <button className="btn-outline" onClick={isDrilledDown ? handleLocalBack : onBack} style={{ padding: '0.6rem 1.2rem' }}>
                    ← {isDrilledDown ? `Back to ${category}` : 'Back to Categories'}
                </button>
            </div>

            <div
                className={`events-grid ${isDrilledDown ? 'explore-grid' : ''}`}
                style={currentLevelEvents?.length === 1 ? { display: 'block' } : {}}
            >
                {currentLevelEvents && currentLevelEvents.length > 0 ? (
                    currentLevelEvents.map((subEvent, index) => (
                        <div
                            key={subEvent.id}
                            className={`glass event-card sub-event-card reveal ${animationDirection}`}
                            style={{
                                transitionDelay: `${index * 0.1}s`,
                                maxWidth: currentLevelEvents.length === 1 ? '420px' : (currentLevelEvents.length === 2 ? '380px' : '310px'),
                                minHeight: currentLevelEvents.length === 1 ? '380px' : (currentLevelEvents.length === 2 ? '460px' : 'auto'),
                                margin: '0 auto',
                                width: '100%',
                                padding: currentLevelEvents.length === 1 ? '1.4rem 1.4rem 2rem' : (currentLevelEvents.length === 2 ? '1.8rem 1.6rem' : '0.8rem 1rem')
                            }}
                        >
                            <h3 style={{ fontSize: currentLevelEvents.length === 1 ? '2.0rem' : (currentLevelEvents.length === 2 ? '1.9rem' : '1.45rem'), marginBottom: '0.8rem' }}>{subEvent.title}</h3>
                            <p className="sub-event-desc" style={{ marginBottom: (currentLevelEvents.length === 1) ? '0.6rem' : (currentLevelEvents.length === 2 ? '0.8rem' : '0.4rem'), fontSize: currentLevelEvents.length === 1 ? '1.1rem' : (currentLevelEvents.length === 2 ? '1.05rem' : '0.9rem') }}>{subEvent.description}</p>
                            <div className="sub-event-details" style={{ display: 'flex', flexDirection: 'column', gap: (currentLevelEvents.length === 1) ? '0.35rem' : '0.2rem', margin: '0.4rem 0', textAlign: 'left', background: 'rgba(255,255,255,0.3)', padding: (currentLevelEvents.length === 1) ? '0.8rem' : '0.5rem', borderRadius: '8px', fontSize: currentLevelEvents.length === 1 ? '1.1rem' : '0.9rem' }}>
                                <div className="detail-row"><span className="detail-label">📅 <b>Date:</b></span> {subEvent.date || 'February 18-19'}</div>
                                {subEvent.duration && <div className="detail-row"><span className="detail-label">⏱️ <b>{subEvent.duration.includes('-') || subEvent.duration.toLowerCase() === 'online' ? 'Time' : 'Duration'}:</b></span> {subEvent.duration}</div>}
                                <div className="detail-row"><span className="detail-label">👥 <b>Team Size:</b></span> {subEvent.teamSize}</div>
                                <div className="detail-row"><span className="detail-label">🏆 <b>Prize:</b></span> {subEvent.prize}</div>
                                {subEvent.entryFee && <div className="detail-row"><span className="detail-label">💰 <b>Entry Fee:</b></span> {subEvent.entryFee}</div>}


                            </div>
                            {subEvent.explore ? (
                                <button
                                    className="btn-primary"
                                    style={{ marginTop: (isDrilledDown && currentLevelEvents.length > 1) ? '0.6rem' : '1rem', width: '100%', display: 'block', padding: (isDrilledDown && currentLevelEvents.length > 1) ? '0.5rem' : '0.8rem', fontSize: (isDrilledDown && currentLevelEvents.length > 1) ? '0.85rem' : '1rem' }}
                                    onClick={() => handleExplore(subEvent)}
                                >
                                    Explore events
                                </button>
                            ) : (
                                <button
                                    className="btn-primary"
                                    disabled={true}
                                    style={{
                                        marginTop: (isDrilledDown && currentLevelEvents.length > 1) ? '0.6rem' : '1rem',
                                        width: '100%',
                                        display: 'block',
                                        padding: (isDrilledDown && currentLevelEvents.length > 1) ? '0.5rem' : '0.8rem',
                                        fontSize: (isDrilledDown && currentLevelEvents.length > 1) ? '0.85rem' : '1rem',
                                        opacity: 0.6,
                                        cursor: 'not-allowed'
                                    }}
                                >
                                    Registration Closed
                                </button>
                            )}
                            {subEvent.rulebook && (
                                <button
                                    className="btn-outline"
                                    style={{ marginTop: '0.6rem', width: '100%', display: 'block', fontSize: '0.8rem' }}
                                    onClick={() => window.open(subEvent.rulebook, '_blank')}
                                >
                                    Download Rulebook
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="glass event-card" style={{ gridColumn: '1/-1' }}>
                        <p>Events for this category will be announced soon!</p>
                    </div>
                )}
            </div>

            {/* Mobile Carousel View for Sub-Events */}
            {currentLevelEvents && currentLevelEvents.length > 0 && (
                <div className="mobile-only">
                    <EventCarousel
                        items={currentLevelEvents}
                        renderItem={(subEvent) => (
                            <div className="glass event-card" style={{ width: '100%', padding: '1.8rem' }}>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{subEvent.title}</h3>
                                <p className="sub-event-desc" style={{ marginBottom: '1rem' }}>{subEvent.description}</p>
                                <div className="sub-event-details" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1rem 0', textAlign: 'left', background: 'rgba(255,255,255,0.3)', padding: '1rem', borderRadius: '8px' }}>
                                    <div className="detail-row"><span className="detail-label">📅 <b>Date:</b></span> {subEvent.date || 'February 18-19'}</div>
                                    {subEvent.duration && <div className="detail-row"><span className="detail-label">⏱️ <b>Duration:</b></span> {subEvent.duration}</div>}
                                    <div className="detail-row"><span className="detail-label">👥 <b>Team Size:</b></span> {subEvent.teamSize}</div>
                                    <div className="detail-row"><span className="detail-label">🏆 <b>Prize:</b></span> {subEvent.prize}</div>
                                    <div className="detail-row"><span className="detail-label">💰 <b>Entry Fee:</b></span> {subEvent.entryFee}</div>


                                </div>
                                {subEvent.explore ? (
                                    <button
                                        className="btn-primary"
                                        style={{ marginTop: '1rem', width: '100%', display: 'block', padding: '0.8rem', fontSize: '1rem' }}
                                        onClick={() => handleExplore(subEvent)}
                                    >
                                        Explore events
                                    </button>
                                ) : (
                                    <button
                                        className="btn-primary"
                                        disabled={true}
                                        style={{
                                            marginTop: '1rem',
                                            width: '100%',
                                            display: 'block',
                                            padding: '0.8rem',
                                            fontSize: '1rem',
                                            opacity: 0.6,
                                            cursor: 'not-allowed'
                                        }}
                                    >
                                        Registration Closed
                                    </button>
                                )}
                            </div>
                        )}
                    />
                </div>
            )}
        </div>
    );
};

export default SubEventList;
