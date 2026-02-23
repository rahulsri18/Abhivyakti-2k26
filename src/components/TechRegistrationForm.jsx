import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import paymentQr from '../assets/payment_qr.jpg';

const TechRegistrationForm = ({ eventDetails, onClose }) => {
    const [step, setStep] = useState(1); // 1: Team Details, 2: Member Details, 3: Payment, 4: Success
    const [loading, setLoading] = useState(false);
    const upiId = "shriramswaroopmimca.70502106@hdfcbank";

    // Step 1: Team Leader & Basic Info
    const [teamDetails, setTeamDetails] = useState({
        teamName: '',
        teamSize: eventDetails?.minSize || 1, // Default to min size
        leaderName: '',
        leaderEmail: '',
        leaderPhone: '',
        leaderCollege: '',
    });

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
        screenshot: null
    });
    const [uploading, setUploading] = useState(false);

    // Validation State
    const [errors, setErrors] = useState({});

    const getNumericFee = () => {
        if (!eventDetails?.entryFee) return 150;
        const numeric = eventDetails.entryFee.replace(/[^0-9]/g, '');
        return numeric ? parseInt(numeric) : 150;
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

            console.log("Checking Email:", teamDetails.leaderEmail);
            const { data, error } = await supabase
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

        const timer = setTimeout(checkEmail, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [teamDetails.leaderEmail, eventDetails.title]);

    // Validation Effect for Phone
    useEffect(() => {
        const checkPhone = async () => {
            if (!teamDetails.leaderPhone || teamDetails.leaderPhone.length < 10) {
                setErrors(prev => ({ ...prev, leaderPhone: null }));
                return;
            }

            console.log("Checking Phone:", teamDetails.leaderPhone);
            const { data, error } = await supabase
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

        return () => clearTimeout(timer);
    }, [teamDetails.leaderPhone, eventDetails.title]);

    // Member Validation
    useEffect(() => {
        const validateMember = async () => {
            if (!currentMember.email || !currentMember.phone || currentMember.phone.length < 10) {
                setErrors(prev => ({ ...prev, memberEmail: null, memberPhone: null }));
                return;
            }

            // 1. Check local
            const isLocalDuplicateEmail = teamDetails.leaderEmail === currentMember.email || members.some(m => m.email === currentMember.email);
            const isLocalDuplicatePhone = teamDetails.leaderPhone === currentMember.phone || members.some(m => m.phone === currentMember.phone);

            if (isLocalDuplicateEmail) {
                setErrors(prev => ({ ...prev, memberEmail: 'Already in team.' }));
                return;
            }
            if (isLocalDuplicatePhone) {
                setErrors(prev => ({ ...prev, memberPhone: 'Already in team.' }));
                return;
            }

            // 2. Check DB
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
                memberEmail: emailData ? 'Already registered as leader.' : null,
                memberPhone: phoneData ? 'Already registered as leader.' : null
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

    // Move directly to Member details
    const goToMembers = (e) => {
        e.preventDefault();

        if (errors.leaderEmail || errors.leaderPhone) {
            alert("Please fix the errors before proceeding.");
            return;
        }

        if (teamDetails.teamSize < 1) {
            alert("Team size must be at least 1");
            return;
        }
        setStep(2);
    };

    // Add a member and reset form, or finish if all members added
    const addMember = (e) => {
        e.preventDefault();

        if (errors.memberEmail || errors.memberPhone) {
            alert("Please fix member errors.");
            return;
        }

        const newMembers = [...members, currentMember];
        setMembers(newMembers);

        if (newMembers.length >= parseInt(teamDetails.teamSize)) {
            setStep(3); // Go to Payment
        } else {
            // Reset current member form for next entry
            setCurrentMember({
                name: '',
                email: '',
                phone: '',
                college: ''
            });
        }
    };

    const submitRegistration = async () => {
        setLoading(true);

        const formattedMembers = members.map(m =>
            `${m.name} | ${m.email} | ${m.phone} | ${m.college}`
        );

        // Construct final payload
        let screenshotUrl = '';
        if (paymentDetails.screenshot) {
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

        const payload = {
            team_name: teamDetails.teamName,
            event_category: 'Tech Events',
            event_name: eventDetails.title,
            leader_name: teamDetails.leaderName,
            leader_contact: teamDetails.leaderPhone,
            leader_email: teamDetails.leaderEmail,
            college: teamDetails.leaderCollege,
            team_size: parseInt(teamDetails.teamSize),
            team_members: formattedMembers,
            payment_amount: getNumericFee(),
            payment_id: paymentDetails.txnId,
            payment_screenshot_url: screenshotUrl,
            status: 'Pending'
        };

        console.log("Submitting Tech Registration:", payload);

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
                <p>Team <b>{teamDetails.teamName}</b> is registered for <b>{eventDetails.title}</b>.</p>
                <p>We will verify your payment of <b>{eventDetails.entryFee}</b> and contact you.</p>
                <button className="btn-primary" onClick={onClose}>Close</button>
            </div>
        );
    }

    return (
        <div className="registration-modal-overlay">
            <div className="registration-modal glass" style={{ maxWidth: '600px' }}>
                <button className="close-btn" onClick={onClose}>&times;</button>

                {/* Progress Indicator */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '1rem' }}>
                    <span style={{ fontWeight: step === 1 ? 'bold' : 'normal', opacity: step === 1 ? 1 : 0.6 }}>1. Details</span>
                    <span style={{ fontWeight: step === 2 ? 'bold' : 'normal', opacity: step === 2 ? 1 : 0.6 }}>2. Members ({members.length}/{teamDetails.teamSize})</span>
                    <span style={{ fontWeight: step === 3 ? 'bold' : 'normal', opacity: step === 3 ? 1 : 0.6 }}>3. Payment</span>
                </div>

                <h2 className="font-accent" style={{ marginBottom: '1.5rem' }}>{eventDetails.title} Registration</h2>

                {/* STEP 1: TEAM DETAILS */}
                {step === 1 && (
                    <form onSubmit={goToMembers} className="reg-form">
                        <div className="form-group">
                            <label>Team Name</label>
                            <input type="text" name="teamName" required placeholder="The Innovators" value={teamDetails.teamName} onChange={handleTeamChange} />
                        </div>

                        <div className="form-group row" style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label>Team Size</label>
                                <select name="teamSize" value={teamDetails.teamSize} onChange={handleTeamChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: 'none' }}>
                                    {[...Array(5)].map((_, i) => ( // Arbitrary max 5, typical for robotics
                                        <option key={i + 1} value={i + 1}>{i + 1} Member{i > 0 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <h4 style={{ margin: '1rem 0 0.5rem', color: 'var(--color-primary)' }}>Team Leader Details</h4>

                        <div className="form-group">
                            <label>Leader Name</label>
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
                            <input type="text" name="leaderCollege" required placeholder="Details" value={teamDetails.leaderCollege} onChange={handleTeamChange} />
                        </div>

                        <button type="submit" className="btn-primary submit-btn" disabled={!!errors.leaderEmail || !!errors.leaderPhone}>Continue to Members →</button>
                    </form>
                )}

                {/* STEP 2: MEMBER DETAILS */}
                {step === 2 && (
                    <form onSubmit={addMember} className="reg-form">
                        <h3 style={{ marginBottom: '1rem' }}>Member #{members.length + 1} Details</h3>

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
                            {members.length + 1 >= parseInt(teamDetails.teamSize) ? 'Finish Adding & Proceed to Payment' : 'Add Member & Next'}
                        </button>
                    </form>
                )}

                {/* STEP 3: PAYMENT */}
                {step === 3 && (
                    <div className="payment-step">
                        <h3 className="font-accent">Payment</h3>
                        <div className="glass" style={{ padding: '1.5rem', margin: '1.5rem 0', textAlign: 'center' }}>
                            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Entry Fee: <b>{eventDetails.entryFee}</b></p>

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
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechRegistrationForm;
