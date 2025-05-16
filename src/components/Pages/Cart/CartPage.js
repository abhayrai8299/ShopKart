import React, { useState } from 'react';
import { useCart } from '../../../context/cartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../api/api';

export default function CartPage() {
  const { cartItems, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.price > 50 ? (item.price * 0.8).toFixed(2) : item.price;
    return acc + price * item.quantity;
  }, 0);

  let shipping = 0;
  if (subtotal > 10 && subtotal < 40) {
    shipping = 7.99;
  } else if (subtotal >= 40 && subtotal < 90) {
    shipping = 4.99;
  } else if (subtotal >= 90 && subtotal < 120) {
    shipping = 3.99;
  } else if (subtotal >= 120) {
    shipping = 2.99;
  }

  const total = subtotal + shipping;

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setErrorMsg('⚠️ Please login to place an order to continue.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }


    try {
      const placedAt = new Date();
      const deliveryDate = new Date(placedAt);
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      const orderDetails = {
        items: cartItems.map(item => ({
          ...item,
          discountedPrice: item.price > 50 ? (item.price * 0.8).toFixed(2) : item.price.toFixed(2),
        })),
        totalAmount: total,
        shippingFee: shipping,
        placedAt: new Date(),
        deliveryDate,
      };


      await axios.post(`${BASE_URL}/orders`, orderDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });

      clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (orderPlaced) {
    const placedDate = new Date();
    const deliveryDate = new Date(placedDate);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    const orderId = Math.floor(Math.random() * 1000000000);

    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 Order Placed Successfully!</h2>
        <p className="text-gray-700">Thank you for shopping with <span className="font-semibold">E Kart</span>.</p>

        <div className="mt-6 text-left max-w-md mx-auto bg-white p-4 rounded shadow-md">
          <p><span className="font-semibold">🆔 Order ID:</span> #{orderId}</p>
          <p><span className="font-semibold">📦 Placed on:</span> {placedDate.toLocaleDateString()}</p>
          <p><span className="font-semibold">🚚 Estimated Delivery:</span> {deliveryDate.toLocaleDateString()}</p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            View Order History
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛒 Your Cart</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
      {errorMsg && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative transition-all">
          <strong className="font-semibold">Oops!</strong> <span>{errorMsg}</span>
        </div>
      )}
      {cartItems.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded shadow"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <div>
                    <h2 className="text-lg font-semibold mb-1">{item.name}</h2>
                    {item.category && (
                      <p className="text-sm text-gray-600">Category: {item.category}</p>
                    )}
                    {item.price > 50 ? (
                      <div className="text-sm space-x-2">
                        <span className="text-gray-400 line-through">${item.price.toFixed(2)}</span>
                        <span className="text-blue-600 font-bold">
                          ${(item.price * 0.8).toFixed(2)} <span className="text-xs text-green-700">(20% off)</span>
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700">Price: ${item.price.toFixed(2)}</p>
                    )}

                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1 truncate max-w-xs">{item.description}</p>
                    )}

                  </div>

                </div>

                <div className="flex items-center mt-4 md:mt-0 space-x-3">
                  <button
                    onClick={() => decrementQuantity(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => incrementQuantity(item.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
