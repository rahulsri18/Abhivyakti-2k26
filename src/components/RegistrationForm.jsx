import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import paymentQr from '../assets/payment_qr.jpg';

const RegistrationForm = ({ eventDetails, category, onClose }) => {
    const [step, setStep] = useState('details'); // details, payment, success
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        teamName: '',
        email: '',
        phone: '',
        college: '',
        teamSize: eventDetails?.minSize || 1,
        teamMembers: '',
        txnId: '',
        event: eventDetails?.title || 'Event',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        setStep('payment');
    };

    const handlePaymentSubmit = async () => {
        if (!formData.txnId) {
            alert("Please enter a Transaction ID");
            return;
        }

        setLoading(true);

        // Prepare data for Supabase
        const { data, error } = await supabase
            .from('registrations')
            .insert([
                {
                    team_name: formData.teamSize > 1 ? formData.teamName : `Solo - ${formData.name}`,
                    event_category: category,
                    event_name: eventDetails.title,
                    leader_name: formData.name,
                    leader_contact: formData.phone,
                    leader_email: formData.email,
                    college: formData.college,
                    team_size: parseInt(formData.teamSize),
                    team_members: formData.teamSize > 1 ? formData.teamMembers.split(',').map(s => s.trim()) : [],
                    payment_id: formData.txnId,
                    status: 'Paid' // Assuming paid since they entered Txn ID
                }
            ]);

        setLoading(false);

        if (error) {
            console.error('Error inserting data:', error);
            alert("Registration failed: " + error.message);
        } else {
            setStep('success');
        }
    };

    if (step === 'success') {
        return (
            <div className="registration-success glass">
                <div className="success-icon">✅</div>
                <h2>Registration Successful!</h2>
                <p>Thank you, <b>{formData.name}</b>!</p>
                <p>You have successfully registered for <b>{eventDetails.title}</b>.</p>
                <p><b>We will verify your payment and contact you soon.</b></p>
                <button className="btn-primary" onClick={onClose}>Back to Home</button>
            </div>
        );
    }

    return (
        <div className="registration-modal-overlay">
            <div className="registration-modal glass">
                <button className="close-btn" onClick={onClose}>&times;</button>

                {step === 'details' && (
                    <>
                        <h2 className="font-accent">Register for {eventDetails.title}</h2>
                        <form onSubmit={handleDetailsSubmit} className="reg-form">
                            <div className="form-group">
                                <label>Team Leader / Participant Name</label>
                                <input type="text" name="name" required placeholder="John Doe" onChange={handleChange} value={formData.name} />
                            </div>

                            {parseInt(formData.teamSize) > 1 && (
                                <div className="form-group">
                                    <label>Team Name</label>
                                    <input type="text" name="teamName" required placeholder="The Rockstars" onChange={handleChange} value={formData.teamName} />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" required placeholder="john@example.com" onChange={handleChange} value={formData.email} />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" name="phone" required placeholder="+91 1234567890" onChange={handleChange} value={formData.phone} />
                            </div>
                            <div className="form-group">
                                <label>College Name</label>
                                <input type="text" name="college" required placeholder="XYZ" onChange={handleChange} value={formData.college} />
                            </div>

                            <div className="form-group">
                                <label>Team Size (Min: {eventDetails.minSize}, Max: {eventDetails.maxSize})</label>
                                <input
                                    type="number"
                                    name="teamSize"
                                    min={eventDetails.minSize}
                                    max={eventDetails.maxSize}
                                    required
                                    onChange={handleChange}
                                    value={formData.teamSize}
                                />
                            </div>

                            {parseInt(formData.teamSize) > 1 && (
                                <div className="form-group">
                                    <label>Team Members Names</label>
                                    <textarea
                                        name="teamMembers"
                                        required
                                        placeholder="Enter names of all team members (comma separated)"
                                        onChange={handleChange}
                                        value={formData.teamMembers}
                                        rows="3"
                                        style={{
                                            padding: '0.8rem 1rem',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            background: 'rgba(255,255,255,0.8)',
                                            fontFamily: 'var(--font-main)'
                                        }}
                                    />
                                </div>
                            )}

                            <button type="submit" className="btn-primary submit-btn">Proceed to Payment</button>
                        </form>
                    </>
                )}

                {step === 'payment' && (
                    <div className="payment-step">
                        <h2 className="font-accent">Payment Details</h2>
                        <p style={{ marginBottom: '1rem' }}>Registration Fee: <b>₹150</b></p>

                        <div className="qr-container glass" style={{ margin: '1rem 0', background: 'white', padding: '10px', display: 'inline-block', borderRadius: '12px' }}>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=shriramswaroopmimca.70502106@hdfcbank&pn=SHRI RAMSWAROOP M I M C A&am=150&cu=INR`)}`}
                                alt="UPI QR Code"
                                style={{ width: '220px', height: '220px', display: 'block' }}
                            />
                        </div>
                        <p style={{ margin: '0.5rem 0' }}>Scan QR to Pay</p>
                        <p style={{ fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 'bold', letterSpacing: '1px' }}>SHRI RAMSWAROOP M I M C A</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0.8rem' }}>
                            <small style={{ opacity: 0.8, background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>UPI ID: shriramswaroopmimca.70502106@hdfcbank</small>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText('shriramswaroopmimca.70502106@hdfcbank');
                                    alert("UPI ID copied to clipboard!");
                                }}
                                style={{
                                    background: 'var(--color-primary)',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 10px',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontWeight: '600'
                                }}
                            >
                                Copy
                            </button>
                        </div>

                        <div className="form-group" style={{ marginTop: '1.5rem' }}>
                            <label>Transaction ID (Reference)</label>
                            <input type="text" name="txnId" required placeholder="Enter UPI Ref ID" onChange={handleChange} value={formData.txnId} />
                        </div>

                        <button className="btn-primary submit-btn" onClick={handlePaymentSubmit} disabled={loading}>
                            {loading ? 'Processing...' : 'Confirm Payment'}
                        </button>
                        <button className="btn-text" onClick={() => setStep('details')} style={{ marginTop: '0.5rem', width: '100%' }}>
                            Back to Details
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistrationForm;
