import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/cartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { cartItems, addToCart, incrementQuantity, decrementQuantity } = useCart();

  const cartItem = cartItems.find(item => item.id === parseInt(id));

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) {
    return (
      <div className="p-6 text-center text-lg font-medium text-gray-600 animate-pulse">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-4">
        <Link
          to="/dashboard"
          className="text-blue-600 hover:underline text-sm flex items-center"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-10 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img
            src={product.image}
            alt={product.title}
            className="h-80 object-contain rounded-lg hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {product.title}
            </h1>

            <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
            <p className="text-yellow-600 font-medium text-sm mb-2">
              ⭐ Rating: {product.rating?.rate || 'N/A'}
            </p>

            <div className="text-lg mb-3">
              {product.price > 50 ? (
                <div className="space-x-2">
                  <span className="text-gray-400 line-through">${product.price.toFixed(2)}</span>
                  <span className="text-green-700 font-bold">
                    ${(product.price * 0.8).toFixed(2)}
                  </span>
                  <span className="text-xs text-green-700">(20% off)</span>
                </div>
              ) : (
                <span className="text-green-700 font-semibold">${product.price.toFixed(2)}</span>
              )}
            </div>

            <div className="mb-4">
              <h3 className="text-md font-semibold mb-1 text-gray-800">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Cart Buttons */}
          <div className="mt-6">
            {cartItem ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => decrementQuantity(product.id)}
                  className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
                >
                  −
                </button>
                <span className="text-lg font-semibold">{cartItem.quantity}</span>
                <button
                  onClick={() => incrementQuantity(product.id)}
                  className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product)}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
