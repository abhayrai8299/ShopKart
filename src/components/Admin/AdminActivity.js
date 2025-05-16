import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from "../../api/api"

const AdminActivity = () => {
  const [activity, setActivity] = useState([]);

  const fetchActivity = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${BASE_URL}/admin/feed/activity`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setActivity(res.data);
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Feed Activity</h2>
      {activity.map(user => (
        <div key={user._id} className="mb-4 p-2 border rounded">
          <p className="font-semibold">{user.email}</p>
          <ul className="ml-4 list-disc">
            {user.recentActivity?.map((act, i) => (
              <li key={i}>{act.action} - {act.title} - {new Date(act.date).toLocaleString()}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminActivity;
