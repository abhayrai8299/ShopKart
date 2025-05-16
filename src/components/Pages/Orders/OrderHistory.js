import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../api/api';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.get(`${BASE_URL}/orders/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => setOrders(res.data))
        .catch(err => console.error('Failed to fetch orders:', err));
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📦 Order History</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order, idx) => (
            <li key={idx} className="bg-white p-4 shadow rounded border">
              <p><strong>Order ID:</strong> #{order.orderId}</p>
              <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
              <p><strong>Placed At:</strong> {new Date(order.placedAt).toLocaleString()}</p>
              <p><strong>Delivery:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
