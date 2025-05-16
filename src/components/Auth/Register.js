import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import BASE_URL from '../../api/api';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const validate = () => {
    const { username, email, password } = formData;
    if (!username || !email || !password) return 'All fields are required.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address.';

    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return 'Password must include at least one uppercase letter and one number.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await axios.post(`${BASE_URL}/register`, {
        ...formData,
        email: formData.email.trim().toLowerCase(),
      });
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error.response);
      if (error.response?.status === 400 || error.response?.status === 409) {
        setError('This email is already registered.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create an Account 🚀</h2>

        <div className="text-center mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition"
          >
            🛍️ Browse Products Without Registering
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <small className="text-xs text-gray-500">
              Min 6 characters, 1 uppercase letter, 1 number
            </small>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Already a user?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
