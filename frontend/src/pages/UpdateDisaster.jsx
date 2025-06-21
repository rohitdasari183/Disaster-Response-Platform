import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

export default function UpdateDisaster() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', location_name: '', description: '', tags: '', owner_id: 'reliefAdmin' });

  useEffect(() => {
    API.get('/disasters').then(res => {
      const disaster = res.data.find(d => d.id === id);
      if (disaster) {
        setForm({ ...disaster, tags: disaster.tags.join(', ') });
      }
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/disasters/${id}`, {
      ...form,
      tags: form.tags.split(',').map(t => t.trim())
    });
    toast.success("✏️ Disaster updated");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <input className="input" value={form.location_name} onChange={e => setForm({ ...form, location_name: e.target.value })} />
      <textarea className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
      <input className="input" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
    </form>
  );
}
