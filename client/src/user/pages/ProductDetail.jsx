import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Star, Minus, Plus, ShoppingBag, ArrowLeft, Share2, CheckCircle, ShieldCheck, Truck, ArrowRight, Download, Ticket, X, Copy, MessageCircle, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import './../css/productDetail.css';

import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { generatePremiumPDF } from '../utils/pdfGenerator';
import { generateLocalQRCode } from '../utils/qrGenerator';
import RelatedProducts from '../components/RelatedProducts';
import { useLanguage } from '../context/LanguageContext';
import UserSelect from '../components/UserSelect';

const ProductDetail = () => {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const { showNotification } = useNotification();
    const { t } = useLanguage();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [qrCodeBase64, setQrCodeBase64] = useState(null);
    const [offers, setOffers] = useState([]);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    // Dynamic Meta Tags for Social Sharing
    useEffect(() => {
        if (product) {
            document.title = `${product.name} | Black Energie`;
            const metaTags = {
                'og:title': `${product.name} | Black Energie`,
                'og:description': product.description || 'Premium Artisanal Coffee Reserve',
                'og:image': product.image_url,
                'og:url': window.location.href,
                'og:type': 'product'
            };

            Object.entries(metaTags).forEach(([property, content]) => {
                let element = document.querySelector(`meta[property="${property}"]`) ||
                    document.querySelector(`meta[name="${property}"]`);
                if (!element) {
                    element = document.createElement('meta');
                    if (property.startsWith('og:')) element.setAttribute('property', property);
                    else element.setAttribute('name', property);
                    document.head.appendChild(element);
                }
                if (content) element.setAttribute('content', content);
            });
        }
    }, [product]);

    // Checkout Form State
    const [formData, setFormData] = useState({ fullName: '', whatsapp: '', address: '', city: '' });
    const [deliveryCosts, setDeliveryCosts] = useState([]);

    const productWeights = useMemo(() => {
        if (!product?.weights) return null;
        try { return typeof product.weights === 'string' ? JSON.parse(product.weights) : product.weights; }
        catch (e) { return null; }
    }, [product]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, offersRes, deliveryRes] = await Promise.all([
                    axios.get(`/api/products/${slug}`),
                    axios.get('/api/marketing/offers'),
                    axios.get('/api/delivery-costs')
                ]);
                setProduct(prodRes.data);
                setOffers(offersRes.data);
                setDeliveryCosts(deliveryRes.data);
                if (prodRes.data.weights) {
                    const weights = typeof prodRes.data.weights === 'string' ? JSON.parse(prodRes.data.weights) : prodRes.data.weights;
                    if (weights && weights.length > 0) setSelectedSize(`${weights[0].value}${weights[0].unit}`);
                } else {
                    setSelectedSize('250g');
                }
            } catch (err) {
                console.error("Error fetching product data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [slug]);

    useEffect(() => {
        const prepareQR = async () => {
            if (orderConfirmed && orderId) {
                const trackingUrl = `${window.location.origin}/track/${orderId}`;
                const dataUrl = await generateLocalQRCode(trackingUrl);
                setQrCodeBase64(dataUrl);
            }
        };
        prepareQR();
    }, [orderConfirmed, orderId]);

    const [added, setAdded] = useState(false);

    const basePrice = useMemo(() => {
        if (!product) return 0;
        if (!productWeights) return Number(product.price);
        const selected = productWeights.find(w => `${w.value}${w.unit}` === selectedSize);
        return selected ? Number(selected.price) : Number(product.price);
    }, [product, productWeights, selectedSize]);

    const activeOffer = useMemo(() => {
        if (!product || !offers.length) return null;
        return offers.find(offer => {
            const now = new Date();
            const start = offer.start_date ? new Date(offer.start_date) : null;
            const end = offer.end_date ? new Date(offer.end_date) : null;
            if (start && now < start) return false;
            if (end && now > end) return false;
            if (offer.type === 'all') return true;
            if (offer.target_ids && offer.target_ids.includes(product.id)) return true;
            return false;
        });
    }, [product, offers]);

    const discountedPrice = useMemo(() => {
        let price = basePrice;
        if (activeOffer) {
            if (activeOffer.discount_type === 'percentage') price = price * (1 - activeOffer.discount_value / 100);
            else price = Math.max(0, price - activeOffer.discount_value);
        }
        if (appliedCoupon) {
            if (appliedCoupon.discount_type === 'percentage') price = price * (1 - appliedCoupon.discount_value / 100);
            else price = Math.max(0, price - appliedCoupon.discount_value);
        }
        return price;
    }, [basePrice, activeOffer, appliedCoupon]);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponLoading(true);
        try {
            const res = await axios.post('/api/marketing/coupons/validate', {
                code: couponCode.trim(),
                orderAmount: Number(basePrice) * Number(quantity)
            });
            setAppliedCoupon(res.data);
            showNotification('Coupon applied successfully!', 'success');
        } catch (err) {
            showNotification(err.response?.data?.error || 'Failed to validate coupon', 'error');
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        showNotification("Link copied to clipboard", "success");
        setShowShareMenu(false);
    };

    const handleAddToBag = () => {
        if (product) {
            addToCart(product, quantity, { size: selectedSize, price: discountedPrice });
            setAdded(true);
            showNotification(`${product.name} added to your bag`, 'success');
            setTimeout(() => setAdded(false), 3000);
        }
    };

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const itemTotal = discountedPrice * quantity;
    const selectedDelivery = deliveryCosts.find(d => d.city === formData.city);
    const shipping = selectedDelivery ? Number(selectedDelivery.cost) : 0;
    const total = itemTotal + shipping;

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/orders', {
                product_name: product.name,
                customer_name: formData.fullName,
                customer_whatsapp: formData.whatsapp,
                customer_address: formData.address,
                weight: selectedSize,
                quantity: quantity,
                total_price: total
            });
            setOrderId(res.data.id);
            setOrderConfirmed(true);
        } catch (err) {
            showNotification("Something went wrong with your order. Please try again.", "error");
        }
    };

    const handleDownloadPDF = async () => {
        if (generatingPDF) return;
        if (!qrCodeBase64) {
            showNotification("Generating high-security certificate. Please wait...", "info");
            return;
        }
        setGeneratingPDF(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            await generatePremiumPDF('acquisition-ticket', `Black_Energie_Reserve_${orderId || 'Order'}.pdf`);
            showNotification("Your artisanal certificate has been generated.", "success");
        } catch (err) {
            showNotification("Certificate generation failed. Please try again.", "error");
        } finally {
            setGeneratingPDF(false);
        }
    };

    if (loading) return (
        <div className="product-detail-loading">
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="luxury-font">
                Loading Reserve...
            </motion.div>
        </div>
    );

    if (!product) return (
        <div className="product-detail-not-found">
            <h2 className="luxury-font">Reserve Not Found</h2>
            <Link to="/shop" className="back-link">Return to Collection</Link>
        </div>
    );

    if (orderConfirmed) {
        return (
            <div className="product-detail-page" style={{ background: '#fff', minHeight: '100vh' }}>
                <style>{`
                    .navbar { background: #000 !important; }
                    .navbar .nav-link, .navbar .brand-name, .navbar .nav-icon-btn { color: #fff !important; }
                    .navbar.scrolled { background: #000 !important; }
                `}</style>
                <div className="product-header-spacer"></div>
                <div className="product-detail-container">
                    <div className="product-detail-grid">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
                            <div style={{ marginBottom: '4rem' }}>
                                <CheckCircle size={48} color="#c9a050" strokeWidth={1} style={{ marginBottom: '2rem' }} />
                                <h1 className="luxury-font" style={{ fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: '1', color: '#000' }}>
                                    Acquisition <br />Confirmed
                                </h1>
                                <p style={{ color: '#888', fontSize: '1rem', letterSpacing: '1px', maxWidth: '400px', lineHeight: '1.6' }}>
                                    {t('product.certificateDescription')}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '350px' }}>
                                <button onClick={handleDownloadPDF} disabled={generatingPDF} className="buy-now-btn" style={{ borderRadius: 0 }}>
                                    {generatingPDF ? '...' : <><Download size={18} /> {t('product.downloadCertificate')}</>}
                                </button>
                                <Link to="/" className="add-to-bag-btn" style={{ textDecoration: 'none' }}>
                                    {t('product.skipToMaison')}
                                </Link>
                            </div>

                            <div className="product-guarantees" style={{ marginTop: '5rem' }}>
                                <div className="guarantee">
                                    <ShieldCheck size={16} /> {t('product.secureVerification')}
                                </div>
                                <div className="guarantee">
                                    <Truck size={16} /> {t('product.priorityLogistics')}
                                </div>
                            </div>
                        </motion.div>

                        <div id="acquisition-ticket" style={{ background: '#000', color: '#fff', padding: '4rem', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-10%', right: '-10%', fontSize: '15rem', color: '#111', fontWeight: '900', zIndex: 0, opacity: 0.5 }}>RESERVE</div>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
                                    <Ticket size={32} color="#c9a050" strokeWidth={1.5} />
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '3px', color: '#888', marginBottom: '0.5rem' }}>{t('product.acquisitionId')}</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '1px' }}>#BE-{orderId || 'PENDING'}</div>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '4rem' }}>
                                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '1rem' }}>{t('product.reserveSelection')}</div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.1', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.name}</div>
                                    <div style={{ marginTop: '0.5rem', color: '#c9a050', fontSize: '0.8rem', fontWeight: '600' }}>{selectedSize} — {quantity} Units</div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '0.5rem' }}>{t('product.clientIdentity')}</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{formData.fullName}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#888', marginBottom: '0.5rem' }}>{t('product.validatedOn')}</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{new Date().toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '4rem', paddingTop: '4rem', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div style={{ maxWidth: '60%' }}>
                                        <div style={{ fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#444', marginBottom: '1rem' }}>Official Maison Document</div>
                                        <div style={{ fontSize: '0.7rem', color: '#666', lineHeight: '1.6' }}>This certificate authenticates the acquisition of artisanal coffee from the Black Energie reserve.</div>
                                    </div>
                                    {qrCodeBase64 && <img src={qrCodeBase64} alt="QR" style={{ width: '80px', height: '80px', filter: 'invert(1)' }} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <div className="product-header-spacer"></div>
            <div className="product-detail-container">
                <div className="product-detail-grid">
                    {/* Visual Section (Left) */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="product-visual-section">
                        <div className="breadcrumb">
                            <Link to="/shop">SHOP</Link>
                            <span style={{ margin: '0 10px' }}>/</span>
                            <span>{product.name}</span>
                        </div>

                        <div className="main-image-container">
                            <img src={product.image_url} alt={product.name} className="main-product-image" />
                            <div className="image-grain-overlay"></div>
                        </div>

                        <div className="product-guarantees" style={{ marginTop: '3rem' }}>
                            <div className="guarantee">
                                <div className="g-icon"></div>
                                <span>{t('product.freshlyRoasted')}</span>
                            </div>
                            <div className="guarantee">
                                <div className="g-icon"></div>
                                <span>{t('product.sustainableSourcing')}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '3rem', borderTop: '1px solid #f5f5f5', paddingTop: '2rem' }}>
                            <span className="section-subtitle">{t('product.discovery')}</span>
                            <div className="rating-pill" style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="#c9a050" color="#c9a050" />)}
                                </div>
                                <span>4.9 {t('product.reviewsCount', { count: 24 })}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Section (Right) */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="product-content-section">
                        <div className="product-info-header">
                            <h1 className="luxury-font product-name-title">{product.name}</h1>
                            <div className="product-price-tag">
                                {discountedPrice < basePrice ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                                        <span style={{ color: '#c9a050' }}>${discountedPrice.toFixed(2)}</span>
                                        <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '1.2rem', fontWeight: '300' }}>${basePrice.toFixed(2)}</span>
                                        <span style={{ background: '#c9a050', color: '#fff', fontSize: '0.7rem', padding: '4px 10px', fontWeight: 'bold', borderRadius: '2px' }}>
                                            -{activeOffer ? (activeOffer.discount_type === 'percentage' ? `${activeOffer.discount_value}%` : `$${activeOffer.discount_value}`) : ''}
                                        </span>
                                    </div>
                                ) : (
                                    `$${basePrice.toFixed(2)}`
                                )}
                            </div>
                        </div>

                        <div className="product-essence">
                            <h4 className="section-subtitle">{t('product.theEssence')}</h4>
                            <p className="essence-text">
                                {product.description || t('product.defaultDescription')}
                            </p>
                        </div>

                        <div className="product-selections">
                            <div className="selection-group">
                                <h4 className="section-subtitle">{t('product.selectWeight')}</h4>
                                <div className="weight-options">
                                    {(productWeights || [{ value: '250', unit: 'g', price: product.price }]).map((w, idx) => {
                                        const label = `${w.value}${w.unit}`;
                                        return (
                                            <button key={idx} className={`weight-btn ${selectedSize === label ? 'active' : ''}`} onClick={() => setSelectedSize(label)}>
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="selection-group">
                                <h4 className="section-subtitle">{t('product.quantity')}</h4>
                                <div className="quantity-controller">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16} /></button>
                                    <span className="qty-display">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)}><Plus size={16} /></button>
                                </div>
                            </div>
                        </div>

                        <div className="action-stack-v2">
                            <button className={`add-to-bag-btn ${added ? 'added' : ''}`} onClick={handleAddToBag}>
                                <ShoppingBag size={20} />
                                <span>{added ? t('product.added') : t('product.addToBag')}</span>
                            </button>
                            <button className="buy-now-btn" onClick={() => setShowCheckout(true)}>
                                <span>{t('product.buyNow')}</span>
                            </button>
                            <button className="share-btn-v2" onClick={() => setShowShareMenu(!showShareMenu)}>
                                <Share2 size={18} />
                            </button>
                        </div>

                        <div className="product-meta-details">
                            <div className="meta-item">
                                <span className="meta-label">{t('product.process')}</span>
                                <span className="meta-value">{t('product.honeyProcessed')}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">{t('product.roastLevel')}</span>
                                <span className="meta-value">{t('product.mediumDark')}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">{t('product.origin')}</span>
                                <span className="meta-value">{t('product.ethiopianHighlands')}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
            <RelatedProducts currentProductId={product?._id} />

            <AnimatePresence>
                {showCheckout && (
                    <motion.div className="checkout-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}>
                        <motion.div className="checkout-modal" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} style={{ width: '100%', maxWidth: '500px', background: '#fff', height: '100%', padding: '4rem 3rem', overflowY: 'auto' }}>
                            <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', position: 'absolute', top: '2rem', right: '2rem', cursor: 'pointer' }}><X size={24} /></button>
                            <h2 className="luxury-font" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>{t('product.checkout')}</h2>
                            
                            <div style={{ marginBottom: '3rem', padding: '2rem', background: '#fcfcfc', border: '1px solid #eee' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <img src={product.image_url} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#fff' }} />
                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>{product.name}</h4>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>{selectedSize} × {quantity}</p>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.9rem' }}>
                                        <span>Subtotal</span>
                                        <span>${itemTotal.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.9rem' }}>
                                        <span>Delivery {formData.city ? `(${formData.city})` : ''}</span>
                                        <span>{selectedDelivery ? (shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free') : 'Select City'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.1rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #ddd' }}>
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div>
                                    <label className="section-subtitle" style={{ display: 'block', marginBottom: '0.8rem' }}>{t('product.fullName')}</label>
                                    <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" placeholder={t('product.fullNamePlaceholder')} style={{ width: '100%', padding: '1rem 0', border: 'none', borderBottom: '1px solid #eee', fontSize: '1rem', outline: 'none' }} />
                                </div>
                                <div>
                                    <label className="section-subtitle" style={{ display: 'block', marginBottom: '0.8rem' }}>{t('product.whatsapp')}</label>
                                    <input required name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} type="tel" placeholder={t('product.whatsappPlaceholder')} style={{ width: '100%', padding: '1rem 0', border: 'none', borderBottom: '1px solid #eee', fontSize: '1rem', outline: 'none' }} />
                                </div>
                                <div>
                                    <label className="section-subtitle" style={{ display: 'block', marginBottom: '0.8rem' }}>City</label>
                                    <UserSelect 
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        options={deliveryCosts.map(d => ({ value: d.city, label: d.city }))}
                                        placeholder="Select your city"
                                    />
                                </div>
                                <div>
                                    <label className="section-subtitle" style={{ display: 'block', marginBottom: '0.8rem' }}>{t('product.address')}</label>
                                    <textarea required name="address" value={formData.address} onChange={handleInputChange} placeholder={t('product.addressPlaceholder')} style={{ width: '100%', padding: '1rem 0', border: 'none', borderBottom: '1px solid #eee', fontSize: '1rem', outline: 'none', minHeight: '100px', resize: 'none' }} />
                                </div>
                                <button type="submit" className="buy-now-btn">{t('product.completeOrder')}</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetail;
