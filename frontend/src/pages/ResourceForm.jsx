import { useParams } from 'react-router-dom';
import { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

export default function ResourceForm() {
  const { id } = useParams(); // disaster_id from URL
  const [form, setForm] = useState({
    name: '',
    location_name: '',
    type: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Client-side validation
    if (!form.name || !form.location_name || !form.type) {
      toast.error("⚠️ Please fill in all fields.");
      return;
    }

    if (!id) {
      toast.error("❌ Disaster ID is missing.");
      return;
    }

    try {
      const payload = {
        ...form,
        disaster_id: id
      };

      console.log("📤 Submitting resource:", payload);

      const res = await API.post('/resources', payload);
      toast.success('✅ Resource added successfully!');
      setForm({ name: '', location_name: '', type: '' });
    } catch (err) {
      const backendMessage = err.response?.data?.error || err.message;
      console.error("❌ Resource creation failed:", backendMessage);
      toast.error(`❌ Failed to add resource: ${backendMessage}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold">➕ Add Resource</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Resource Name"
        className="input w-full border p-2 rounded"
      />

      <input
        name="location_name"
        value={form.location_name}
        onChange={handleChange}
        placeholder="Location (e.g., Houston, TX)"
        className="input w-full border p-2 rounded"
      />

      <input
        name="type"
        value={form.type}
        onChange={handleChange}
        placeholder="Type (e.g., shelter, food)"
        className="input w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition"
      >
        Submit Resource
      </button>
    </form>
  );
}
