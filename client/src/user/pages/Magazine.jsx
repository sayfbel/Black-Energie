import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Instagram, Facebook, Twitter, ExternalLink, Globe, Users, CheckCircle, Coffee, Truck, ChevronDown, Github, Linkedin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import devSigne from './../../assets/DEVELOPER_SIGNE.png';
import heroVideo from './../../assets/VID-20260428-WA0148.mp4';
import './../css/magazine.css';

// Social Assets
import sImg1 from './../../assets/social/674402816_18085151906119119_5364163603484758993_n.webp';
import sImg2 from './../../assets/social/675302489_18085151882119119_6124722281637384442_n.webp';
import sImg3 from './../../assets/social/681356251_18085151918119119_6750613321706551035_n.webp';
import sImg4 from './../../assets/social/681390076_18085151897119119_1329538454015531099_n.webp';
import sImg5 from './../../assets/social/683754411_18086628290119119_3039671065697082417_n.jpg';
import sImg6 from './../../assets/social/684788186_18086628326119119_4862731325498169349_n.jpg';
import sImg7 from './../../assets/social/685374860_18086628335119119_6322896831948800924_n.jpg';
import sImg8 from './../../assets/social/687013433_18086628311119119_2827922797486895424_n.jpg';
import sImg9 from './../../assets/social/687678235_18086628320119119_7013267523376842258_n.jpg';
import sImg10 from './../../assets/social/688965305_18086628323119119_2501904414470416064_n.jpg';

import sVid1 from './../../assets/social/AQM1Hw2iIG-ZXqSC4rY622Y7CMQVvFVdcshfoyy0RxOeVMerk_Y3DD4DSeudTYezb4dPoPo69bXTYCqOgbhucqAD21NDmuKG.mp4';
import sVid2 from './../../assets/social/AQMHhFb-iCbIIgfty-mc9qKxsFIyhm5qDKtZPsicP14QPCFsLG_ubd4Th53nrXm2MnUVkE0gvYhfNcL63B6GS1AuZx3Y_Wr8.mp4';
import sVid3 from './../../assets/social/AQMahUC1uRmjznQVF9g-cCYXB1Deqx6q7XnuOZ1ht-96WFKddv-tDiiNcsaIDMSPBPVposGQ22DwqtoDD_8upz57G-QUgxJN.mp4';
import sVid4 from './../../assets/social/AQNUHRO7lPsYTafnQhy2u_zjk7NdaKIJlNYmSdkogNh-whDjllHK_svnP-2ffSB-pB_mF1UE0nRhB2Ies7OzfkNryzY48KVI.mp4';
import sVid5 from './../../assets/social/AQOSW9jJoV0kMAYaAXlLO1fTZbtbUIuXXGeRetWJz6IWjDcChvBKrODfRdxpeRjkIgwU4GJC0QvkT-8-WpFxpKQWz7USdouS.mp4';
import sVid6 from './../../assets/social/AQOT_6Y722K1Yfb_ofb79lp0fr8Lcf8FBiFdy7acydhAahgev7-XbjCTigtfw950c7nW802wK4zag0sO6nXdahTFfQk6lhPg.mp4';
import sVid7 from './../../assets/social/AQPeMRoGx3sRQICuRGOUTTa_nrH-WqtCDjRr7ZQC9miEo9dq3Gcgs4bpWOStIdwwHpc2Z5cxoAydLNiusd_ErfBKpm892kXQ.mp4';

