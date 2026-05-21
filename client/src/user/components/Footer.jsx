import React, { useState, useEffect } from 'react';
import { Coffee, Facebook, Instagram, Twitter, Mail, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import devSigne from './../../assets/DEVELOPER_SIGNE.png';
import { Github, Linkedin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './footer.css';

const Footer = () => {
    const { t } = useLanguage();
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error("Error fetching products for footer:", err);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 5000); // 5 seconds per product

        return () => clearInterval(interval);
    }, [products]);

    return (
        <footer className="fashion-footer">
            <div className="footer-background-text">BLACK ENERGIE</div>

            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-newsletter">
                        <span className="newsletter-tag">{t('footer.newsletter')}</span>
                        <h2 className="newsletter-title">{t('footer.stayConnected')}</h2>
                        <p className="newsletter-desc">{t('footer.aboutDesc')}</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder={t('footer.newsletterPlaceholder')} className="newsletter-input" />
                            <button type="submit" className="newsletter-btn">
                                <span>{t('footer.subscribe')}</span>
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>

                    <div className="footer-product-showcase">
                        <AnimatePresence mode="wait">
                            {products.length > 0 && (
                                <motion.div
                                    key={products[currentIndex]._id}
                                    initial={{ opacity: 0, scale: 1.1, clipPath: 'inset(0% 100% 0% 0%)' }}
                                    animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                                    exit={{ opacity: 0, scale: 0.9, clipPath: 'inset(0% 0% 0% 100%)' }}
                                    transition={{
                                        duration: 1.5,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    className="footer-product-image-container"
                                >
                                    <img
                                        src={products[currentIndex].image_url}
                                        alt={products[currentIndex].name}
                                        className="footer-product-img"
                                    />
                                    <div className="footer-product-info">
                                        <span className="product-name">{products[currentIndex].name}</span>
                                        <span className="product-price">${Number(products[currentIndex].price).toFixed(2)}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="brand-header">
                            <Coffee size={28} className="brand-icon" />
                            <span className="brand-name">Black Energie</span>
                        </div>
                        <p className="brand-philosophy">
                            {t('footer.aboutDesc')}
                        </p>
                        <div className="social-links">
                            <motion.a whileHover={{ y: -5 }} href="https://www.instagram.com/black_energie_____/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></motion.a>
                            <motion.a whileHover={{ y: -5 }} href="#" aria-label="Facebook"><Facebook size={20} /></motion.a>
                            <motion.a whileHover={{ y: -5 }} href="#" aria-label="Twitter"><Twitter size={20} /></motion.a>
                        </div>
                    </div>

                    <div className="footer-nav-group">
                        <div className="footer-links">
                            <h4 className="links-title">{t('footer.packs')}</h4>
                            <ul>
                                {products.filter(p => p.product_type === 'pack').slice(0, 4).map((pack) => (
                                    <li key={pack._id}>
                                        <Link to={`/product/${pack.slug}`}>{pack.name}</Link>
                                    </li>
                                ))}
                                {products.filter(p => p.product_type === 'pack').length === 0 && (
                                    <>
                                        <li><Link to="/packs">{t('shop.packsTitle')}</Link></li>
                                        <li><Link to="/packs">{t('shop.packsSubtitle')}</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>

                        <div className="footer-links">
                            <h4 className="links-title">{t('footer.concierge')}</h4>
                            <ul>
                                <li><Link to="/shipping-returns">{t('footer.shippingReturns')}</Link></li>
                                <li><Link to="/wholesale">{t('footer.wholesale')}</Link></li>
                                <li><Link to="/contact">{t('footer.contactUs')}</Link></li>
                                <li><Link to="/magazine#faq">{t('footer.faq')}</Link></li>
                            </ul>
                        </div>

                        <div className="footer-links">
                            <h4 className="links-title">{t('footer.maison')}</h4>
                            <ul>
                                <li><a href="#">{t('footer.ourHeritage')}</a></li>
                                <li><a href="#">{t('footer.theCraft')}</a></li>
                                <li><a href="#">{t('footer.sustainability')}</a></li>
                                <li><a href="#">{t('footer.journal')}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="bottom-content">
                        <p className="copyright">&copy; 2026 BLACK ENERGIE. {t('footer.legal').toUpperCase()}.</p>
                        <div className="developer-branding">
                            <img src={devSigne} alt="Developer Signature" className="dev-signature" />
                            <div className="dev-links">
                                <a href="https://github.com/sayfbel" target="_blank" rel="noopener noreferrer"><Github size={16} /></a>
                                <a href="https://www.linkedin.com/in/saif-bel-90b044241/" target="_blank" rel="noopener noreferrer"><Linkedin size={16} /></a>
                            </div>
                        </div>
                        <div className="footer-legal">
                            <Link to="/privacy">{t('footer.privacyPolicy')}</Link>
                            <Link to="/terms">{t('footer.termsOfService')}</Link>
                            <Link to="/accessibility">{t('footer.accessibility')}</Link>
                        </div>
                    </div>
                    <div className="gold-accent-line"></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
