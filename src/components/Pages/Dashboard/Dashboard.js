import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../../Product/ProductCard';
import BASE_URL from '../../../api/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search).get('search')?.toLowerCase() || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === 'admin') {
          navigate('/admin-dashboard');
          return;
        }
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }

    axios
      .get(`${BASE_URL}/products`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [navigate]);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(query)
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-purple-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Product Dashboard</h1>

        {loading ? (
          <div className="text-center text-lg text-gray-500 mt-20">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-20 mx-auto max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-red-500 mb-2">😕 No Results Found</h2>
          <p className="text-gray-600 text-sm">
            We couldn't find any items matching your search. <br />
            Try a different keyword or check your spelling.
          </p>
        </div>
        
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index + 1)}
                  className={`px-4 py-2 rounded ${currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
