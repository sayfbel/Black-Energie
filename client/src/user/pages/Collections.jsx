import React from 'react';
import { motion } from 'framer-motion';
import heroVideo from './../../assets/VID-20260428-WA0148.mp4';

const Collections = () => {
    const collections = [
        { title: 'The Gold Label', desc: 'Our most exclusive reserves, aged to perfection.', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085' },
        { title: 'Artisanal Roasts', desc: 'Small-batch precision for the true connoisseur.', img: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c' },
        { title: 'Limited Editions', desc: 'Rare finds from high-altitude estates.', img: 'https://images.unsplash.com/photo-1497933322477-941fb43c747b' }
    ];

    return (
        <div className="collections-page" style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
            <section className="collections-header" style={{ position: 'relative', height: '450px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6rem' }}>
                <video autoPlay muted loop playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}>
                    <source src={heroVideo} type="video/mp4" />
                </video>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2 }}></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ textAlign: 'center', position: 'relative', zIndex: 3 }}
                >
                    <h1 className="luxury-font" style={{ fontSize: '5rem', color: '#fff', marginBottom: '1rem', letterSpacing: '4px' }}>Collections</h1>
                    <div style={{ width: '60px', height: '1px', background: 'var(--primary)', margin: '1.5rem auto' }}></div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '6px', textTransform: 'uppercase', fontSize: '0.9rem' }}>The Essence of Black Energie</p>
                </motion.div>
            </section>

            <div className="container">

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
                    {collections.map((col, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1.2fr', 
                                gap: '4rem', 
                                alignItems: 'center',
                                direction: i % 2 === 0 ? 'ltr' : 'rtl'
                            }}
                        >
                            <div style={{ height: '500px', overflow: 'hidden' }}>
                                <img src={`${col.img}?auto=format&fit=crop&q=80&w=1200`} alt={col.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ textAlign: 'left', direction: 'ltr' }}>
                                <h2 className="luxury-font" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{col.title}</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem', maxWidth: '500px' }}>{col.desc}</p>
                                <button className="btn-primary">Explore Collection</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Collections;
