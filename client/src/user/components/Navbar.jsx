import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, User, Search, Menu, X, ArrowRight, Minus, Plus, Trash2, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import './navbar.css';

export const Navbar = ({ hasOffers, isWhitePage }) => {
  const { cart, cartCount, removeFromCart, updateQuantity } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const subtotal = cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSearchData = async () => {
        try {
            const res = await axios.get('/api/products');
            setAllProducts(res.data);
        } catch (err) {
            console.error("Error fetching products for search", err);
        }
    };
    fetchSearchData();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
    }
    const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setSearchResults(filtered.slice(0, 5));
  }, [searchQuery, allProducts]);

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <>
      <motion.nav 
        className={`navbar ${isScrolled ? 'scrolled' : ''} ${isWhitePage ? 'force-white' : ''}`}
        style={{ top: isScrolled ? 0 : (hasOffers ? '45px' : 0) }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav-container">
          <div className="nav-left">
            <Link to="/" className="brand-name">Black Energie</Link>
          </div>

          <div className="nav-right">
            <AnimatePresence mode="wait">
              {!isSearchOpen ? (
                <motion.div key="links" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="nav-links">
                  <Link to="/shop" className="nav-link">{t('nav.shop')}</Link>
                  <Link to="/packs" className="nav-link">{t('nav.packs')}</Link>
                  <Link to="/magazine" className="nav-link">{t('nav.magazine')}</Link>
                  <Link to="/track" className="nav-link">{t('nav.trackOrder')}</Link>
                </motion.div>
              ) : (
                <motion.div key="search" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="search-container" style={{ position: 'relative' }}>
                  <input type="text" placeholder={t('nav.searchPlaceholder')} className="fashion-search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
                  <button className="close-search" onClick={handleSearchClose}><X size={18} strokeWidth={1} /></button>
                  <AnimatePresence>
                    {searchResults.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="search-results-dropdown" style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', width: '350px', marginTop: '1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '1rem', border: '1px solid #eee', borderRadius: '4px', zIndex: 1000 }}>
                            <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#aaa', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f9f9f9' }}>
                                {t('nav.foundProducts', { count: searchResults.length })}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {searchResults.map(p => (
                                    <Link key={p.id} to={`/product/${p.slug}`} onClick={handleSearchClose} style={{ display: 'flex', gap: '1rem', textDecoration: 'none', color: '#000', transition: 'opacity 0.2s' }}>
                                        <div style={{ width: '50px', height: '65px', background: '#f5f5f5', flexShrink: 0 }}><img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><h4 className="luxury-font" style={{ fontSize: '0.9rem', margin: 0 }}>{p.name}</h4><span style={{ fontSize: '0.8rem', color: '#c9a050', fontWeight: '500' }}>${p.price}</span></div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="nav-actions">
              <div style={{ position: 'relative' }}>
                <button className="nav-icon-btn nav-desktop-only" onClick={() => setIsLangOpen(!isLangOpen)} aria-label="Change Language">
                  <Languages size={18} strokeWidth={1} />
                  <span style={{ fontSize: '0.65rem', marginLeft: '4px', textTransform: 'uppercase' }}>{language}</span>
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ position: 'absolute', top: '100%', right: 0, background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '0.5rem', borderRadius: '4px', display: 'flex', flexDirection: 'column', minWidth: '100px', zIndex: 1000, marginTop: '0.5rem' }}>
                      {['en', 'fr', 'ar'].map((lang) => (
                        <button key={lang} onClick={() => { setLanguage(lang); setIsLangOpen(false); }} style={{ padding: '0.6rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.7rem', textAlign: language === 'ar' ? 'right' : 'left', textTransform: 'uppercase', letterSpacing: '1px', color: language === lang ? '#c9a050' : '#000', fontWeight: language === lang ? '700' : '400' }}>
                          {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'العربية'}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!isSearchOpen && (
                <button className="nav-icon-btn nav-desktop-only" aria-label="Search" onClick={() => setIsSearchOpen(true)}><Search size={18} strokeWidth={1} /></button>
              )}
              <Link to="/login" className="nav-icon-btn nav-desktop-only" aria-label="Profile"><User size={18} strokeWidth={1} /></Link>
              <div style={{ position: 'relative' }}>
                <button className="nav-icon-btn" aria-label="Cart" onClick={() => setIsCartOpen(true)}>
                  <ShoppingBag size={18} strokeWidth={1} />
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </button>
              </div>
              <button className="mobile-toggle nav-icon-btn" onClick={() => setIsMenuOpen(true)}><Menu size={22} strokeWidth={1} /></button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div className="cart-drawer-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} style={{ zIndex: 3000 }} />
            <motion.div className="cart-drawer mobile-menu-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} style={{ zIndex: 3001 }}>
              <div className="cart-header mobile-menu-header">
                <h2>{t('nav.menu')}</h2>
                <button className="close-cart-btn" onClick={() => setIsMenuOpen(false)}><X size={24} strokeWidth={1} /></button>
              </div>
              <div className="mobile-menu-content">
                <Link to="/" className="mobile-menu-brand" onClick={() => setIsMenuOpen(false)}>Black Energie</Link>
                <div className="mobile-menu-links">
                  <Link to="/shop" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>{t('nav.shop')}</Link>
                  <Link to="/packs" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>{t('nav.packs')}</Link>
                  <Link to="/magazine" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>{t('nav.magazine')}</Link>
                  <Link to="/track" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>{t('nav.trackOrder')}</Link>
                  <Link to="/login" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>{t('nav.login')}</Link>
                </div>
                <div className="mobile-menu-search">
                  <div className="mobile-search-bar" style={{ position: 'relative' }}>
                    <Search size={20} strokeWidth={1} />
                    <input type="text" placeholder={t('nav.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <AnimatePresence>
                        {searchResults.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', marginTop: '0.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', padding: '1rem', zIndex: 1000, border: '1px solid #eee' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {searchResults.map(p => (
                                        <Link key={p.id} to={`/product/${p.slug}`} onClick={() => { setIsMenuOpen(false); setSearchQuery(''); }} style={{ display: 'flex', gap: '1rem', textDecoration: 'none', color: '#000' }}>
                                            <div style={{ width: '40px', height: '50px', background: '#f5f5f5' }}><img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><h4 style={{ fontSize: '0.85rem', margin: 0 }}>{p.name}</h4><span style={{ fontSize: '0.75rem', color: '#c9a050' }}>${p.price}</span></div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div className="cart-drawer-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} />
            <motion.div className="cart-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
              <div className="cart-header">
                <h2>{t('nav.cartTitle')} ({cartCount})</h2>
                <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}><X size={24} strokeWidth={1} /></button>
              </div>
              <div className="cart-items">
                {cart.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingBag size={48} strokeWidth={0.5} />
                    <p>{t('nav.emptyCart')}</p>
                    <button className="start-shopping-btn" onClick={() => setIsCartOpen(false)}>{t('nav.startShopping')} <ArrowRight size={14} /></button>
                  </div>
                ) : (
                  <div className="cart-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {cart.map((item) => (
                      <div key={item.cartId} className="cart-item" style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #f9f9f9', paddingBottom: '1.5rem' }}>
                        <div style={{ width: '90px', height: '110px', background: '#f5f5f5', flexShrink: 0 }}><img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <h4 className="luxury-font" style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{item.name}</h4>
                            <p style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.attributes?.size || '250G'}</p>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #eee', padding: '0.3rem 0.6rem' }}>
                              <button onClick={() => updateQuantity(item.cartId, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Minus size={12} /></button>
                              <span style={{ fontSize: '0.85rem', fontWeight: '600', minWidth: '15px', textAlign: 'center' }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.cartId, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={12} /></button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                <span style={{ fontWeight: '500', fontSize: '1rem' }}>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                                <button onClick={() => removeFromCart(item.cartId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc' }}><Trash2 size={14} /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="cart-footer">
                  <div className="cart-subtotal">
                    <span>{t('cart.subtotal')}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <Link to="/cart" className="checkout-btn" style={{ textDecoration: 'none', textAlign: 'center' }} onClick={() => setIsCartOpen(false)}>{t('nav.checkout')}</Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
