import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw, Coffee, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

import './../css/login.css';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/admin/login');
        }
    }, [email, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.value !== '' && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, 6).split('');
        
        if (pastedNumbers.length > 0) {
            const newOtp = [...otp];
            pastedNumbers.forEach((num, idx) => {
                newOtp[idx] = num;
            });
            setOtp(newOtp);
            
            const targetIndex = Math.min(pastedNumbers.length, 5);
            const siblings = Array.from(e.target.parentNode.children);
            if (siblings[targetIndex]) {
                siblings[targetIndex].focus();
            }
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length < 6) return;

        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/api/admin/verify-otp', { email, otp: otpCode });
            localStorage.setItem('adminToken', response.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid verification code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container" style={{ justifyContent: 'center', backgroundColor: '#fdfcfb' }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="login-form-wrapper"
                style={{ textAlign: 'center' }}
            >
                <div className="login-brand" style={{ justifyContent: 'center' }}>
                    <Coffee className="brand-logo" size={32} />
                    <span className="brand-name">SECURITY CHECK</span>
                </div>

                <div className="login-intro">
                    <h1>Verify Identity</h1>
                    <p>
                        A sacred code has been sent to your email.<br/>
                        Enter the 6 digits to proceed.
                    </p>
                    <div style={{ marginTop: '1rem', color: '#3d2b1f', fontWeight: '600', fontSize: '0.9rem' }}>
                        {email}
                    </div>
                </div>

                <form onSubmit={handleVerify} className="fashion-form">
                    <div className="otp-fashion-container">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                onFocus={e => e.target.select()}
                                className="otp-fashion-input"
                            />
                        ))}
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="fashion-error"
                            style={{ textAlign: 'left' }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading || otp.join('').length < 6}
                        className="fashion-button"
                    >
                        <span>{loading ? 'Verifying...' : 'Complete Authentication'}</span>
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="login-fashion-footer" style={{ marginTop: '4rem' }}>
                    <button className="resend-btn" style={{ 
                        background: 'none', 
                        border: 'none', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        color: '#8a7b6f',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        <RefreshCw size={14} /> Request New Code
                    </button>
                    <div className="footer-links">
                        <span onClick={() => navigate('/admin/login')}>Back to Login</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;
