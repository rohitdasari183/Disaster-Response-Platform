import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DisasterForm from './pages/DisasterForm';
import ReportForm from './pages/ReportForm';
import UpdateDisaster from './pages/UpdateDisaster';
import Navbar from './pages/Navbar';
import DisasterDetails from './pages/DisasterDetails';
import ResourceForm from './pages/ResourceForm';




export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<DisasterForm />} />
            <Route path="/update/:id" element={<UpdateDisaster />} />
            <Route path="/report/:id" element={<ReportForm />} />
            <Route path="/disaster/:id" element={<DisasterDetails />} />
            <Route path="/resource/:id" element={<ResourceForm />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
