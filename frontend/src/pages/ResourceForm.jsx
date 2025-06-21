import { useParams } from 'react-router-dom';
import { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

export default function ResourceForm() {
  const { id } = useParams();
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

    try {
      await API.post('/resources', {
        ...form,
        disaster_id: id
      });
      toast.success('✅ Resource added!');
      setForm({ name: '', location_name: '', type: '' });
    } catch (err) {
      toast.error('❌ Failed to add resource');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Resource Name" className="input" />
      <input name="location_name" value={form.location_name} onChange={handleChange} placeholder="Location (e.g., Houston, TX)" className="input" />
      <input name="type" value={form.type} onChange={handleChange} placeholder="Type (e.g., shelter, food)" className="input" />
      <button className="bg-yellow-600 text-white px-4 py-2 rounded">Submit Resource</button>
    </form>
  );
}
