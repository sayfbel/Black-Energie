import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Coffee, ArrowRight } from 'lucide-react';
import { useNotification } from '../../user/context/NotificationContext';
import { motion } from 'framer-motion';

import './../css/login.css';
import excellenceImg from './../../assets/excellence_1.jpg';

const Login = () => {
    const [email, setEmail] = useState('hamza.emilie23@gmail.com');
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLoading(true);
        try {
            await axios.post('/api/admin/login', { email });
            navigate('/admin/verify', { state: { email } });
        } catch (err) {
            const serverMsg = err.response?.data?.error || err.response?.data?.message;
            showNotification(serverMsg || 'Login failed. Please check your credentials.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-side-image">
                <img src={excellenceImg} alt="Luxury Coffee" />
                <div className="image-overlay">
                    <div className="overlay-content">
                        <span className="brand-tag">The Art of Essence</span>
                        <h2>Black Energie</h2>
                        <p>Where passion meets precision in every grain.</p>
                    </div>
                </div>
            </div>

            <div className="login-side-form">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="login-form-wrapper"
                >
                    <div className="login-brand">
                        <Coffee className="brand-logo" size={32} />
                        <span className="brand-name">ADMIN PORTAL</span>
                    </div>

                    <div className="login-intro">
                        <h1>Welcome Back</h1>
                        <p>Authenticate your presence to access the sanctuary of excellence.</p>
                    </div>

                    <form onSubmit={handleLogin} className="fashion-form">
                        <div className="fashion-input-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="fashion-input"
                                />
                            </div>
                        </div>



                        <button
                            type="submit"
                            disabled={loading}
                            className="fashion-button"
                        >
                            <span>{loading ? 'Processing...' : 'Identify Self'}</span>
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="login-fashion-footer">
                        <p>&copy; 2026 Black Energie. All rights reserved.</p>
                        <div className="footer-links">
                            <span>Privacy</span>
                            <span>Support</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
