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
                    const start = offer.start_date ? new Date(offer.start_date) : null;
                    const end = offer.end_date ? new Date(offer.end_date) : null;
                    return (!start || start <= now) && (!end || end >= now);
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
            </CartProvider>
        </LanguageProvider>
    );
};

export default AppUser;

