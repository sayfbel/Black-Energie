import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, CheckCircle, ArrowRight, Truck, ShieldCheck, Download, Ticket, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import RelatedProducts from '../components/RelatedProducts';
import { generatePremiumPDF } from '../utils/pdfGenerator';
import { generateLocalQRCode } from '../utils/qrGenerator';
import { useLanguage } from '../context/LanguageContext';
import './../css/cart.css';
import UserSelect from '../components/UserSelect';

const ShoppingBagPage = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const { showNotification } = useNotification();
    const { t, language } = useLanguage();
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const [lastOrderId, setLastOrderId] = useState(null);
    const [confirmedItems, setConfirmedItems] = useState([]);
    const [qrCodeBase64, setQrCodeBase64] = useState(null);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [deliveryCosts, setDeliveryCosts] = useState([]);

    // Checkout Form State
    const [formData, setFormData] = useState({
        fullName: '',
        whatsapp: '',
        address: '',
        city: ''
    });

    const subtotal = cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
    
    // Apply coupon discount
    const couponDiscount = appliedCoupon ? (
        appliedCoupon.discount_type === 'percentage' 
            ? subtotal * (appliedCoupon.discount_value / 100)
            : Math.min(subtotal, appliedCoupon.discount_value)
    ) : 0;

    const discountedSubtotal = subtotal - couponDiscount;
    const selectedDelivery = deliveryCosts.find(d => d.city === formData.city);
    // If a city is selected, use its delivery cost. Otherwise default to 0.
    const shipping = selectedDelivery ? Number(selectedDelivery.cost) : 0;
    const total = discountedSubtotal + shipping;

    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get('/api/delivery-costs')
            .then(res => setDeliveryCosts(res.data))
            .catch(err => console.error("Error fetching delivery costs", err));
    }, []);

    // Fetch QR Code and convert to Base64 to bypass CORS issues in PDF
    useEffect(() => {
        const prepareQR = async () => {
            if (orderConfirmed && lastOrderId) {
                const trackingUrl = `${window.location.origin}/track/${lastOrderId}`;
                const dataUrl = await generateLocalQRCode(trackingUrl);
                setQrCodeBase64(dataUrl);
            }
        };
        prepareQR();
    }, [orderConfirmed, lastOrderId]);

    const handleDownloadPDF = async () => {
        if (generatingPDF) return;
        
        if (!qrCodeBase64) {
            showNotification("Finalizing your certificate logistics. Please wait 2 seconds.", "info");
            return;
        }

        setGeneratingPDF(true);
        const fileName = `Black_Energie_Reserve_${lastOrderId || 'Order'}.pdf`;
        
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            await generatePremiumPDF('acquisition-ticket', fileName);
            showNotification("Your artisanal certificate has been generated.", "success");
        } catch (err) {
            console.error("PDF generation failed:", err);
            showNotification("Certificate generation failed. Please try again.", "error");
        } finally {
            setGeneratingPDF(false);
        }
    };

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const itemsSnapshot = [...cart];
            setConfirmedItems(itemsSnapshot);

            const product_names = itemsSnapshot.map(item => `${item.name} (${item.attributes?.size || '250g'}) x${item.quantity}`).join(' | ');
            const orderTotal = isNaN(total) ? 0 : Number(total.toFixed(2));
            
            const res = await axios.post('/api/orders', {
                product_name: product_names,
                customer_name: formData.fullName,
                customer_whatsapp: formData.whatsapp,
                customer_address: formData.address,
                weight: 'Multiple',
                quantity: itemsSnapshot.reduce((acc, item) => acc + item.quantity, 0),
                total_price: orderTotal
            });

            setLastOrderId(res.data.id);
            setOrderConfirmed(true);
            showNotification("Your reserve has been successfully acquired.", "success");
            clearCart();
        } catch (err) {
            console.error("Order error:", err);
            showNotification("The acquisition could not be finalized. Please verify your details.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponLoading(true);
        try {
            const res = await axios.post('/api/marketing/coupons/validate', {
                code: couponCode,
                orderAmount: subtotal
            });
            setAppliedCoupon(res.data);
            showNotification('Coupon applied successfully!', 'success');
        } catch (err) {
            showNotification(err.response?.data?.error || 'Invalid coupon', 'error');
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    if (orderConfirmed) {
        return (
            <div className="shopping-bag-page" style={{ background: '#fff', minHeight: '100vh' }}>
                <style>{`
                    .navbar { background: #000 !important; }
                    .nav-link, .brand-name, .nav-icon-btn { color: #fff !important; }
                    .navbar.scrolled { background: #000 !important; }
                `}</style>
                <div className="navbar-spacer" style={{ height: '100px' }}></div>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }}>
                    <div className="cart-grid confirmed-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '8rem', alignItems: 'center' }}>
                        
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
                            <div style={{ marginBottom: '4rem' }}>
                                <CheckCircle size={48} color="#c9a050" strokeWidth={1} style={{ marginBottom: '2rem' }} />
                                <h1 className="luxury-font" style={{ fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: '1', color: '#000' }}>
                                    {language === 'ar' ? <>تم تأكيد <br/>الحيازة</> : language === 'fr' ? <>Acquisition <br/>Confirmée</> : <>Acquisition <br/>Confirmed</>}
                                </h1>
                                <p style={{ color: '#888', fontSize: '1rem', letterSpacing: '1px', maxWidth: '400px', lineHeight: '1.6' }}>
                                    {t('product.certificateDescription')}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '350px' }}>
                                <button onClick={handleDownloadPDF} disabled={generatingPDF} style={{ background: '#000', color: '#fff', border: 'none', padding: '1.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px', cursor: generatingPDF ? 'not-allowed' : 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', transition: 'all 0.3s', opacity: generatingPDF ? 0.7 : 1 }}>
                                    {generatingPDF ? t('cart.downloading') : <><Download size={18} /> {t('product.downloadCertificate')}</>}
                                </button>
                                <Link to="/" style={{ background: 'transparent', color: '#000', border: '1px solid #eee', padding: '1.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px', textDecoration: 'none', fontSize: '0.85rem', textAlign: 'center', transition: 'all 0.3s' }}>
                                    {t('product.skipToMaison')}
                                </Link>
                            </div>

                            <div style={{ marginTop: '5rem', display: 'flex', gap: '3rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.65rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <ShieldCheck size={16} /> {t('product.secureVerification')}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.65rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <Truck size={16} /> {t('product.priorityLogistics')}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
                            <div id="acquisition-ticket" style={{ background: '#0b0b0b', color: '#fff', width: '100%', maxWidth: '450px', padding: '0', textAlign: 'center', position: 'relative', boxShadow: '0 50px 100px rgba(0,0,0,0.15)', borderRadius: '2px', border: '1px solid rgba(201, 160, 80, 0.25)', overflow: 'hidden', fontFamily: 'var(--font-body)', margin: '0 auto' }}>
                                <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', bottom: '12px', border: '1px solid rgba(201, 160, 80, 0.12)', pointerEvents: 'none' }}></div>
                                <div style={{ padding: '3.5rem 2rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', letterSpacing: '6px', textTransform: 'uppercase', margin: 0, fontWeight: '400' }}>Black Energie</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginTop: '1rem' }}>
                                        <div style={{ height: '1px', width: '25px', background: '#c9a050' }}></div>
                                        <span style={{ color: '#c9a050', fontSize: '0.6rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: '700' }}>{t('tracker.authenticCertificate')}</span>
                                        <div style={{ height: '1px', width: '25px', background: '#c9a050' }}></div>
                                    </div>
                                </div>
                                <div style={{ padding: '2.5rem' }}>
                                    <div style={{ marginBottom: '2.5rem' }}>
                                        <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '4px', display: 'block', marginBottom: '0.8rem' }}>Portfolio ID</span>
                                        <span style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: '#c9a050', letterSpacing: '3px' }}>#{lastOrderId || 'PENDING'}</span>
                                    </div>
                                    <div style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
                                        <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>{t('product.reserveSelection')}</span>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {confirmedItems.map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.8rem' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.5px' }}>{item.name}</div>
                                                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>{item.attributes?.size || '250g'} x{item.quantity}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', textAlign: 'left', marginBottom: '2.5rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>{t('product.clientIdentity')}</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{formData.fullName}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>{t('product.validatedOn')}</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem 1.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2.5rem' }}>
                                        <div style={{ background: '#fff', padding: '0.7rem', borderRadius: '2px', display: 'inline-block', marginBottom: '1rem' }}>
                                            {qrCodeBase64 ? <img src={qrCodeBase64} alt="Order QR" crossOrigin="anonymous" style={{ width: '110px', height: '110px', display: 'block' }} /> : <div style={{ width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.6rem' }}>LOADING...</div>}
                                        </div>
                                        <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '3px', margin: 0 }}>{t('tracker.scanLogistics')}</p>
                                    </div>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '0.8rem' }}>
                                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '300', letterSpacing: '2px' }}>{t('cart.total').toUpperCase()}</span>
                                            <span style={{ fontSize: '1.8rem', color: '#c9a050', fontWeight: '700' }}>${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(201, 160, 80, 0.05)', padding: '2rem', borderTop: '1px solid rgba(201, 160, 80, 0.1)' }}>
                                    <p style={{ fontSize: '0.55rem', color: 'rgba(201, 160, 80, 0.5)', letterSpacing: '5px', textTransform: 'uppercase', margin: 0 }}>{t('tracker.authenticCertificate')}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div style={{ minHeight: '100vh', background: '#fff' }}>
                <div style={{ height: '100px', background: '#000' }}></div>
                <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
                        <ShoppingBag size={80} strokeWidth={0.5} style={{ marginBottom: '2rem', color: '#ccc' }} />
                        <h1 className="luxury-font" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{t('cart.emptyTitle')}</h1>
                        <p style={{ color: '#888', marginBottom: '3rem', maxWidth: '400px' }}>{t('cart.emptyDesc')}</p>
                        <Link to="/shop" style={{ padding: '1.2rem 3rem', textDecoration: 'none', background: '#000', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', display: 'inline-block' }}>{t('cart.exploreShop')}</Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fff', paddingBottom: '10rem', fontFamily: 'Outfit, sans-serif' }}>
            <div style={{ height: '100px', background: '#000' }}></div>
            <div className="cart-page-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="luxury-font cart-title" style={{ fontSize: '4.5rem', marginBottom: '5rem', letterSpacing: '2px' }}>
                    {t('cart.title')} ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                </motion.h1>

                <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr', paddingBottom: "8rem", gap: '8rem', alignItems: 'start' }}>
                    <div className="cart-items-list">
                        <div style={{ borderBottom: '2px solid #000', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '800' }}>
                            <span>{t('cart.selection')}</span>
                            <span>{t('cart.total')}</span>
                        </div>

                        <AnimatePresence>
                            {cart.map((item, i) => (
                                <motion.div key={item.cartId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="cart-item" style={{ display: 'flex', gap: '3rem', padding: '3rem 0', borderBottom: '1px solid #f0f0f0' }}>
                                    <div className="cart-item-image" style={{ width: '180px', height: '220px', background: '#f9f9f9', flexShrink: 0, overflow: 'hidden' }}>
                                        <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="cart-item-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <h3 className="luxury-font" style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{item.name}</h3>
                                            <p style={{ color: '#888', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                                {item.attributes?.size || '250G'} / {t('cart.premiumRoast')}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', padding: '0.8rem' }}>
                                                <button onClick={() => updateQuantity(item.cartId, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 1rem' }}><Minus size={14} /></button>
                                                <span style={{ width: '30px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.cartId, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 1rem' }}><Plus size={14} /></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.cartId)} style={{ background: 'none', border: 'none', color: '#000', opacity: 0.4, cursor: 'pointer', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', textDecoration: 'underline' }}>{t('cart.remove')}</button>
                                        </div>
                                    </div>
                                    <div className="cart-item-price" style={{ textAlign: 'right', minWidth: '120px' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: '400' }}>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="cart-summary-column">
                        <div style={{ padding: '3rem', background: '#fcfcfc', border: '1px solid #eee' }}>
                            <h2 className="luxury-font" style={{ fontSize: '2.2rem', marginBottom: '2.5rem' }}>{t('cart.summary')}</h2>
                            <div className="summary-items" style={{ marginBottom: '2.5rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
                                {cart.map(item => (
                                    <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#000', fontWeight: '500' }}>{item.name} <span style={{ color: '#aaa', fontSize: '0.7rem', marginLeft: '5px' }}>x{item.quantity}</span></span>
                                        <span style={{ color: '#666' }}>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '3rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <span>{t('cart.subtotal')}</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c9a050', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        <span>{t('product.coupon')} ({appliedCoupon.code})</span>
                                        <span>-${couponDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <span>{t('cart.shipping')}</span>
                                    <span style={{ color: shipping === 0 ? '#27ae60' : '#666' }}>{shipping === 0 ? t('cart.complimentary') : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div style={{ height: '1px', background: '#eee', margin: '0.5rem 0' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.6rem', fontWeight: '300' }}>
                                    <span>{t('cart.total')}</span>
                                    <span style={{ color: '#c9a050' }}>${total.toFixed(2)}</span>
                                </div>
                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <input type="text" placeholder={t('cart.coupon')} value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} style={{ flex: 1, border: '1px solid #eee', padding: '0.8rem', outline: 'none', fontSize: '0.75rem', background: 'transparent', color: '#000' }} disabled={appliedCoupon} />
                                    <button type="button" onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCode(''); } : handleApplyCoupon} style={{ background: '#000', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>{appliedCoupon ? t('product.remove') : (couponLoading ? '...' : t('product.apply'))}</button>
                                </div>
                            </div>
                            <div style={{ marginTop: '4rem' }}>
                                <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800', marginBottom: '2.5rem', borderBottom: '2px solid #000', paddingBottom: '0.5rem', display: 'inline-block' }}>{t('cart.shippingDetails')}</h3>
                                <form id="checkout-form" onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#aaa', marginBottom: '0.3rem', display: 'block' }}>{t('product.fullName')}</label>
                                        <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" style={{ width: '100%', border: 'none', borderBottom: '1px solid #eee', padding: '0.8rem 0', outline: 'none', fontSize: '0.95rem', background: 'transparent' }} placeholder={t('product.fullNamePlaceholder')} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#aaa', marginBottom: '0.3rem', display: 'block' }}>{t('product.whatsapp')}</label>
                                        <input required name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} type="tel" style={{ width: '100%', border: 'none', borderBottom: '1px solid #eee', padding: '0.8rem 0', outline: 'none', fontSize: '0.95rem', background: 'transparent' }} placeholder={t('product.whatsappPlaceholder')} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#aaa', marginBottom: '0.3rem', display: 'block' }}>City</label>
                                        <UserSelect 
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            options={deliveryCosts.map(d => ({ value: d.city, label: d.city }))}
                                            placeholder="Select your city"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#aaa', marginBottom: '0.3rem', display: 'block' }}>{t('product.address')}</label>
                                        <input required name="address" value={formData.address} onChange={handleInputChange} type="text" style={{ width: '100%', border: 'none', borderBottom: '1px solid #eee', padding: '0.8rem 0', outline: 'none', fontSize: '0.95rem', background: 'transparent' }} placeholder={t('product.addressPlaceholder')} />
                                    </div>
                                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.7rem', color: '#888' }}>
                                            <ShieldCheck size={14} /> {t('cart.secureTransaction')}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.7rem', color: '#888' }}>
                                            <Truck size={14} /> {t('cart.expressShipping')}
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading} style={{ width: '100%', background: '#000', color: '#fff', border: 'none', padding: '1.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', transition: 'all 0.3s', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
                                        {loading ? t('cart.processing') : t('cart.confirmOrder')} <ArrowRight size={18} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <RelatedProducts currentProductId={null} showQuickAdd={true} />
            </div>
        </div>
    );
};

export default ShoppingBagPage;
