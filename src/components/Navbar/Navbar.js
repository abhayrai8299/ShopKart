import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useCart } from '../../context/cartContext';
import cartIcon from '../../assets/cart-icon.svg';
import UserDropdown from '../Profile/UserDropdown';
import debounce from 'lodash.debounce';
import { FiSearch } from 'react-icons/fi';
import Eshop from '../../assets/shopping.svg';

function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const hideCartOnRoutes = ['/login', '/register', '/admin-login'];
  const shouldShowCart = !isAdmin && !hideCartOnRoutes.includes(location.pathname);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        navigate(`/dashboard?search=${searchTerm.trim()}`);
      } else {
        navigate('/dashboard');
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(e.target.value);
    debouncedSearch(value);
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAdmin(decoded.role === 'admin');
      } catch (err) {
        console.error('Invalid token:', err);
        setUser(null);
        setIsAdmin(false);
      }
    } else {
      setUser(null);
      setIsAdmin(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cartItems');
    setUser(null);
    setIsAdmin(false);
    window.location.href = '/dashboard';
  };



  const debouncedSearch = useCallback(
    debounce((query) => {
      navigate(`/dashboard?search=${encodeURIComponent(query)}`);
    }, 500),
    []
  );


  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full p-1">
            <img
              src={Eshop}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <Link
            to={isAdmin ? "/admin-dashboard" : "/dashboard"}
            className="text-white font-bold text-2xl tracking-wide"
          >
            E Kart
          </Link>
        </div>




        <div className="flex items-center space-x-4">
          {!isAdmin && !hideCartOnRoutes.includes(location.pathname) && (
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:bg-blue-50 transition duration-200"
              />

              <FiSearch className="absolute top-2.5 left-3 text-gray-400 text-lg" />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isAdmin ? (
            <Link to="/admin-dashboard" className="text-white bg-yellow-500 px-4 py-2 rounded-md font-semibold">
              Admin Page
            </Link>
          ) : (
            shouldShowCart && (
              <Link to="/cart" className="relative">
                <img src={cartIcon} alt="Cart" className="h-8 w-8 filter brightness-0 invert" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )
          )}

          {user ? (
            <>
              <UserDropdown user={user} />
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link
                  to="/login"
                  className="bg-white text-blue-600 font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-blue-100 transition"
                >
                  Login
                </Link>
              )}
              {location.pathname !== '/register' && (
                <Link
                  to="/register"
                  className="bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-yellow-300 transition"
                >
                  Register
                </Link>
              )}

            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
