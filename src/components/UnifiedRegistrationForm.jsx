import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import paymentQr from '../assets/payment_qr.jpg';

const UnifiedRegistrationForm = ({ eventDetails, category, onClose }) => {
    const [step, setStep] = useState(1); // 1: Team Details, 2: Member Details, 3: Payment, 4: Success
    const [loading, setLoading] = useState(false);

    // Check if event is free
    const isFreeEvent = eventDetails?.entryFee?.toLowerCase().includes('free') || eventDetails?.entryFee === 'Free';

    // Step 1: Team Leader & Basic Info
    const upiId = "shriramswaroopmimca.70502106@hdfcbank";
    const [teamDetails, setTeamDetails] = useState({
        teamName: '',
        teamSize: eventDetails?.minSize || 1,
        preferredDate: '',
        preferredTime: '', // New field for time slot
        leaderName: '',
        leaderEmail: '',
        leaderPhone: '',
        leaderCollege: '',
    });

    const isMultiDay = eventDetails?.date?.includes('18') && eventDetails?.date?.includes('19');
    const timeSlots = eventDetails?.duration ? eventDetails.duration.split('&').map(s => s.trim()) : [];

    useEffect(() => {
        // Handle Date Logic
        if (isMultiDay) {
            setTeamDetails(prev => ({ ...prev, preferredDate: 'Feb 18' }));
        } else {
            if (eventDetails?.date?.includes('18')) setTeamDetails(prev => ({ ...prev, preferredDate: 'Feb 18' }));
            else if (eventDetails?.date?.includes('19')) setTeamDetails(prev => ({ ...prev, preferredDate: 'Feb 19' }));
        }

        // Handle Time Slot Logic
        if (timeSlots.length > 0) {
            setTeamDetails(prev => ({ ...prev, preferredTime: timeSlots[0] }));
        }
    }, [eventDetails, isMultiDay]);

    // Step 2: Members List
    const [members, setMembers] = useState([]);
    const [currentMember, setCurrentMember] = useState({
        name: '',
        email: '',
        phone: '',
        college: ''
    });

    // Step 3: Payment
    const [paymentDetails, setPaymentDetails] = useState({
        txnId: '',
        screenshot: null,
        screenshotUrl: ''
    });
    const [uploading, setUploading] = useState(false);

    // Validation State
    const [errors, setErrors] = useState({});

    const getNumericFee = () => {
        if (eventDetails?.entryFee) {
            const isPerPerson = eventDetails.entryFee.toLowerCase().includes('per person') ||
                eventDetails.entryFee.toLowerCase().includes('per head');

            if (!eventDetails.entryFee.includes('-') || isPerPerson) {
                const baseFee = parseInt(eventDetails.entryFee.replace(/[^\d]/g, ''));
                if (!isNaN(baseFee)) {
                    return isPerPerson ? baseFee * parseInt(teamDetails.teamSize) : baseFee;
                }
            }
        }

        const size = parseInt(teamDetails.teamSize);
        if (size === 1) return 100;
        if (size === 2) return 150;
        return 200;
    };

    const handleTeamChange = (e) => {
        setTeamDetails({ ...teamDetails, [e.target.name]: e.target.value });
    };

    // Validation Effect for Email
    useEffect(() => {
        const checkEmail = async () => {
            if (!teamDetails.leaderEmail || !teamDetails.leaderEmail.includes('@')) {
                setErrors(prev => ({ ...prev, leaderEmail: null }));
                return;
            }

            const { data } = await supabase
                .from('registrations')
                .select('id')
                .eq('event_name', eventDetails.title)
                .eq('leader_email', teamDetails.leaderEmail)
                .maybeSingle();

            if (data) {
                setErrors(prev => ({ ...prev, leaderEmail: 'This email is already registered for this event.' }));
            } else {
                setErrors(prev => ({ ...prev, leaderEmail: null }));
            }
        };

        const timer = setTimeout(checkEmail, 500);
        return () => clearTimeout(timer);
    }, [teamDetails.leaderEmail, eventDetails.title]);

    // Validation Effect for Phone
    useEffect(() => {
        const checkPhone = async () => {
            if (!teamDetails.leaderPhone || teamDetails.leaderPhone.length < 10) {
                setErrors(prev => ({ ...prev, leaderPhone: null }));
                return;
            }

            const { data } = await supabase
                .from('registrations')
                .select('id')
                .eq('event_name', eventDetails.title)
                .eq('leader_contact', teamDetails.leaderPhone)
                .maybeSingle();

            if (data) {
                setErrors(prev => ({ ...prev, leaderPhone: 'This phone number is already registered for this event.' }));
            } else {
                setErrors(prev => ({ ...prev, leaderPhone: null }));
            }
        };

        const timer = setTimeout(checkPhone, 500);
        return () => clearTimeout(timer);
    }, [teamDetails.leaderPhone, eventDetails.title]);

    // Member Validation
    useEffect(() => {
        const validateMember = async () => {
            if (!currentMember.email || !currentMember.phone || currentMember.phone.length < 10) {
                setErrors(prev => ({ ...prev, memberEmail: null, memberPhone: null }));
                return;
            }

            // 1. Check if already in current team (local)
            const isLocalDuplicateEmail = teamDetails.leaderEmail === currentMember.email || members.some(m => m.email === currentMember.email);
            const isLocalDuplicatePhone = teamDetails.leaderPhone === currentMember.phone || members.some(m => m.phone === currentMember.phone);

            if (isLocalDuplicateEmail) {
                setErrors(prev => ({ ...prev, memberEmail: 'This email is already added to your team.' }));
                return;
            }
            if (isLocalDuplicatePhone) {
                setErrors(prev => ({ ...prev, memberPhone: 'This phone number is already added to your team.' }));
                return;
            }

            // 2. Check against DB (Leaders of other teams)
            const { data: emailData } = await supabase
                .from('registrations')
                .select('id')
                .eq('event_name', eventDetails.title)
                .eq('leader_email', currentMember.email)
                .maybeSingle();

            const { data: phoneData } = await supabase
                .from('registrations')
                .select('id')
                .eq('event_name', eventDetails.title)
                .eq('leader_contact', currentMember.phone)
                .maybeSingle();

            setErrors(prev => ({
                ...prev,
                memberEmail: emailData ? 'This person is already registered as a leader for this event.' : null,
                memberPhone: phoneData ? 'This person is already registered as a leader for this event.' : null
            }));
        };

        const timer = setTimeout(validateMember, 500);
        return () => clearTimeout(timer);
    }, [currentMember.email, currentMember.phone, members, teamDetails.leaderEmail, teamDetails.leaderPhone, eventDetails.title]);

    const handleMemberChange = (e) => {
        setCurrentMember({ ...currentMember, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (e) => {
        if (e.target.name === 'screenshot') {
            setPaymentDetails({ ...paymentDetails, screenshot: e.target.files[0] });
        } else {
            setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
        }
    };

    const goToMembers = (e) => {
        e.preventDefault();
        if (errors.leaderEmail || errors.leaderPhone) {
            alert("Please fix the errors before proceeding.");
            return;
        }
        if (parseInt(teamDetails.teamSize) > 1) {
            setStep(2);
        } else {
            // For free events, submit directly; otherwise go to payment
            if (isFreeEvent) {
                submitRegistration();
            } else {
                setStep(3);
            }
        }
    };

    const addMember = (e) => {
        e.preventDefault();

        if (errors.memberEmail || errors.memberPhone) {
            alert("Please fix the member contact errors before adding.");
            return;
        }

        const newMembers = [...members, currentMember];
        setMembers(newMembers);

        if (newMembers.length >= parseInt(teamDetails.teamSize) - 1) {
            // For free events, submit directly; otherwise go to payment
            if (isFreeEvent) {
                submitRegistration();
            } else {
                setStep(3); // Go to Payment
            }
        } else {
            setCurrentMember({
                name: '',
                email: '',
                phone: '',
                college: ''
            });
        }
    };

    const [generatedCode, setGeneratedCode] = useState(null);

    const submitRegistration = async () => {
        setLoading(true);
        const formattedMembers = members.map(m =>
            `${m.name} | ${m.email} | ${m.phone} | ${m.college}`
        );

        let screenshotUrl = '';
        // Only upload screenshot if not a free event
        if (!isFreeEvent && paymentDetails.screenshot) {
            setUploading(true);
            const fileExt = paymentDetails.screenshot.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('payment-screenshots')
                .upload(filePath, paymentDetails.screenshot);

            if (uploadError) {
                alert("Screenshot upload failed: " + uploadError.message);
                setLoading(false);
                setUploading(false);
                return;
            }

            const { data: urlData } = supabase.storage
                .from('payment-screenshots')
                .getPublicUrl(filePath);

            screenshotUrl = urlData.publicUrl;
        }

        // Generate Special Code for Packages
        let finalTeamName = (parseInt(teamDetails.teamSize) > 1 ? teamDetails.teamName : `Solo - ${teamDetails.leaderName}`) +
            (teamDetails.preferredDate ? ` (${teamDetails.preferredDate})` : '') +
            (teamDetails.preferredTime ? ` [${teamDetails.preferredTime}]` : '');

        let specialCode = null;
        if (category === 'Event Package') {
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            specialCode = `ABH-PKG-${randomCode}`;
            finalTeamName = `[${specialCode}] ${teamDetails.leaderName}`;
            setGeneratedCode(specialCode);
        }

        const payload = {
            team_name: finalTeamName,
            event_category: category,
            event_name: eventDetails.title,
            leader_name: teamDetails.leaderName,
            leader_contact: teamDetails.leaderPhone,
            leader_email: teamDetails.leaderEmail,
            college: teamDetails.leaderCollege,
            team_size: parseInt(teamDetails.teamSize),
            team_members: formattedMembers,
            payment_amount: isFreeEvent ? 0 : getNumericFee(),
            payment_id: isFreeEvent ? 'FREE_EVENT' : paymentDetails.txnId,
            payment_screenshot_url: screenshotUrl,
            status: isFreeEvent ? 'Approved' : 'Pending'
        };

        const { error } = await supabase.from('registrations').insert([payload]);

        if (error) {
            console.error('Error inserting data:', error);
            alert("Registration failed: " + error.message);
            setLoading(false);
            return;
        }

        setTimeout(() => {
            setLoading(false);
            setStep(4); // Success
        }, 1500);
    };

    if (step === 4) {
        return (
            <div className="registration-success glass">
                <div className="success-icon">✅</div>
                <h2>Registration Successful!</h2>
                {generatedCode && (
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Your Unique Package Code:</p>
                        <h3 style={{ fontSize: '1.8rem', color: '#f1c40f', letterSpacing: '2px' }}>{generatedCode}</h3>
                        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Please save this code for your reference.</p>
                    </div>
                )}
                <p>{parseInt(teamDetails.teamSize) > 1 ? `Team ${teamDetails.teamName}` : teamDetails.leaderName} is registered for <b>{eventDetails.title}</b>.</p>
                {isFreeEvent ? (
                    <p>Your registration has been confirmed. See you at the event!</p>
                ) : (
                    <p>We will verify your payment and contact you soon.</p>
                )}
                <button className="btn-primary" onClick={onClose}>Close</button>
            </div>
        );
    }

    return (
        <div className="registration-modal-overlay">
            <div className="registration-modal glass" style={{ maxWidth: '600px' }}>
                <button className="close-btn" onClick={onClose}>&times;</button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '1rem' }}>
                    <span style={{ fontWeight: step === 1 ? 'bold' : 'normal', opacity: step === 1 ? 1 : 0.6 }}>1. Details</span>
                    {parseInt(teamDetails.teamSize) > 1 && (
                        <span style={{ fontWeight: step === 2 ? 'bold' : 'normal', opacity: step === 2 ? 1 : 0.6 }}>2. Members ({members.length}/{parseInt(teamDetails.teamSize) - 1})</span>
                    )}
                    {!isFreeEvent && (
                        <span style={{ fontWeight: step === 3 ? 'bold' : 'normal', opacity: step === 3 ? 1 : 0.6 }}>{parseInt(teamDetails.teamSize) > 1 ? '3. Payment' : '2. Payment'}</span>
                    )}
                </div>

                <h2 className="font-accent" style={{ marginBottom: '1.5rem' }}>{eventDetails.title} Registration</h2>

                {step === 1 && (
                    <form onSubmit={goToMembers} className="reg-form">
                        {parseInt(teamDetails.teamSize) > 1 && (
                            <div className="form-group">
                                <label>Team Name</label>
                                <input type="text" name="teamName" required placeholder="The Innovators" value={teamDetails.teamName} onChange={handleTeamChange} />
                            </div>
                        )}

                        {isMultiDay && (
                            <div className="form-group" style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '8px' }}>
                                <label style={{ marginBottom: '0.8rem', display: 'block' }}><b>Select Registration Date</b></label>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="preferredDate"
                                            value="Feb 18"
                                            checked={teamDetails.preferredDate === 'Feb 18'}
                                            onChange={handleTeamChange}
                                            required
                                        /> Feb 18th
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="preferredDate"
                                            value="Feb 19"
                                            checked={teamDetails.preferredDate === 'Feb 19'}
                                            onChange={handleTeamChange}
                                            required
                                        /> Feb 19th
                                    </label>
                                </div>
                            </div>
                        )}

                        {timeSlots.length > 1 ? (
                            <div className="form-group" style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                                <label style={{ marginBottom: '0.8rem', display: 'block' }}><b>Select Time Slot</b></label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {timeSlots.map((slot, idx) => (
                                        <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="preferredTime"
                                                value={slot}
                                                checked={teamDetails.preferredTime === slot}
                                                onChange={handleTeamChange}
                                                required
                                            /> {slot}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ) : timeSlots.length === 1 && (
                            <div className="form-group" style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', marginTop: '1rem', opacity: 0.8 }}>
                                <p style={{ fontSize: '0.9rem', margin: 0 }}><b>Time Slot:</b> {timeSlots[0]}</p>
                            </div>
                        )}

                        {category !== 'Event Package' && (
                            <div className="form-group">
                                <label>Team Size (Min: {eventDetails.minSize}, Max: {eventDetails.maxSize})</label>
                                <input
                                    type="number"
                                    name="teamSize"
                                    min={eventDetails.minSize}
                                    max={eventDetails.maxSize}
                                    required
                                    value={teamDetails.teamSize}
                                    onChange={handleTeamChange}
                                />
                            </div>
                        )}

                        <h4 style={{ margin: '1rem 0 0.5rem', color: 'var(--color-primary)' }}>{parseInt(teamDetails.teamSize) > 1 ? 'Team Leader Details' : 'Participant Details'}</h4>

                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="leaderName" required placeholder="Full Name" value={teamDetails.leaderName} onChange={handleTeamChange} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="leaderEmail"
                                required
                                placeholder="leader@example.com"
                                value={teamDetails.leaderEmail}
                                onChange={handleTeamChange}
                                style={{ borderColor: errors.leaderEmail ? 'red' : 'inherit' }}
                            />
                            {errors.leaderEmail && <small style={{ color: 'red', marginTop: '0.2rem', display: 'block' }}>{errors.leaderEmail}</small>}
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="leaderPhone"
                                required
                                placeholder="+91..."
                                value={teamDetails.leaderPhone}
                                onChange={handleTeamChange}
                                style={{ borderColor: errors.leaderPhone ? 'red' : 'inherit' }}
                            />
                            {errors.leaderPhone && <small style={{ color: 'red', marginTop: '0.2rem', display: 'block' }}>{errors.leaderPhone}</small>}
                        </div>
                        <div className="form-group">
                            <label>College Name</label>
                            <input type="text" name="leaderCollege" required placeholder="College" value={teamDetails.leaderCollege} onChange={handleTeamChange} />
                        </div>

                        <button type="submit" className="btn-primary submit-btn" disabled={!!errors.leaderEmail || !!errors.leaderPhone}>
                            {parseInt(teamDetails.teamSize) > 1 ? 'Continue to Members →' : (isFreeEvent ? 'Complete Registration →' : 'Proceed to Payment →')}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={addMember} className="reg-form">
                        <h3 style={{ marginBottom: '1rem' }}>Member #{members.length + 2} Details</h3>

                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" required placeholder="Member Name" value={currentMember.name} onChange={handleMemberChange} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" required placeholder="member@example.com" value={currentMember.email} onChange={handleMemberChange} style={{ borderColor: errors.memberEmail ? 'red' : 'inherit' }} />
                            {errors.memberEmail && <small style={{ color: 'red', display: 'block' }}>{errors.memberEmail}</small>}
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phone" required placeholder="+91..." value={currentMember.phone} onChange={handleMemberChange} style={{ borderColor: errors.memberPhone ? 'red' : 'inherit' }} />
                            {errors.memberPhone && <small style={{ color: 'red', display: 'block' }}>{errors.memberPhone}</small>}
                        </div>
                        <div className="form-group">
                            <label>College Name</label>
                            <input type="text" name="college" required placeholder="College" value={currentMember.college} onChange={handleMemberChange} />
                        </div>

                        <button type="submit" className="btn-primary submit-btn" disabled={!!errors.memberEmail || !!errors.memberPhone}>
                            {members.length + 2 >= parseInt(teamDetails.teamSize) ? (isFreeEvent ? 'Finish & Complete Registration' : 'Finish Adding & Proceed to Payment') : 'Add Member & Next'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div className="payment-step">
                        <h3 className="font-accent">Payment</h3>
                        <div className="glass" style={{ padding: '1.5rem', margin: '1.5rem 0', textAlign: 'center' }}>
                            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Registration Fee: <b>₹{getNumericFee()}</b></p>

                            {/* Dynamic QR Code */}
                            <div className="qr-container" style={{ margin: '1rem 0', background: 'white', padding: '10px', display: 'inline-block', borderRadius: '12px' }}>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=SHRI RAMSWAROOP M I M C A&am=${getNumericFee()}&cu=INR`)}`}
                                    alt="UPI QR Code"
                                    style={{ width: '220px', height: '220px', display: 'block' }}
                                />
                            </div>

                            <p style={{ margin: '0.5rem 0' }}>Scan QR to Pay <b>₹{getNumericFee()}</b></p>
                            <p style={{ fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 'bold', letterSpacing: '1px' }}>SHRI RAMSWAROOP M I M C A</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0.8rem' }}>
                                <small style={{ opacity: 0.8, background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>UPI ID: {upiId}</small>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(upiId);
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
                        </div>

                        <div className="form-group">
                            <label>Transaction ID / UTR Number</label>
                            <input type="text" name="txnId" required placeholder="Enter 12-digit UPI Ref ID" value={paymentDetails.txnId} onChange={handlePaymentChange} />
                        </div>

                        <div className="form-group">
                            <label>Upload Payment Screenshot</label>
                            <input
                                type="file"
                                name="screenshot"
                                accept="image/*"
                                required
                                onChange={handlePaymentChange}
                                style={{ padding: '10px' }}
                            />
                        </div>

                        <button className="btn-primary submit-btn" onClick={submitRegistration} disabled={loading || uploading || !paymentDetails.txnId || !paymentDetails.screenshot}>
                            {loading || uploading ? 'Uploading & Registering...' : 'Complete Registration'}
                        </button>
                        <button className="btn-text" onClick={() => setStep(parseInt(teamDetails.teamSize) > 1 ? 2 : 1)} style={{ marginTop: '0.5rem', width: '100%' }}>
                            Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnifiedRegistrationForm;
