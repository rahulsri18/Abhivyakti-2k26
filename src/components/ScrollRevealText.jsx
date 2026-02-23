import React, { useEffect, useRef, useState, memo } from 'react';

// Memoized Character component to prevent unnecessary re-renders of all characters
const Character = memo(({ char, isRevealed, isCursor }) => (
    <span
        style={{
            color: isRevealed ? 'var(--color-text)' : 'rgba(74, 55, 40, 0.15)',
            transition: 'color 0.12s ease-out',
            display: 'inline-block',
            position: 'relative',
            fontWeight: isRevealed ? '500' : '400',
        }}
    >
        {char}
        {isCursor && (
            <span
                style={{
                    position: 'absolute',
                    right: '-2px',
                    bottom: '0',
                    width: '2px',
                    height: '1.2em',
                    backgroundColor: 'var(--color-primary)',
                    animation: 'blink 0.5s step-end infinite'
                }}
            />
        )}
    </span>
));

const ScrollRevealText = ({ text }) => {
    const containerRef = useRef(null);
    const [revealProgress, setRevealProgress] = useState(0);
    const [isTriggered, setIsTriggered] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsTriggered(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isTriggered) return;

        const duration = 3300;
        const totalChars = text.length;
        let startTime = null;
        let animationFrameId = null;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setRevealProgress(progress);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isTriggered, text]);

    const words = text.split(' ');
    const revealThreshold = Math.floor(text.length * revealProgress);
    let charCounter = 0;

    return (
        <div ref={containerRef} className="scroll-reveal-container" style={{ position: 'relative' }}>
            {words.map((word, wordIndex) => {
                const wordChars = word.split('');
                return (
                    <React.Fragment key={wordIndex}>
                        <span
                            style={{
                                whiteSpace: 'nowrap',
                                display: 'inline',
                            }}
                        >
                            {wordChars.map((char, charIndex) => {
                                const globalIndex = charCounter++;
                                const isRevealed = globalIndex < revealThreshold;
                                const isCursor = globalIndex === revealThreshold && revealProgress > 0 && revealProgress < 1;

                                return (
                                    <Character
                                        key={charIndex}
                                        char={char}
                                        isRevealed={isRevealed}
                                        isCursor={isCursor}
                                    />
                                );
                            })}
                        </span>
                        {wordIndex < words.length - 1 && ' '}
                    </React.Fragment>
                );
            })}
            <style>
                {`
                    @keyframes blink {
                        from, to { opacity: 0 }
                        50% { opacity: 1 }
                    }
                `}
            </style>
        </div>
    );
};

export default ScrollRevealText;
