import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const socket = io('https://disaster-response-platform-2.onrender.com');

export default function HomePage() {
  const [disasters, setDisasters] = useState([]);
  const [socialMedia, setSocialMedia] = useState([]);

  const fetchDisasters = async () => {
    const res = await API.get('/disasters');
    setDisasters(res.data);
  };

  const deleteDisaster = async (id) => {
    await API.delete(`/disasters/${id}`);
    toast.success("🗑️ Disaster deleted");
    fetchDisasters();
  };

  useEffect(() => {
    fetchDisasters();

    // Fetch initial social media mock data
    API.get('/social-media/123').then(res => setSocialMedia(res.data));

    // WebSocket events
    socket.on('disaster_updated', fetchDisasters);
    socket.on('social_media_updated', setSocialMedia);

    return () => socket.disconnect();
  }, []);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-semibold mb-4">📍 Active Disasters</h2>
        {disasters.map(d => (
          <div key={d.id} className="bg-white shadow p-4 rounded mb-4">
            <h3 className="text-lg font-bold">{d.title}</h3>
            <p>{d.description}</p>
            <div className="mt-2 text-sm text-gray-500">Tags: {d.tags?.join(', ')}</div>
            <div className="mt-3 space-x-2">
              <Link to={`/disaster/${d.id}`} className="bg-purple-600 text-white px-3 py-1 rounded">View Details</Link>
              <Link to={`/report/${d.id}`} className="bg-green-600 text-white px-3 py-1 rounded">Add Report</Link>
              <Link to={`/resource/${d.id}`} className="bg-yellow-600 text-white px-3 py-1 rounded">Add Resource</Link>
              <Link to={`/update/${d.id}`} className="bg-blue-600 text-white px-3 py-1 rounded">Edit</Link>
              <button onClick={() => deleteDisaster(d.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-8">🐦 Social Media Reports</h2>
        {socialMedia.length === 0 ? (
          <p className="text-gray-500 mt-2">No social media posts found.</p>
        ) : (
          <ul className="mt-2 bg-white rounded p-3 space-y-2">
            {socialMedia.map((tweet, i) => (
              <li key={i} className="border-b pb-2 text-sm last:border-0">• {tweet.text}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
