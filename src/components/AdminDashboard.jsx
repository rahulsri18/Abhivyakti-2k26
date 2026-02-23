
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { eventsData } from '../data/events';

const AdminDashboard = ({ onBack }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Data State
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Client-side auth for simplest setup as per plan
        if (userId === 'abhi26' && password === '1234') {
            setIsAuthenticated(true);
            setError('');
            fetchRegistrations();
        } else {
            setError('Invalid User ID or Password');
        }
    };

    const fetchRegistrations = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching data:', error);
        } else {
            setRegistrations(data || []);
        }
        setLoading(false);
    };

    const updateRegistrationStatus = async (id, newStatus, note = '') => {
        setLoading(true);
        const { error } = await supabase
            .from('registrations')
            .update({ status: newStatus, status_note: note })
            .match({ id });

        if (error) {
            alert("Error updating status: " + error.message);
        } else {
            setRegistrations(registrations.map(r => r.id === id ? { ...r, status: newStatus, status_note: note } : r));
            if (selectedRegistration?.id === id) {
                setSelectedRegistration({ ...selectedRegistration, status: newStatus, status_note: note });
            }
            alert(`Registration ${newStatus} successfully.`);
        }
        setLoading(false);
    };

    const deleteRegistration = async (id, e) => {
        if (e) e.stopPropagation(); // Prevent row click

        if (!window.confirm("Are you sure you want to DELETE this registration? This action cannot be undone.")) {
            return;
        }

        const { error } = await supabase
            .from('registrations')
            .delete()
            .match({ id });

        if (error) {
            alert("Error deleting: " + error.message);
        } else {
            // Remove from local state to avoid refetch
            setRegistrations(registrations.filter(r => r.id !== id));
            if (selectedRegistration?.id === id) {
                setSelectedRegistration(null);
            }
            alert("Registration deleted successfully.");
        }
    };

    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [filterEvent, setFilterEvent] = useState('All');

    // Stats
    const totalRegistrations = registrations.length;
    const paidRegistrations = registrations.filter(r => r.status === 'Paid');
    const totalRevenue = paidRegistrations.length * 150; // In reality, we should sum the specific fees
    const paidTeams = paidRegistrations.length;
    const pendingTeams = registrations.filter(r => r.status === 'Pending').length;

    // Filter logic: Get ALL events from data
    const allEvents = ['All'];

    // Add standard events
    Object.values(eventsData).forEach(categoryEvents => {
        categoryEvents.forEach(evt => {
            if (!allEvents.includes(evt.title)) allEvents.push(evt.title);
        });
    });

    // Add any other events found in registrations (like Packages)
    registrations.forEach(reg => {
        if (reg.event_name && !allEvents.includes(reg.event_name)) {
            allEvents.push(reg.event_name);
        }
    });

    const filteredRegistrations = filterEvent === 'All'
        ? registrations
        : registrations.filter(r => r.event_name === filterEvent);

    // CSV Download Function
    const downloadCSV = () => {
        if (filteredRegistrations.length === 0) {
            alert("No data to download.");
            return;
        }

        const headers = ["Entry Code", "Team Name", "Event", "Leader Name", "Leader Contact", "Leader Email", "College", "Team Size", "Members", "Status", "Payment ID", "Registration Date"];

        const csvRows = [
            headers.join(','), // Header row
            ...filteredRegistrations.map(reg => {
                const membersString = reg.team_members ? reg.team_members.map(m => m.replace(/,/g, ' ')).join('; ') : '';
                return [
                    reg.id,
                    `"${reg.team_name.replace(/"/g, '""')}"`,
                    `"${reg.event_name.replace(/"/g, '""')}"`,
                    `"${reg.leader_name.replace(/"/g, '""')}"`,
                    `"${reg.leader_contact}"`,
                    `"${reg.leader_email}"`,
                    `"${reg.college.replace(/"/g, '""')}"`,
                    reg.team_size,
                    `"${membersString}"`,
                    reg.status,
                    `"${reg.payment_id || ''}"`,
                    `"${new Date(reg.created_at).toLocaleString()}"`
                ].join(',');
            })
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `abhivyakti_registrations_${filterEvent.replace(/ /g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login-container" style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'var(--color-bg)'
            }}>
                <div className="glass" style={{ padding: '3rem', width: '100%', maxWidth: '400px', borderRadius: '16px' }}>
                    <h2 className="section-title" style={{ marginBottom: '2rem', textAlign: 'center' }}>Admin Login</h2>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>User ID</label>
                            <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Enter User ID"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                style={{ width: '100%' }}
                            />
                        </div>
                        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
                        <button type="button" className="btn-text" onClick={onBack} style={{ textAlign: 'center', display: 'block', margin: '1rem auto 0' }}>Back to Home</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboardbox" style={{ padding: '120px 5% 2rem', minHeight: '100vh', background: 'var(--color-bg)' }}>
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ margin: 0 }}>Admin Dashboard</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={fetchRegistrations} className="btn-text" style={{ padding: '0.5rem 1rem' }}>🔄 Refresh</button>
                    <button onClick={() => setIsAuthenticated(false)} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Logout</button>
                </div>
            </div>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>{totalRegistrations}</h3>
                    <p>Total Registrations</p>
                </div>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', color: '#f39c12' }}>{pendingTeams}</h3>
                    <p>Pending Verification</p>
                </div>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', color: '#2ecc71' }}>{paidTeams}</h3>
                    <p>Verified Paid</p>
                </div>
                <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', color: '#f1c40f' }}>₹{paidRegistrations.reduce((acc, curr) => acc + (curr.payment_amount || 0), 0)}</h3>
                    <p>Total Revenue</p>
                </div>
            </div>

            <div className="glass" style={{ padding: '2rem', overflowX: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>Recent Registrations (Click View)</h3>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <select
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'var(--font-main)' }}
                        >
                            {allEvents.map(evt => (
                                <option key={evt} value={evt}>Filter: {evt}</option>
                            ))}
                        </select>
                        <button
                            onClick={downloadCSV}
                            className="btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            📥 Download CSV
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', padding: '2rem' }}>Loading registrations...</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid rgba(139, 90, 43, 0.2)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Entry Code</th>
                                <th style={{ padding: '1rem' }}>Team Name</th>
                                <th style={{ padding: '1rem' }}>Event</th>
                                <th style={{ padding: '1rem' }}>Leader</th>
                                <th style={{ padding: '1rem' }}>Contact</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegistrations.map((reg) => (
                                <tr
                                    key={reg.id}
                                    style={{ borderBottom: '1px solid rgba(139, 90, 43, 0.1)', cursor: 'pointer', transition: 'background 0.2s' }}
                                    onClick={() => setSelectedRegistration(reg)}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--color-primary)' }}>{reg.id.substring(0, 8).toUpperCase()}</td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{reg.team_name}</td>
                                    <td style={{ padding: '1rem' }}>{reg.event_name}</td>
                                    <td style={{ padding: '1rem' }}>{reg.leader_name}</td>
                                    <td style={{ padding: '1rem' }}>{reg.leader_contact}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '4px',
                                            background: reg.status === 'Paid' ? '#d4edda' : (reg.status === 'Pending' ? '#fff3cd' : '#f8d7da'),
                                            color: reg.status === 'Paid' ? '#155724' : (reg.status === 'Pending' ? '#856404' : '#721c24'),
                                            fontSize: '0.9rem'
                                        }}>
                                            {reg.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={(e) => deleteRegistration(reg.id, e)}
                                            style={{
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                            title="Delete Registration"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredRegistrations.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>No registrations found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <button className="btn-text" onClick={onBack} style={{ marginTop: '2rem' }}>← Back to Website</button>

            {/* Registration Details Modal */}
            {selectedRegistration && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000
                }} onClick={() => setSelectedRegistration(null)}>
                    <div className="glass" style={{ padding: '2rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', background: 'var(--color-bg)' }} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedRegistration(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                            ✕
                        </button>

                        <h2 className="section-title" style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem' }}>Registration Details</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                color: 'white',
                                textAlign: 'center',
                                marginBottom: '1rem'
                            }}>
                                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>Entry Code</div>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    fontFamily: 'monospace',
                                    letterSpacing: '3px'
                                }}>
                                    {selectedRegistration.id.substring(0, 8).toUpperCase()}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div><strong>Team Name:</strong> {selectedRegistration.team_name}</div>
                                <div><strong>Event:</strong> {selectedRegistration.event_name}</div>
                                <div><strong>Leader:</strong> {selectedRegistration.leader_name}</div>
                                <div><strong>Contact:</strong> {selectedRegistration.leader_contact}</div>
                                <div><strong>Email:</strong> {selectedRegistration.leader_email}</div>
                                <div><strong>College:</strong> {selectedRegistration.college}</div>
                                <div><strong>Status:</strong> {selectedRegistration.status}</div>
                                {selectedRegistration.status_note && (
                                    <div style={{ gridColumn: '1 / span 2', color: '#e74c3c' }}>
                                        <strong>Reason:</strong> {selectedRegistration.status_note}
                                    </div>
                                )}
                            </div>

                            <div><strong>Team Members ({selectedRegistration.team_size})</strong></div>
                            <ul style={{ paddingLeft: '1.2rem', marginTop: 0 }}>
                                {selectedRegistration.team_members && selectedRegistration.team_members.map((member, index) => (
                                    <li key={index}>{member}</li>
                                ))}
                                {(!selectedRegistration.team_members || selectedRegistration.team_members.length === 0) && (
                                    <li>(Solo / No other members listed)</li>
                                )}
                            </ul>

                            <div><strong>Payment ID:</strong> {selectedRegistration.payment_id}</div>
                            {selectedRegistration.payment_screenshot_url && (
                                <div style={{ marginTop: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Payment Screenshot:</label>
                                    <a href={selectedRegistration.payment_screenshot_url} target="_blank" rel="noreferrer">
                                        <img
                                            src={selectedRegistration.payment_screenshot_url}
                                            alt="Payment Proof"
                                            style={{ width: '100%', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
                                        />
                                    </a>
                                </div>
                            )}
                            <div><strong>Registration ID:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedRegistration.id}</span></div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                            {selectedRegistration.status !== 'Paid' && (
                                <button
                                    className="btn-primary"
                                    style={{ flex: '1 1 45%', background: '#27ae60', borderColor: '#27ae60' }}
                                    onClick={() => updateRegistrationStatus(selectedRegistration.id, 'Paid')}
                                >
                                    ✅ Approve Payment
                                </button>
                            )}
                            {selectedRegistration.status !== 'Rejected' && (
                                <button
                                    className="btn-primary"
                                    style={{ flex: '1 1 45%', background: '#e67e22', borderColor: '#e67e22' }}
                                    onClick={() => {
                                        const reason = prompt("Enter rejection reason (e.g. Transaction ID Mismatch, Payment Amount Incorrect):", "Transaction ID Mismatch");
                                        if (reason) updateRegistrationStatus(selectedRegistration.id, 'Rejected', reason);
                                    }}
                                >
                                    ❌ Reject
                                </button>
                            )}
                            <button
                                className="btn-primary"
                                style={{ flex: '1 1 45%', background: '#dc3545', borderColor: '#dc3545' }}
                                onClick={() => deleteRegistration(selectedRegistration.id)}
                            >
                                🗑️ Delete
                            </button>
                            <button className="btn-primary" style={{ flex: '1 1 45%' }} onClick={() => setSelectedRegistration(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
