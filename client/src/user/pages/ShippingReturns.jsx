import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, RotateCcw, Package, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const ShippingReturns = () => {
    const { t, language } = useLanguage();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const steps = [
        {
            icon: <Truck size={30} />,
            title: t('shipping.globalShipping'),
            desc: t('shipping.globalDesc')
        },
        {
            icon: <Package size={30} />,
            title: t('shipping.trackReserve'),
            desc: t('shipping.trackDesc')
        },
        {
            icon: <RotateCcw size={30} />,
            title: t('shipping.returnPhilosophy'),
            desc: t('shipping.returnDesc')
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#fff', color: '#000', fontFamily: 'Outfit, sans-serif', direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={{ height: '100px', background: '#000' }}></div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                    <span style={{ color: '#c9a050', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '700' }}>{t('shipping.conciergeSupport')}</span>
                    <h1 className="luxury-font" style={{ fontSize: '4rem', marginTop: '1rem' }}>{t('shipping.title')}</h1>
                    <p style={{ color: '#666', maxWidth: '600px', margin: '2rem auto 0', lineHeight: '1.8' }}>{t('shipping.subtitle')}</p>
                </div>

                <div className="shipping-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem', marginBottom: '10rem' }}>
                    {steps.map((step, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            style={{ padding: '3rem', background: '#fcfcfc', border: '1px solid #f0f0f0', textAlign: 'center' }}
                        >
                            <div style={{ color: '#c9a050', marginBottom: '2rem', display: 'inline-block' }}>{step.icon}</div>
                            <h3 className="luxury-font" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>{step.title}</h3>
                            <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="assistance-banner" style={{ background: '#000', color: '#fff', padding: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem' }}>
                    <div style={{ flex: 1 }}>
                        <h2 className="luxury-font" style={{ fontSize: '3rem', marginBottom: '2rem' }}>{t('shipping.needAssistance')}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '3rem' }}>{t('shipping.assistanceDesc')}</p>
                        <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', color: '#c9a050', textDecoration: 'none', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            {t('shipping.messageAdmin')} <ArrowRight size={20} />
                        </Link>
                    </div>
                    <div style={{ flex: 0.8, background: 'rgba(255,255,255,0.05)', padding: '4rem', borderRadius: '12px' }}>
                        <h4 style={{ color: '#c9a050', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '2rem' }}>{t('shipping.quickInstructions')}</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: 0, listStyle: 'none' }}>
                            {(t('shipping.steps') || []).map((step, i) => (
                                <li key={i} style={{ display: 'flex', gap: '1rem' }}>
                                    <span style={{ color: '#c9a050', fontWeight: 'bold' }}>0{i+1}.</span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <style>
                {`
                @media (max-width: 968px) {
                    .shipping-grid {
                        grid-template-columns: 1fr !important;
                        gap: 3rem !important;
                    }
                    .assistance-banner {
                        flex-direction: column !important;
                        padding: 3rem !important;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default ShippingReturns;
