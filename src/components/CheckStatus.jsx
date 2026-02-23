import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const CheckStatus = ({ onClose }) => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [registration, setRegistration] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchValue.trim()) {
            setError('Please enter your email or phone number');
            return;
        }

        setLoading(true);
        setError('');
        setRegistration(null);

        try {
            // Search by email or phone
            const { data, error: searchError } = await supabase
                .from('registrations')
                .select('*')
                .or(`leader_email.eq.${searchValue},leader_contact.eq.${searchValue}`)
                .order('created_at', { ascending: false })
                .limit(1);

            if (searchError) throw searchError;

            if (data && data.length > 0) {
                setRegistration(data[0]);
            } else {
                setError('No registration found with this email or phone number');
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="registration-modal-overlay" onClick={(e) => {
            if (e.target.className === 'registration-modal-overlay') onClose();
        }}>
            <div className="registration-modal check-status-modal">
                <button className="close-btn" onClick={onClose}>&times;</button>

                <h3 className="font-accent" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Check Registration Status</h3>

                {!registration ? (
                    <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Enter Email or Phone Number</label>
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="email@example.com or 9876543210"
                                style={{ width: '100%' }}
                            />
                        </div>
                        {error && <p style={{ color: 'var(--color-accent)', margin: 0 }}>{error}</p>}
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Searching...' : 'Check Status'}
                        </button>
                    </form>
                ) : (
                    <div className="registration-details" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>Your Entry Code</div>
                            <div style={{
                                fontSize: '1.8rem',
                                fontWeight: 'bold',
                                fontFamily: 'monospace',
                                letterSpacing: '2px'
                            }}>
                                {registration.id.substring(0, 8).toUpperCase()}
                            </div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
                                Show this code at the event entrance
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.9rem' }}>
                            <div><strong>Team:</strong> {registration.team_name}</div>
                            <div><strong>Event:</strong> {registration.event_name}</div>
                            <div><strong>Leader:</strong> {registration.leader_name}</div>
                            <div><strong>Contact:</strong> {registration.leader_contact}</div>
                            <div><strong>College:</strong> {registration.college}</div>
                            <div>
                                <strong>Status:</strong>{' '}
                                <span style={{
                                    color: registration.status === 'Paid' ? '#2ecc71' : '#f39c12',
                                    fontWeight: 'bold'
                                }}>
                                    {registration.status}
                                </span>
                            </div>
                        </div>

                        <button
                            className="btn-text"
                            onClick={() => {
                                setRegistration(null);
                                setSearchValue('');
                            }}
                            style={{ marginTop: '0.5rem' }}
                        >
                            ← Search Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckStatus;
