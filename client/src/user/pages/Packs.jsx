import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import heroVideo from './../../assets/VID-20260428-WA0148.mp4';

import { useLanguage } from '../context/LanguageContext';
import './../css/packs.css';

const Packs = () => {
    const { language, t } = useLanguage();
    const [packs, setPacks] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, offersRes] = await Promise.all([
                    axios.get('/api/products'),
                    axios.get('/api/marketing/offers')
                ]);
                
                // Filter to show only pack products
                const filtered = productsRes.data.filter(p => p.product_type === 'pack');
                setPacks(filtered);
                setOffers(offersRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getDiscountedPrice = (product) => {
        const basePrice = Number(product.price);
        const offer = offers.find(o => {
            const now = new Date();
            const start = o.start_date ? new Date(o.start_date) : null;
            const end = o.end_date ? new Date(o.end_date) : null;
            if (start && now < start) return false;
            if (end && now > end) return false;
            if (o.type === 'all') return true;
            if (o.target_ids && o.target_ids.includes(product.id)) return true;
            return false;
        });

        if (!offer) return { price: basePrice, offer: null };

        let price = basePrice;
        if (offer.discount_type === 'percentage') {
            price = price * (1 - offer.discount_value / 100);
        } else {
            price = Math.max(0, price - offer.discount_value);
        }
        return { price, offer };
    };

    return (
        <div className="packs-page">
            <section className="packs-header">
                <video autoPlay muted loop playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}>
                    <source src={heroVideo} type="video/mp4" />
                </video>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2 }}></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="packs-header-content"
                >
                    <h1 className="luxury-font">{t('shop.packsTitle')}</h1>
                    <div style={{ width: '60px', height: '1px', background: 'var(--primary)', margin: '1.5rem auto' }}></div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '6px', textTransform: 'uppercase', fontSize: '0.9rem' }}>{t('shop.packsSubtitle')}</p>
                </motion.div>
            </section>

            <div className="container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                        <p className="luxury-font" style={{ fontSize: '1.5rem' }}>{t('shop.loading')}</p>
                    </div>
                ) : packs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                        <p>{language === 'ar' ? 'لا توجد باقات متاحة حالياً.' : language === 'fr' ? 'Aucun pack disponible pour le moment.' : 'No packs available at the moment.'}</p>
                        <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', marginTop: '2rem', textDecoration: 'none' }}>{t('product.backToProduct')}</Link>
                    </div>
                ) : (
                    <div className="packs-container">
                        {packs.map((pack, i) => (
                            <motion.div 
                                key={pack._id || i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="pack-item"
                                style={{ 
                                    direction: i % 2 === 0 ? 'ltr' : 'rtl'
                                }}
                            >
                                <div className="pack-image-container">
                                    <img src={pack.image_url || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'} alt={pack.name} className="pack-image" />
                                </div>
                                <div className="pack-info" style={{ textAlign: 'left', direction: 'ltr' }}>
                                    <h2 className="luxury-font">{pack.name}</h2>
                                    <p>{pack.description}</p>
                                    <div style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                                        {(() => {
                                            const { price, offer } = getDiscountedPrice(pack);
                                            if (offer) {
                                                return (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${price.toFixed(2)}</span>
                                                        <span style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>${Number(pack.price).toFixed(2)}</span>
                                                        <span style={{ background: 'var(--primary)', color: '#000', fontSize: '0.7rem', padding: '2px 8px', fontWeight: 'bold' }}>SALE</span>
                                                    </div>
                                                );
                                            }
                                            return <span style={{ color: '#fff' }}>${Number(pack.price).toFixed(2)}</span>;
                                        })()}
                                    </div>
                                    <Link to={`/product/${pack.slug}`} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', borderRadius: '0', padding: '1.2rem 2.5rem' }}>{t('shop.viewDetails')}</Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Packs;