const Magazine = () => {
    const { t, language } = useLanguage();
    const [selectedPost, setSelectedPost] = useState(null);
    const [activeIndex, setActiveIndex] = useState(8);
    const [openFaq, setOpenFaq] = useState(null);

    const socialTranslations = t('magazine.socialCards') || [];
    const cards = [
        { type: 'video', src: sVid1, title: socialTranslations[0]?.title || 'Process', sub: socialTranslations[0]?.sub || 'Artisanal Roasting' },
        { type: 'image', src: sImg1, title: socialTranslations[1]?.title || 'Black Coffee', sub: socialTranslations[1]?.sub || 'Premium Selection' },
        { type: 'video', src: sVid2, title: socialTranslations[2]?.title || 'Brewing', sub: socialTranslations[2]?.sub || 'The Perfect Pour' },
        { type: 'image', src: sImg2, title: socialTranslations[3]?.title || 'Origin', sub: socialTranslations[3]?.sub || 'High Altitudes' },
        { type: 'video', src: sVid3, title: socialTranslations[4]?.title || 'Lifestyle', sub: socialTranslations[4]?.sub || 'Morning Ritual' },
        { type: 'image', src: sImg3, title: socialTranslations[5]?.title || 'Quality', sub: socialTranslations[5]?.sub || 'Liquid Gold' },
        { type: 'video', src: sVid4, title: socialTranslations[6]?.title || 'Atmosphere', sub: socialTranslations[6]?.sub || 'The Cafe Experience' },
        { type: 'image', src: sImg4, title: socialTranslations[7]?.title || 'Details', sub: socialTranslations[7]?.sub || 'Finest Beans' },
        { type: 'video', src: sVid5, title: socialTranslations[8]?.title || 'Passion', sub: socialTranslations[8]?.sub || 'Crafted with Love' },
        { type: 'image', src: sImg5, title: socialTranslations[9]?.title || 'Legacy', sub: socialTranslations[9]?.sub || 'Generations of Taste' },
        { type: 'video', src: sVid6, title: socialTranslations[10]?.title || 'Modernity', sub: socialTranslations[10]?.sub || 'Tech-Driven Roasting' },
        { type: 'image', src: sImg6, title: socialTranslations[11]?.title || 'Elegance', sub: socialTranslations[11]?.sub || 'The Golden Label' },
        { type: 'video', src: sVid7, title: socialTranslations[12]?.title || 'Global', sub: socialTranslations[12]?.sub || 'World-Wide Community' },
        { type: 'image', src: sImg7, title: socialTranslations[13]?.title || 'Selection', sub: socialTranslations[13]?.sub || 'The Dark Blend' },
        { type: 'image', src: sImg8, title: socialTranslations[14]?.title || 'Sourcing', sub: socialTranslations[14]?.sub || 'Direct from Farm' },
        { type: 'image', src: sImg9, title: socialTranslations[15]?.title || 'Texture', sub: socialTranslations[15]?.sub || 'Velvety Smooth' },
        { type: 'image', src: sImg10, title: socialTranslations[16]?.title || 'Brand', sub: 'Black Energie' }
    ];

    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [hash]);

    const ecosystemIcons = [<CheckCircle size={32} />, <Truck size={32} />, <Users size={32} />, <Globe size={32} />];

    return (
        <div className="magazine-page" style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
            <section className="magazine-header" style={{ position: 'relative', height: '450px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video autoPlay muted loop playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}>
                    <source src={heroVideo} type="video/mp4" />
                </video>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2 }}></div>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} style={{ textAlign: 'center', position: 'relative', zIndex: 3 }} className="magazine-header-content">
                    <h1 className="luxury-font magazine-title" style={{ fontSize: '5rem', color: '#fff', marginBottom: '1rem', letterSpacing: '8px' }}>{t('magazine.title')}</h1>
                    <div style={{ width: '60px', height: '1px', background: 'var(--primary)', margin: '1.5rem auto' }}></div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '8px', textTransform: 'uppercase', fontSize: '0.9rem' }}>{t('magazine.subtitle')}</p>
                </motion.div>
            </section>

            <section style={{ background: '#000', padding: '8rem 0', position: 'relative', overflow: 'hidden' }}>
                <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ width: '100%' }}>
                        <span style={{ color: 'var(--primary)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '1rem', display: 'block' }}>{t('magazine.digitalPresence')}</span>
                        <h3 className="luxury-font follow-movement-title" style={{ fontSize: '4.5rem', marginBottom: '2rem', color: '#fff', lineHeight: '1.1' }}>{t('magazine.followMovement')}</h3>
                        <p className="follow-movement-desc" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.1rem', lineHeight: '1.8' }}>{t('magazine.followDesc')}</p>

                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <motion.a href="https://www.instagram.com/black_energie_____/" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05, borderColor: 'var(--primary)' }} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem 2.5rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s ease' }}>
                                <Instagram size={20} /> <span style={{ fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px' }}>{t('magazine.instagram')}</span>
                            </motion.a>
                            <motion.a href="#" whileHover={{ scale: 1.05, borderColor: 'var(--primary)' }} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem 2.5rem', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s ease' }}>
                                <Facebook size={20} /> <span style={{ fontSize: '0.9rem', fontWeight: '600', letterSpacing: '1px' }}>{t('magazine.facebook')}</span>
                            </motion.a>
                        </div>
                    </div>
                </div>

                <div className="social-stack-carousel" style={{ marginTop: '4rem', width: '100%', height: '600px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1500px', overflow: 'hidden' }}>
                    {cards.map((card, idx) => {
                        const distance = idx - activeIndex;
                        const isCenter = distance === 0;
                        const absDistance = Math.abs(distance);
                        if (absDistance > 3) return null;
                        return (
                            <motion.div key={idx} className="social-card" onClick={() => { if (isCenter) setSelectedPost(card); else setActiveIndex(idx); }} animate={{ x: distance * 220, z: -absDistance * 150, rotateY: distance * -25, scale: 1 - absDistance * 0.15, opacity: 1 - absDistance * 0.3, zIndex: 100 - absDistance }} transition={{ type: "spring", stiffness: 150, damping: 20 }} whileHover={isCenter ? { scale: 1.05 } : {}} style={{ position: 'absolute', minWidth: '350px', height: '450px', background: 'rgba(255,255,255,0.03)', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', boxShadow: isCenter ? '0 30px 60px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.3)', userSelect: 'none', transformStyle: 'preserve-3d' }}>
                                {card.type === 'video' ? <video src={card.src} autoPlay muted loop playsInline style={{ width: '100%', height: '80%', objectFit: 'cover', pointerEvents: 'none' }} /> : <img src={card.src} alt={card.title} style={{ width: '100%', height: '80%', objectFit: 'cover', pointerEvents: 'none' }} />}
                                <div style={{ padding: '1.5rem', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.9))', position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', pointerEvents: 'none' }}>
                                    <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.3rem', fontWeight: '600' }}>{card.title}</h4>
                                    <p style={{ color: 'var(--primary)', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{card.sub}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', gap: '0.5rem' }}>
                        {cards.map((_, i) => <div key={i} onClick={() => setActiveIndex(i)} style={{ width: i === activeIndex ? '24px' : '8px', height: '8px', background: i === activeIndex ? 'var(--primary)' : 'rgba(255,255,255,0.2)', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s ease' }} />)}
                    </div>
                </div>
            </section>

            <div className="container" style={{ padding: '8rem 0' }}>
                <section style={{ marginBottom: '8rem' }}>
                    <h3 className="luxury-font" style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '4rem' }}>{t('magazine.businessEcosystem')}</h3>
                    <div className="business-ecosystem-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        {(t('magazine.ecosystem') || []).map((item, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1px', textAlign: 'center' }}>
                                <div style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>{ecosystemIcons[idx]}</div>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', letterSpacing: '1px' }}>{item.title}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section id="digital-architect" style={{ marginBottom: '8rem', padding: '6rem', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }} className="collaboration-section">
                    <span style={{ color: 'var(--primary)', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '1.5rem', display: 'block' }}>{t('magazine.exclusivePartnership')}</span>
                    <h3 className="luxury-font" style={{ fontSize: '2.5rem', marginBottom: '3rem', color: '#000' }}>{t('magazine.digitalArchitect')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                        <motion.img whileHover={{ scale: 1.05 }} src={devSigne} alt="Developer Signature" style={{ height: '80px', width: 'auto', filter: 'grayscale(1)', opacity: 0.8 }} />
                        <p style={{ color: 'rgba(0,0,0,0.6)', maxWidth: '500px', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>{t('magazine.architectDesc')}</p>
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                            <a href="https://github.com/sayfbel" target="_blank" rel="noopener noreferrer" style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}><Github size={20} /> GitHub</a>
                            <a href="https://www.linkedin.com/in/saif-bel-90b044241/" target="_blank" rel="noopener noreferrer" style={{ color: '#000', display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}><Linkedin size={20} /> LinkedIn</a>
                        </div>
                    </div>
                </section>

                <div id="faq" className="faq-container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <h3 className="luxury-font" style={{ fontSize: '3rem', marginBottom: '4rem' }}>{t('magazine.faqTitle')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {(t('magazine.faqs') || []).map((faq, i) => (
                            <motion.div key={i} className="faq-item" style={{ width: '80%', alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end', textAlign: 'left' }}>
                                <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ padding: '1.5rem 2rem', background: 'linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.85))', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
                                    <h4 style={{ fontSize: '1.1rem', color: '#000', fontWeight: '600', margin: 0 }}>{faq.question}</h4>
                                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown size={20} color="#000" /></motion.div>
                                </div>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                                            <div style={{ padding: '1.5rem 2rem', color: '#000', fontSize: '0.95rem', lineHeight: '1.6', background: 'rgba(255,255,255,0.7)', marginTop: '2px', borderRadius: '0 0 12px 12px', border: '1px solid rgba(0,0,0,0.05)', borderTop: 'none' }}>{faq.answer}</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedPost && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setSelectedPost(null)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '1000px', height: '80vh', background: '#000', display: 'flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ flex: '1.5', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {selectedPost.type === 'video' ? <video src={selectedPost.src} controls autoPlay loop style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <img src={selectedPost.src} alt={selectedPost.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />}
                            </div>
                            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', background: '#000', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>B</div>
                                    <div><h5 style={{ margin: 0, color: '#fff' }}>black_energie_____</h5><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('magazine.originalAudio')}</p></div>
                                </div>
                                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', color: '#fff' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>black_energie_____</p>
                                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{selectedPost.title} - {selectedPost.sub}</p>
                                    <p style={{ color: 'var(--primary)', marginTop: '1rem' }}>#blackenergie #premiumcoffee #artisanal #roastery #luxury</p>
                                </div>
                                <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <motion.div whileHover={{ scale: 1.2 }} style={{ cursor: 'pointer' }}>❤️</motion.div>
                                        <motion.div whileHover={{ scale: 1.2 }} style={{ cursor: 'pointer' }}>💬</motion.div>
                                        <motion.div whileHover={{ scale: 1.2 }} style={{ cursor: 'pointer' }}>✈️</motion.div>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>1,234 {t('magazine.likes')}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>2 {t('magazine.hoursAgo')}</p>
                                </div>
                            </div>
                        </motion.div>
                        <button onClick={() => setSelectedPost(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}>&times;</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Magazine;
