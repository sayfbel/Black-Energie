import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PlusCircle, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const RelatedProducts = ({ currentProductId, showQuickAdd = false }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedId, setAddedId] = useState(null);
    const { addToCart } = useCart();
    const { t } = useLanguage();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products');
                // Filter out current product and show only 4, ensuring ID comparison is robust
                const filtered = res.data.filter(p =>
                    String(p._id) !== String(currentProductId)
                ).slice(0, 4);

                // If filter resulted in nothing (unlikely), just show first 4
                setProducts(filtered.length > 0 ? filtered : res.data.slice(0, 4));
                setLoading(false);
            } catch (err) {
                console.error("Error fetching related products:", err);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [currentProductId]);

    const handleQuickAdd = (p) => {
        addToCart(p, 1, { size: '250g' });
        setAddedId(p._id);
        setTimeout(() => setAddedId(null), 2000);
    };

    if (loading) return null;

    return (
        <section className="related-products-section" style={{ borderTop: '1px solid #eee', paddingTop: '8rem', paddingBottom: '8rem' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '4px', color: '#c9a050', fontWeight: '700', display: 'block', marginBottom: '1rem' }}>{t('product.discovery')}</span>
                    <h2 className="luxury-font" style={{ fontSize: '3.5rem' }}>{t('product.otherReserves')}</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '3rem' }}>
                    {products.map((product, i) => (
                        <motion.div
                            key={product._id || i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                            style={{ background: '#fff', padding: '1.5rem', border: '1px solid #f0f0f0', position: 'relative', textAlign: 'center' }}
                        >
                            <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                <div style={{ height: '280px', background: '#fcfcfc', marginBottom: '1.5rem', overflow: 'hidden' }}>
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
                                    />
                                </div>
                                <span style={{ color: '#c9a050', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' }}>{product.category || t('shop.originSelect')}</span>
                                <h3 className="luxury-font" style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>{product.name}</h3>
                                <p style={{ color: '#000', fontWeight: '600', fontSize: '1rem', marginBottom: '1.5rem' }}>${Number(product.price).toFixed(2)}</p>
                            </Link>

                            {showQuickAdd ? (
                                <button
                                    onClick={() => handleQuickAdd(product)}
                                    style={{
                                        width: '100%',
                                        background: '#000',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '1rem',
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.8rem',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {addedId === product._id ? <CheckCircle size={14} color="#27ae60" /> : <PlusCircle size={14} />}
                                    {addedId === product._id ? t('product.added') : 'Quick Add'}
                                </button>
                            ) : (
                                <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', borderBottom: '1px solid #000', color: '#000' }}>{t('shop.viewDetails')}</span>
                                </Link>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RelatedProducts;
