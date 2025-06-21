import { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

export default function DisasterForm() {
  const [form, setForm] = useState({
    title: '',
    location_name: '',
    description: '',
    tags: '',
    owner_id: 'netrunnerX' // Hardcoded mock user
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.location_name || !form.description || !form.tags) {
      toast.error("⚠️ All fields are required");
      return;
    }

    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim())
    };

    try {
      const res = await API.post('/disasters', payload);
      toast.success("✅ Disaster created successfully");
      setForm({ title: '', location_name: '', description: '', tags: '', owner_id: 'netrunnerX' });
    } catch (err) {
      console.error("❌ Error creating disaster:", err.response?.data || err.message);
      toast.error("❌ Failed to create disaster. Check backend logs.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="input"
        placeholder="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
      />
      <input
        className="input"
        placeholder="Location Name (e.g., Manhattan, NYC)"
        name="location_name"
        value={form.location_name}
        onChange={handleChange}
      />
      <textarea
        className="input"
        placeholder="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        className="input"
        placeholder="Tags (comma-separated, e.g. flood, earthquake)"
        name="tags"
        value={form.tags}
        onChange={handleChange}
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all">
        Submit Disaster
      </button>
    </form>
  );
}
