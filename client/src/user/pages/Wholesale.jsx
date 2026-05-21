import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Globe, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Wholesale = () => {
    const { t, language } = useLanguage();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#fff', color: '#000', fontFamily: 'Outfit, sans-serif', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={{ height: '100px', background: '#000' }}></div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem' }}>
                <div className="wholesale-hero" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'center', marginBottom: '10rem' }}>
                    <motion.div
                        initial={{ opacity: 0, x: language === 'ar' ? 30 : -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{ color: '#c9a050', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '700' }}>{t('wholesale.partnerships')}</span>
                        <h1 className="luxury-font" style={{ fontSize: '4.5rem', marginTop: '1rem', lineHeight: '1.1' }}>{t('wholesale.title')}</h1>
                        <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.8', margin: '3rem 0' }}>{t('wholesale.desc')}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {(t('wholesale.benefits') || []).map((benefit, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <CheckCircle size={18} color="#c9a050" />
                                    <span style={{ fontSize: '1rem', fontWeight: '500' }}>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        style={{ position: 'relative' }}
                    >
                        <div style={{ width: '100%', height: '600px', background: '#f5f5f5', borderRadius: '24px', overflow: 'hidden' }}>
                            <img src="/src/assets/excellence_3.jpg" alt="Wholesale Coffee" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ 
                            position: 'absolute', 
                            bottom: '-40px', 
                            right: language === 'ar' ? 'auto' : '-40px',
                            left: language === 'ar' ? '-40px' : 'auto',
                            background: '#c9a050', 
                            color: '#000', 
                            padding: '3rem', 
                            borderRadius: '12px', 
                            maxWidth: '300px' 
                        }}>
                            <Coffee size={30} style={{ marginBottom: '1.5rem' }} />
                            <h4 className="luxury-font" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t('wholesale.artisanalScale')}</h4>
                            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{t('wholesale.artisanalDesc')}</p>
                        </div>
                    </motion.div>
                </div>

                <div style={{ padding: '8rem 0', borderTop: '1px solid #eee' }}>
                    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                        <h2 className="luxury-font" style={{ fontSize: '3rem' }}>{t('wholesale.partnerTitle')}</h2>
                        <p style={{ color: '#666', marginTop: '1.5rem' }}>{t('wholesale.partnerSubtitle')}</p>
                    </div>

                    <div className="wholesale-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem' }}>
                        {(t('wholesale.steps') || []).map((step, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>0{i+1}</div>
                                <h3 className="luxury-font" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>{step.title}</h3>
                                <p style={{ color: '#666', lineHeight: '1.6' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '8rem' }}>
                        <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '1.5rem', background: '#000', color: '#fff', padding: '1.5rem 4rem', textDecoration: 'none', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px', transition: 'all 0.3s' }}>
                            {t('wholesale.becomePartner')} <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
            <style>
                {`
                @media (max-width: 968px) {
                    .wholesale-hero {
                        grid-template-columns: 1fr !important;
                        gap: 4rem !important;
                    }
                    .wholesale-steps-grid {
                        grid-template-columns: 1fr !important;
                        gap: 3rem !important;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default Wholesale;
