import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, pharmacy) => {
        setCartItems(prev => {
            const existing = prev.find(item => item._id === product._id && item.pharmacyId === pharmacy._id);
            if (existing) {
                return prev.map(item => 
                    item._id === product._id && item.pharmacyId === pharmacy._id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
                );
            }
            return [...prev, { ...product, quantity: 1, pharmacyId: pharmacy._id, pharmacyName: pharmacy.pharmacyName }];
        });
    };

    const removeFromCart = (productId, pharmacyId) => {
        setCartItems(prev => prev.filter(item => !(item._id === productId && item.pharmacyId === pharmacyId)));
    };

    const updateQuantity = (productId, pharmacyId, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item._id === productId && item.pharmacyId === pharmacyId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCartItems([]);

    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
