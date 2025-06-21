import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-700">🌐 Disaster Platform</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-600 font-medium">Home</Link>
          <Link to="/create" className="hover:text-blue-600 font-medium">Create</Link>
        </div>
      </div>
    </nav>
  );
}
