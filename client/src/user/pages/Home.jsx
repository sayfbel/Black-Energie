import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Coffee, ShieldCheck, Truck, Send, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './../css/home.css';
import './../css/excellence.css';
import './../css/beforeafter.css';

// Import images
import excellence1 from './../../assets/excellence_1.jpg';
import excellence2 from './../../assets/excellence_2.jpg';
import excellence3 from './../../assets/excellence_3.jpg';
import excellence4 from './../../assets/excellence_4.jpg';
import excellence5 from './../../assets/excellence_5.jpg';
import imgP from './../../assets/p.png';
import imgV from './../../assets/v.png';

const BeforeAfterSection = () => {
    const { t } = useLanguage();
    const [sliderPos, setSliderPos] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    // Create a smooth spring-based value for the position
    const springPos = useSpring(sliderPos, {
        stiffness: 100,
        damping: 20,
        restDelta: 0.001
    });

    const handleMove = (e) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.pageX || (e.touches && e.touches[0].pageX)) - rect.left;
        const pos = (x / rect.width) * 100;

        setSliderPos(Math.max(0, Math.min(100, pos)));
    };

    useEffect(() => {
        const handleUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchend', handleUp);
        return () => {
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchend', handleUp);
        };
    }, []);

    // Sync spring with state
    useEffect(() => {
        springPos.set(sliderPos);
    }, [sliderPos, springPos]);

    // Use transform to convert motion value to clip-path string
    const clipPath = useTransform(springPos, (pos) => `inset(0 ${100 - pos}% 0 0)`);
    const handleLeft = useTransform(springPos, (pos) => `${pos}%`);

    return (
        <section className="before-after-section">
            <div className="ba-header">
                <h2>{t('home.transformationTitle')}</h2>
                <p>{t('home.transformationSub')}</p>
            </div>

            <div
                ref={containerRef}
                className="ba-slider-container"
                onMouseMove={handleMove}
                onTouchMove={handleMove}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
                style={{ cursor: isDragging ? 'ew-resize' : 'pointer' }}
            >
                {/* Before Image */}
                <img src={imgV} alt="Before" className="ba-image ba-before" />

                {/* After Image with Smooth Clip Path */}
                <motion.div
                    className="ba-after"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        clipPath,
                        pointerEvents: 'none'
                    }}
                >
                    <img src={imgP} alt="After" className="ba-image" />
                </motion.div>

                {/* Slider Handle */}
                <motion.div
                    className="ba-handle"
                    style={{ left: handleLeft }}
                >
                    <div className="ba-handle-circle">
                        <ArrowRight size={14} strokeWidth={1.5} style={{ transform: 'rotate(180deg)', marginRight: '-2px' }} />
                        <ArrowRight size={14} strokeWidth={1.5} style={{ marginLeft: '-2px' }} />
                    </div>
                </motion.div>


                <div className="ba-labels">
                    <span className="ba-label">{t('home.before')}</span>
                    <span className="ba-label">{t('home.after')}</span>
                </div>
            </div>
        </section>
    );
};




// Import videos
import heroVideo from './../../assets/VID-20260428-WA0148.mp4';
import buildVideo from './../../assets/VID-20260428-WA0148.mp4';

const ExcellenceSection = () => {
    const { t } = useLanguage();
    const images = [
        excellence1 || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2000",
        excellence2 || "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=2000",
        excellence3 || "https://images.unsplash.com/photo-1497933322477-941fb43c747b?auto=format&fit=crop&q=80&w=2000",
        excellence4 || "https://images.unsplash.com/photo-1521017432531-fbd92d744264?auto=format&fit=crop&q=80&w=2000",
        excellence5 || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=2000"
    ];
    const excellenceItems = t('home.excellenceItems');

    return (
        <section className="excellence-section">
            {images.map((img, i) => (
                <div key={i} className="excellence-column">
                    <div className="slide-number">0{i + 1}</div>
                    <img src={img} alt={excellenceItems[i]?.title} className="excellence-img" />
                    <div className="excellence-content">
                        <h3>{t('home.excellenceConcept')}</h3>
                        <h2>{excellenceItems[i]?.title}</h2>
                        <p>{excellenceItems[i]?.desc}</p>
                    </div>
                    <div className="hover-indicator"></div>
                </div>
            ))}
        </section>
    );
};


const ManifestoSection = () => {
    const { t } = useLanguage();
    return (
        <section className="manifesto-section">
            <div className="manifesto-bg-text">CRAFT</div>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="manifesto-content"
                >
                    <span className="manifesto-tag">{t('home.philosophy')}</span>
                    <h2 className="manifesto-title">
                        {t('home.manifestoTitle')}
                    </h2>
                    <p className="manifesto-desc">
                        {t('home.manifestoDesc')}
                    </p>
                    <div className="manifesto-stats">
                        <div className="stat-item">
                            <span className="stat-num">100%</span>
                            <span className="stat-label">{t('home.statArtisanal')}</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-num">{t('home.statLimited')}</span>
                            <span className="stat-label">{t('home.statSmallBatch')}</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-num">{t('home.statGlobal')}</span>
                            <span className="stat-label">{t('home.statLuxury')}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};


const Home = () => {
    const { t } = useLanguage();
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="hero-video"
                >
                    <source src={heroVideo} type="video/mp4" />
                </video>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hero-title"
                    >
                        {t('home.heroTitle')}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hero-subtitle"
                    >
                        {t('home.heroSubtitle')}
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="btn-primary"
                        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                    >
                        {t('home.explorePacks')}
                    </motion.button>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="scroll-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                    <span className="scroll-text">{t('home.scrollDiscover')}</span>
                    <div className="scroll-line"></div>
                </motion.div>
            </section>

            {/* Fashion Manifesto Section */}
            <ManifestoSection />

            {/* Excellence Grid Accordion Section */}
            <ExcellenceSection />


            {/* Before & After Transformation Section */}
            <BeforeAfterSection />
        </div>
    );
};


export default Home;
