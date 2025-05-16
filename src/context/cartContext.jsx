import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../api/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    
    const fetchCartFromBackend = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await axios.get(`${BASE_URL}/cart`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const fetchedCart = res.data.map((item) => ({
                id: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
                category: item.category,
                description: item.description,
            }));

            setCartItems(fetchedCart);
        } catch (err) {
            console.error('Failed to fetch cart from backend:', err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || cartItems.length === 0) return;

        axios
            .post(
                `${BASE_URL}/cart/sync`,
                {
                    items: cartItems.map((item) => ({
                        productId: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: item.quantity,
                        category: item.category,
                        description: item.description,
                    })),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .catch((err) => console.error('Cart sync error:', err));
    }, [cartItems]);

    // ➕ Cart Functions
    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const incrementQuantity = (productId) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decrementQuantity = (productId) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                incrementQuantity,
                decrementQuantity,
                removeFromCart,
                clearCart,
                fetchCartFromBackend,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
