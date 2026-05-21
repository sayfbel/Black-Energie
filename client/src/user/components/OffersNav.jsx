import React, { useState, useEffect } from 'react';
import './offersNav.css';

const OffersNav = ({ offers, products }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getOfferText = (offer) => {
        let targetText = "";
        if (offer.type === 'all') {
            targetText = "ALL COLLECTIONS";
        } else {
            const targetProducts = products.filter(p => offer.target_ids.includes(p.id));
            if (offer.type === 'single') {
                targetText = targetProducts[0]?.name?.toUpperCase() || "SELECTED ITEM";
            } else if (offer.type === 'group') {
                targetText = targetProducts.map(p => p.name?.toUpperCase()).join(' & ') || "COLLECTION GROUP";
            }
        }

        const value = offer.discount_type === 'percentage' ? `${offer.discount_value}%` : `$${offer.discount_value}`;
        return `${offer.name.toUpperCase()}: ${value} OFF ON ${targetText}`;
    };

    if (!offers || offers.length === 0) return null;

    // Duplicate offers to create the infinite scroll effect
    const marqueeItems = [...offers, ...offers, ...offers, ...offers];

    return (
        <div className={`offers-nav ${isScrolled ? 'scrolled' : ''}`}>
            <div className="marquee-container">
                <div className="marquee-content">
                    {marqueeItems.map((offer, index) => (
                        <div key={`${offer.id}-${index}`} className="offer-item">
                            <span className="offer-bullet">●</span>
                            {getOfferText(offer)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OffersNav;
