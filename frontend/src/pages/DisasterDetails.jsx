import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

export default function DisasterDetails() {
  const { id } = useParams();
  const [reports, setReports] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    API.get(`/reports?disaster_id=${id}`).then(res => setReports(res.data));
    API.get(`/resources?disaster_id=${id}`).then(res => setResources(res.data));
  }, [id]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📋 Reports</h2>
  {reports.length === 0 && <p>No reports found.</p>}
  {reports.map((r, i) => (
    <div key={i} className="bg-white p-4 border rounded space-y-2">
      <p>{r.content}</p>
      {r.image_url && (
        <img
          src={r.image_url}
          alt="Report"
          className="max-w-full h-auto rounded shadow"
        />
      )}
    </div>
      ))}

      <h2 className="text-2xl font-bold mt-6">🏥 Resources</h2>
      {resources.length === 0 && <p>No resources found.</p>}
      {resources.map((r, i) => (
        <div key={i} className="bg-white p-4 border rounded">
          <p><strong>{r.name}</strong> ({r.type})</p>
          <p className="text-sm text-gray-600">{r.location_name}</p>
        </div>
      ))}
    </div>
  );
}
