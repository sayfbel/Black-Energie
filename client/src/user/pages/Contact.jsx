import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const { t, language } = useLanguage();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/contact', formState);
            setSent(true);
            showNotification(t('contact.successNotify'), 'success');
            setTimeout(() => setSent(false), 8000);
            setFormState({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            console.error(err);
            showNotification(t('contact.errorNotify'), 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fff', color: '#000', fontFamily: 'Outfit, sans-serif', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={{ height: '100px', background: '#000' }}></div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <span style={{ color: '#c9a050', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '700' }}>{t('contact.conciergeService')}</span>
                    <h1 className="luxury-font" style={{ fontSize: '4rem', marginTop: '1rem' }}>{t('contact.title')}</h1>
                </div>

                <div className="contact-grid-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '8rem' }}>
                    {/* Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: language === 'ar' ? 30 : -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="luxury-font" style={{ fontSize: '2rem', marginBottom: '3rem' }}>{t('contact.getInTouch')}</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Mail size={20} color="#c9a050" />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', letterSpacing: '1px' }}>{t('contact.email')}</h4>
                                    <p style={{ color: '#666', margin: 0 }}>concierge@blackenergie.com</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Phone size={20} color="#c9a050" />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', letterSpacing: '1px' }}>{t('contact.phone')}</h4>
                                    <p style={{ color: '#666', margin: 0 }}>+1 (800) BLACK-EN</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <MapPin size={20} color="#c9a050" />
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', letterSpacing: '1px' }}>{t('contact.maison')}</h4>
                                    <p style={{ color: '#666', margin: 0 }}>123 Artisan Roastery Blvd,<br />Coffee District, 90210</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: language === 'ar' ? -30 : 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ background: '#fcfcfc', padding: '4rem', border: '1px solid #f0f0f0' }}
                    >
                        {sent ? (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                <MessageSquare size={60} color="#c9a050" style={{ marginBottom: '2rem' }} />
                                <h3 className="luxury-font" style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('contact.messageReceived')}</h3>
                                <p style={{ color: '#666' }}>{t('contact.receivedDesc')}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' }}>{t('contact.fullName')}</label>
                                        <input 
                                            required
                                            type="text" 
                                            style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #ddd', padding: '1rem 0', outline: 'none' }} 
                                            placeholder="John Doe"
                                            value={formState.name}
                                            onChange={(e) => setFormState({...formState, name: e.target.value})}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' }}>{t('contact.emailAddress')}</label>
                                        <input 
                                            required
                                            type="email" 
                                            style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #ddd', padding: '1rem 0', outline: 'none' }} 
                                            placeholder="john@example.com"
                                            value={formState.email}
                                            onChange={(e) => setFormState({...formState, email: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' }}>{t('contact.subject')}</label>
                                    <input 
                                        required
                                        type="text" 
                                        style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #ddd', padding: '1rem 0', outline: 'none' }} 
                                        placeholder={t('contact.subjectPlaceholder')}
                                        value={formState.subject}
                                        onChange={(e) => setFormState({...formState, subject: e.target.value})}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' }}>{t('contact.message')}</label>
                                    <textarea 
                                        required
                                        rows="5"
                                        style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #ddd', padding: '1rem 0', outline: 'none', resize: 'none' }} 
                                        placeholder={t('contact.messagePlaceholder')}
                                        value={formState.message}
                                        onChange={(e) => setFormState({...formState, message: e.target.value})}
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    style={{ 
                                        background: '#000', 
                                        color: '#fff', 
                                        border: 'none', 
                                        padding: '1.5rem', 
                                        fontWeight: '700', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '3px', 
                                        cursor: loading ? 'not-allowed' : 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '1rem', 
                                        marginTop: '1rem',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                >
                                    {loading ? t('contact.sending') : t('contact.sendMessage')} <Send size={18} />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
            <style>
                {`
                @media (max-width: 768px) {
                    .contact-grid-container {
                        grid-template-columns: 1fr !important;
                        gap: 4rem !important;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default Contact;
