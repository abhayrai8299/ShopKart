import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../api/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        navigate('/admin-login');
      }
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setFormData(product);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/admin/products/${editingProduct}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📦 Admin Product Management</h1>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-sm text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 border">Title</th>
              <th className="px-4 py-3 border">Price</th>
              <th className="px-4 py-3 border">Category</th>
              <th className="px-4 py-3 border">Description</th>
              <th className="px-4 py-3 border">Image</th>
              <th className="px-4 py-3 border">Rating</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) =>
              editingProduct === product._id ? (
                <tr key={product._id} className="bg-yellow-50 text-sm">
                  <td className="border px-3 py-2">
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.rating?.rate || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: { ...formData.rating, rate: parseFloat(e.target.value) },
                        })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-3 py-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleUpdate}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-sm"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={product._id} className="hover:bg-gray-50 transition text-sm">
                  <td className="border px-3 py-2">{product.title}</td>
                  <td className="border px-3 py-2">${product.price}</td>
                  <td className="border px-3 py-2">{product.category}</td>
                  <td className="border px-3 py-2 max-w-xs truncate">{product.description}</td>
                  <td className="border px-3 py-2">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 object-contain rounded border"
                    />
                  </td>
                  <td className="border px-3 py-2">{product.rating?.rate || 'N/A'}</td>
                  <td className="border px-3 py-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
