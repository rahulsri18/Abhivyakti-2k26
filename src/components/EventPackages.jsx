import React, { useState } from 'react';
import UnifiedRegistrationForm from './UnifiedRegistrationForm';

const EventPackages = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);

    const packages = [
        {
            id: 'basic-plan',
            title: 'Abhivyakti Basic Plan',
            price: '₹799',
            description: 'Experience the full vibe of Abhivyakti with essential access and stay.',
            features: [
                'All Events Access (Competitions + Star Nights)',
                'Hostel Accommodation (4 Days)',
                'Event Kit (ID Card, Schedule)',
                'Free WiFi at Venue'
            ],
            notIncluded: [
                'Food / Mess Facility'
            ],
            color: 'var(--color-primary)',
            highlight: false
        },
        {
            id: 'ultimate-plan',
            title: 'Abhivyakti Ultimate Plan',
            price: '₹1499',
            description: 'The complete premium experience with food and priority access.',
            features: [
                'Everything in Basic Plan',
                'Full Mess Accommodation (Breakfast, Lunch, Dinner)',
                'Priority Front-Row Access for Star Night',
                'Event Kit & Free WiFi'
            ],
            notIncluded: [],
            color: '#f1c40f', // Gold
            highlight: true
        }
    ];

    const handleRegister = (pkg) => {
        setSelectedPackage({
            title: pkg.title,
            entryFee: pkg.price,
            minSize: 1,
            maxSize: 1,
            date: 'Feb 18 - 21',
            category: 'Event Package'
        });
    };

    return (
        <div className="section-container" style={{ position: 'relative', overflow: 'hidden' }}>
            <h2 className="section-title">Event Packages</h2>
            <p className="section-subtitle">Choose your perfect stay & experience plan for Abhivyakti 2026</p>

            <div className="packages-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                maxWidth: '1000px',
                margin: '3rem auto'
            }}>
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className="glass package-card"
                        style={{
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            border: pkg.highlight ? `2px solid ${pkg.color}` : '1px solid rgba(255,255,255,0.1)',
                            transform: pkg.highlight ? 'scale(1.02)' : 'scale(1)',
                            position: 'relative'
                        }}
                    >
                        {pkg.highlight && (
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                right: '20px',
                                background: pkg.color,
                                color: '#000',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}>
                                BEST VALUE
                            </div>
                        )}

                        <h3 style={{ color: pkg.color, fontSize: '1.8rem', marginBottom: '0.5rem' }}>{pkg.title}</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>
                            {pkg.price} <span style={{ fontSize: '1rem', opacity: 0.7, fontWeight: 'normal' }}>/ person</span>
                        </div>
                        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>{pkg.description}</p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
                            {pkg.features.map((feature, idx) => (
                                <li key={idx} style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <span style={{ color: '#2ecc71' }}>✓</span> {feature}
                                </li>
                            ))}
                            {pkg.notIncluded.map((feature, idx) => (
                                <li key={idx} style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '10px', opacity: 0.5, textDecoration: 'line-through' }}>
                                    <span style={{ color: '#e74c3c' }}>✕</span> {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            className="btn-primary"
                            style={{
                                width: '100%',
                                background: pkg.highlight ? pkg.color : 'transparent',
                                border: `1px solid ${pkg.color}`,
                                color: pkg.highlight ? '#000' : pkg.color
                            }}
                            onClick={() => handleRegister(pkg)}
                        >
                            Choose {pkg.highlight ? 'Ultimate' : 'Basic'}
                        </button>
                    </div>
                ))}
            </div>

            {selectedPackage && (
                <UnifiedRegistrationForm
                    eventDetails={selectedPackage}
                    category="Event Package"
                    onClose={() => setSelectedPackage(null)}
                />
            )}
        </div>
    );
};

export default EventPackages;
