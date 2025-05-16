import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BASE_URL from '../../api/api';
import { useNavigate } from 'react-router-dom';

const UserDropdown = ({ user }) => {
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const dropdownRef = useRef();

  useEffect(() => {
    if (user && token) {
      axios
        .get(`${BASE_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setProfile(res.data))
        .catch((err) => console.error('Profile fetch error:', err));
    }
  }, [user]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  console.log("erwerfdsfgdsgsg", user);
  return (
    <div className="relative" ref={dropdownRef}>
      <span
        className="text-white font-semibold italic cursor-pointer"
        onClick={() => setShow((prev) => !prev)}
      >
        Welcome, {user.username}
      </span>

      {show && (
        <div className="absolute right-0 mt-2 w-72 bg-white text-black shadow-xl rounded-lg z-50 p-4">
          <h3 className="font-bold text-lg mb-2">👤 Profile</h3>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>

          <hr className="my-3" />

          {user.role != "admin" && <button
            onClick={() => {
              setShow(false);
              navigate('/orders');
            }}
            className="w-full text-left px-3 py-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium"
          >
            📦 View Order History
          </button>
          }
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
