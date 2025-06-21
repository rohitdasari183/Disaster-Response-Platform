import { useParams } from 'react-router-dom';
import { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

export default function ReportForm() {
  const { id } = useParams();
  const [image_url, setImageUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const verifyImage = async () => {
    if (!image_url.trim()) {
      toast.error("⚠️ Please enter a valid image URL");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post(`/verify-image/${id}`, { image_url });
      setResult(res.data);

      // Save to reports table
      await API.post('/reports', {
        disaster_id: id,
        content: 'Submitted via image verification',
        image_url,
        verification_status: 'verified',
        user_id: null
      });

      toast.success("✅ Image analyzed and report saved.");
    } catch (err) {
      toast.error("❌ Verification failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getResultText = () => {
    return result?.candidates?.[0]?.content?.parts?.[0]?.text || "No output from Gemini.";
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">📝 Disaster Image Verification</h2>

      <input
        type="text"
        className="input border border-gray-300 rounded w-full p-2"
        placeholder="Enter Image Address of this disaster from Google"
        value={image_url}
        onChange={e => setImageUrl(e.target.value)}
      />

      <button
        onClick={verifyImage}
        className={`bg-green-600 text-white px-4 py-2 rounded ${loading ? 'opacity-50' : ''}`}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify Image"}
      </button>

      {result && (
        <div className="bg-white border border-green-300 p-4 rounded shadow">
          <h4 className="text-lg font-semibold text-green-700 mb-2">📊 Gemini Result</h4>
          <p className="text-gray-800 whitespace-pre-line">{getResultText()}</p>
        </div>
      )}
    </div>
  );
}
