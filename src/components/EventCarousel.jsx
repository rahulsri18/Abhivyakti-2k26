import React, { useState } from 'react';

const EventCarousel = ({ items, renderItem, className = "" }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    return (
        <div className={`carousel-container ${className}`}>
            <button className="carousel-control prev" onClick={prev} aria-label="Previous">
                <span className="arrow">‹</span>
            </button>

            <div className="carousel-viewport">
                <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {items.map((item, index) => (
                        <div key={index} className="carousel-slide">
                            {renderItem(item, index)}
                        </div>
                    ))}
                </div>
            </div>

            <button className="carousel-control next" onClick={next} aria-label="Next">
                <span className="arrow">›</span>
            </button>

            <div className="carousel-dots">
                {items.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default EventCarousel;
