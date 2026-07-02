import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './../css/home.css';

import heroVideo from './../../assets/VID-20260428-WA0148.mp4';

const Shop = () => {
    const { t, language } = useLanguage();
    const [products, setProducts] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, offersRes] = await Promise.all([
                    axios.get('/api/products'),
                    axios.get('/api/marketing/offers')
                ]);
                
                // Filter to show only single origin products
                const filtered = productsRes.data.filter(p => p.product_type === 'single' || !p.product_type);
                setProducts(filtered);
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
        <div className="shop-page" style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
            {/* Video Header Section */}
            <section className="shop-header" style={{ position: 'relative', height: '450px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5rem' }}>
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
                >
                    <source src={heroVideo} type="video/mp4" />
                </video>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 2 }}></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ textAlign: 'center', position: 'relative', zIndex: 3 }}
                >
                    <h1 className="luxury-font" style={{ fontSize: '5rem', color: '#fff', marginBottom: '0.5rem', letterSpacing: '4px' }}>{t('shop.title')}</h1>
                    <div style={{ width: '60px', height: '1px', background: 'var(--primary)', margin: '1.5rem auto' }}></div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '8px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '300' }}>{t('shop.subtitle')}</p>
                </motion.div>
            </section>

            <div className="container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                        <p className="luxury-font" style={{ fontSize: '1.5rem' }}>{t('shop.loading')}</p>
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
                            <Coffee size={80} strokeWidth={0.5} style={{ marginBottom: '2rem', color: '#ccc' }} />
                            <h1 className="luxury-font" style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                                {language === 'ar' ? 'التشكيلة فارغة' : language === 'fr' ? 'La collection est vide' : 'The Collection is Empty'}
                            </h1>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '400px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
                                {language === 'ar' ? 'لا توجد منتجات متاحة حالياً في متجرنا. يرجى العودة لاحقاً أو التحقق من الأقسام الأخرى.' : language === 'fr' ? "Aucun produit n'est disponible pour le moment. Veuillez revenir plus tard ou explorer d'autres sections." : 'No products are currently available in our shop. Please check back later or explore other sections.'}
                            </p>
                            <Link to="/" style={{ padding: '1.2rem 3rem', textDecoration: 'none', background: 'var(--text-main)', color: 'var(--bg-dark)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', display: 'inline-block', border: '1px solid var(--text-main)' }}>
                                {language === 'ar' ? 'العودة للرئيسية' : language === 'fr' ? 'Retour à la Maison' : 'Return to Maison'}
                            </Link>
                        </motion.div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem', paddingBottom: '8rem' }}>
                        {products.map((product, i) => (
                            <motion.div
                                key={product._id || i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="product-card"
                                style={{ background: 'var(--bg-card)', padding: '1.5rem', border: '1px solid var(--glass-border)', position: 'relative' }}
                            >
                                <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ height: '400px', background: '#f5f5f5', marginBottom: '1.5rem', overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={product.image_url || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800'}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                        {product.isNew && (
                                            <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', color: '#000', padding: '0.3rem 0.8rem', fontSize: '0.6rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('shop.new')}</span>
                                        )}
                                    </div>
                                    <span style={{ color: 'var(--primary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600' }}>{product.category || t('shop.originSelect')}</span>
                                    <h3 className="luxury-font" style={{ fontSize: '1.4rem', margin: '0.5rem 0' }}>{product.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem', height: '40px', overflow: 'hidden' }}>{product.description}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            {(() => {
                                                const { price, offer } = getDiscountedPrice(product);
                                                if (offer) {
                                                    return (
                                                        <>
                                                            <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--primary)' }}>${price.toFixed(2)}</span>
                                                            <span style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>${Number(product.price).toFixed(2)}</span>
                                                        </>
                                                    );
                                                }
                                                return <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>${Number(product.price).toFixed(2)}</span>;
                                            })()}
                                        </div>
                                        <button className="btn-primary-user" style={{ padding: '0.6rem 1.2rem', borderRadius: '0 !important', fontSize: '0.7rem' }}>{t('shop.viewDetails')}</button>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default Shop;
