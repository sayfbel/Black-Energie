import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './notFound.css';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
    const { t, language } = useLanguage();
    return (
        <div className="not-found-container" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            <div className="not-found-bg-text">404</div>
            
            <motion.div 
                className="not-found-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="lost-icon-wrapper">
                    <Coffee size={48} className="lost-icon" />
                    <div className="ripple"></div>
                </div>

                <h1 className="not-found-title">{t('notFound.title')}</h1>
                <p className="not-found-desc">
                    {t('notFound.desc')}
                </p>

                <div className="not-found-actions">
                    <Link to="/" className="back-home-btn">
                        <ArrowLeft size={18} style={{ transform: language === 'ar' ? 'rotate(180deg)' : 'none' }} />
                        <span>{t('notFound.returnSelection')}</span>
                    </Link>
                    <Link to="/shop" className="explore-shop-btn">
                        <span>{t('notFound.exploreShop')}</span>
                    </Link>
                </div>
            </motion.div>

            <div className="not-found-footer">
                <div className="gold-accent"></div>
                <p>BLACK ENERGIE &copy; 2026</p>
            </div>
        </div>
    );
};

export default NotFound;
