import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('black_energie_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('black_energie_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity, attributes = {}) => {
        setCart(prevCart => {
            // Create a robust unique key based on product ID and stringified attributes
            const attrString = JSON.stringify(attributes);
            const productId = product._id ? String(product._id) : String(product.id || Math.random());
            const uniqueId = `${productId}-${attrString}`;

            const existingItem = prevCart.find(item => item.cartId === uniqueId);
            
            if (existingItem) {
                return prevCart.map(item => 
                    item.cartId === uniqueId 
                        ? { ...item, quantity: item.quantity + quantity } 
                        : item
                );
            }
            
            return [...prevCart, { ...product, cartId: uniqueId, quantity, attributes }];
        });
    };

    const removeFromCart = (cartId) => {
        setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
    };

    const updateQuantity = (cartId, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.cartId === cartId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
