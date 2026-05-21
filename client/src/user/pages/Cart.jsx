import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, PlusCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './../css/cart.css';

const Cart = () => {
    const { cart, addToCart } = useCart();
    const [recommendations, setRecommendations] = useState([]);
    const [addedId, setAddedId] = useState(null);

    const subtotal = cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await axios.get('/api/products');
                const cartIds = cart.map(item => item._id);
                const filtered = res.data.filter(p => !cartIds.includes(p._id)).slice(0, 4);
                setRecommendations(filtered);
            } catch (err) {
                console.error("Error fetching recommendations:", err);
            }
        };
        fetchRecommendations();
        window.scrollTo(0, 0);
    }, [cart]);

    const handleQuickAdd = (product) => {
        addToCart(product, 1);
        setAddedId(product._id);
        setTimeout(() => setAddedId(null), 2000);
    };

    if (cart.length === 0) {
        return (
            <div style={{ minHeight: '100vh', background: '#fff' }}>
                <div style={{ height: '100px', background: '#000' }}></div>
                <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
                        <ShoppingBag size={80} strokeWidth={0.5} style={{ marginBottom: '2rem', color: '#ccc' }} />
                        <h1 className="luxury-font" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Your Bag is Empty</h1>
                        <p style={{ color: '#888', marginBottom: '3rem', maxWidth: '400px' }}>Your collection is currently empty. Explore our exclusive reserves to start your journey.</p>
                        <Link to="/shop" style={{ padding: '1.2rem 3rem', textDecoration: 'none', background: '#000', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', display: 'inline-block' }}>Explore Shop</Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fff', paddingBottom: '10rem', fontFamily: 'Outfit, sans-serif' }}>
            <div style={{ height: '100px', background: '#000' }}></div>

            <div className="cart-page-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="luxury-font cart-title"
                    style={{ fontSize: '4.5rem', marginBottom: '5rem', letterSpacing: '2px' }}
                >
                    Shopping Bag
                </motion.h1>

                <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '8rem' }}>

                    <div className="cart-items-list">
                        <div style={{ borderBottom: '2px solid #000', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '800' }}>
                            <span>The Selection</span>
                            <span>Total</span>
                        </div>

                        <AnimatePresence>
                            {cart.map((item, i) => (
                                    <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="cart-item"
                                    style={{ display: 'flex', gap: '3rem', padding: '3rem 0', borderBottom: '1px solid #f0f0f0' }}
                                >
                                    <div className="cart-item-image" style={{ width: '180px', height: '220px', background: '#f9f9f9', flexShrink: 0, overflow: 'hidden' }}>
                                        <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>

                                    <div className="cart-item-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <h3 className="luxury-font" style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{item.name}</h3>
                                            <p style={{ color: '#888', fontSize: '0.9rem', letterSpacing: '1px' }}>PREMIUM ROAST / 250G</p>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', padding: '0.8rem' }}>
                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 1rem' }}><Minus size={14} /></button>
                                                <span style={{ width: '30px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 1rem' }}><Plus size={14} /></button>
                                            </div>
                                            <button style={{ background: 'none', border: 'none', color: '#000', opacity: 0.4, cursor: 'pointer', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', textDecoration: 'underline' }}>
                                                Remove
                                            </button>
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
                        <div className="cart-summary-card" style={{ padding: '4rem', background: '#fcfcfc', color: '#000', border: '1px solid #eee', position: 'sticky', top: '140px' }}>
                            <h2 className="luxury-font" style={{ fontSize: '2.2rem', marginBottom: '3rem' }}>Order Summary</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.9rem' }}>
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.9rem' }}>
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'COMPLIMENTARY' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div style={{ height: '1px', background: '#eee', margin: '1rem 0' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.8rem', fontWeight: '300' }}>
                                    <span>Total</span>
                                    <span style={{ color: '#c9a050' }}>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button style={{ width: '100%', background: '#000', color: '#fff', border: 'none', padding: '1.5rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '3px', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                Secure Checkout <ArrowRight size={18} />
                            </button>
                            <button style={{ width: '100%', background: 'transparent', color: '#000', border: '1px solid #000', padding: '1.2rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}>
                                PayPal Checkout
                            </button>
                        </div>
                    </div>
                </div>

                {recommendations.length > 0 && (
                    <div style={{ marginTop: '10rem', borderTop: '1px solid #eee', paddingTop: '8rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '4px', color: '#c9a050', fontWeight: '700', display: 'block', marginBottom: '1rem' }}>Elevate Your Experience</span>
                            <h2 className="luxury-font recommendations-title" style={{ fontSize: '3.5rem' }}>The Curated Selection</h2>
                        </div>

                        <div className="recommendations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem' }}>
                            {recommendations.map((p) => (
                                <motion.div
                                    key={p._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -10 }}
                                    style={{ padding: '2rem', background: '#fff', border: '1px solid #f0f0f0', textAlign: 'center', position: 'relative' }}
                                >
                                    <div style={{ height: '280px', marginBottom: '2rem', overflow: 'hidden', background: '#fcfcfc' }}>
                                        <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
                                    </div>
                                    <h4 className="luxury-font" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{p.name}</h4>
                                    <p style={{ color: '#888', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '1rem' }}>RESERVE SELECTION</p>
                                    <p style={{ color: '#000', fontWeight: '600', fontSize: '1.1rem', marginBottom: '2rem' }}>${Number(p.price).toFixed(2)}</p>

                                    <button
                                        onClick={() => handleQuickAdd(p)}
                                        style={{
                                            width: '100%',
                                            background: '#000',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '1.2rem',
                                            fontSize: '0.8rem',
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
                                        {addedId === p._id ? <CheckCircle size={16} color="#27ae60" /> : <PlusCircle size={16} />}
                                        {addedId === p._id ? 'Added to Bag' : 'Quick Add'}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
