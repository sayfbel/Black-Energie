import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Shop from './pages/Shop';
import Packs from './pages/Packs';
import Magazine from './pages/Magazine';
import ShoppingBagPage from './pages/ShoppingBag';
import { Navbar } from './components/Navbar';
import OffersNav from './components/OffersNav';
import Footer from './components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import OrderTracker from './pages/OrderTracker';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Accessibility from './pages/Accessibility';
import Contact from './pages/Contact';
import ShippingReturns from './pages/ShippingReturns';
import Wholesale from './pages/Wholesale';
import NotFound from './pages/NotFound';

import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { Chatbot } from './components/Chatbot';

const AppUser = () => {
    const [offers, setOffers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingOffers, setLoadingOffers] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [offersRes, productsRes] = await Promise.all([
                    axios.get('/api/marketing/offers'),
                    axios.get('/api/products')
                ]);
                
                const now = new Date();
                const activeOffers = offersRes.data.filter(offer => {
                    const parseDate = (dStr, isEnd = false) => {
                        if (!dStr || dStr.startsWith('0000-00-00') || dStr === '') return null;
                        const d = new Date(dStr);
                        if (isNaN(d.getTime())) return null;
                        // If it's the end date and formatted as YYYY-MM-DD, make it active until the very end of that day
                        if (isEnd && dStr.includes('-') && !dStr.includes('T') && !dStr.includes(':')) {
                            d.setHours(23, 59, 59, 999);
                        }
                        return d;
                    };
                    
                    const start = parseDate(offer.start_date, false);
                    const end = parseDate(offer.end_date, true);
                    const isActive = offer.is_active !== 0 && offer.is_active !== false;

                    return isActive && (!start || start <= now) && (!end || end >= now);
                });

                setOffers(activeOffers);
                setProducts(productsRes.data);
            } catch (err) {
                console.error("Error fetching data for AppUser", err);
            } finally {
                setLoadingOffers(false);
            }
        };
        fetchData();
    }, []);

    const hasOffers = offers.length > 0;
    const isWhitePage = location.pathname.includes('/product/heavy-body');

    return (
        <LanguageProvider>
            <CartProvider>
            <ScrollToTop />
            {!loadingOffers && hasOffers && <OffersNav offers={offers} products={products} />}
            <Navbar hasOffers={hasOffers} isWhitePage={isWhitePage} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/packs" element={<Packs />} />
                <Route path="/magazine" element={<Magazine />} />
                <Route path="/cart" element={<ShoppingBagPage />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/track" element={<OrderTracker />} />
                <Route path="/track/:orderId" element={<OrderTracker />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shipping-returns" element={<ShippingReturns />} />
                <Route path="/wholesale" element={<Wholesale />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <Chatbot />
            </CartProvider>
        </LanguageProvider>
    );
};

export default AppUser;

