import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminInventory from './pages/admin/AdminInventory';
import AdminInventoryReview from './pages/admin/AdminInventoryReview';
import AdminLiveMap from './pages/admin/AdminLiveMap';
import AdminTrucks from './pages/admin/AdminTrucks';
import AdminDrivers from './pages/admin/AdminDrivers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminCmsPages from './pages/admin/AdminCmsPages';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProfile from './pages/admin/AdminProfile';
import DriverLogin from './pages/driver/DriverLogin';
import DriverLayout from './pages/driver/DriverLayout';
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverBookings from './pages/driver/DriverBookings';
import DriverBookingDetail from './pages/driver/DriverBookingDetail';
import DriverProfile from './pages/driver/DriverProfile';

// Always use page origin in the browser so /api/v1 stays same-origin (localhost vs 127.0.0.1 mismatch breaks CORS if VITE_API_URL is fixed at build time)
const API_BASE =
  typeof window !== 'undefined' && window.location?.origin
    ? `${window.location.origin}/api/v1`
    : import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export { API_BASE };

function RequireAuth({ children }) {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

function RequireDriverAuth({ children }) {
  const token = localStorage.getItem('driver_token');
  if (!token) return <Navigate to="/driver/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="inventory-review" element={<AdminInventoryReview />} />
        <Route path="map" element={<AdminLiveMap />} />
        <Route path="trucks" element={<AdminTrucks />} />
        <Route path="drivers" element={<AdminDrivers />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="cms-pages" element={<AdminCmsPages />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/driver/login" element={<DriverLogin />} />
      <Route path="/driver" element={<RequireDriverAuth><DriverLayout /></RequireDriverAuth>}>
        <Route index element={<DriverDashboard />} />
        <Route path="bookings" element={<DriverBookings />} />
        <Route path="bookings/:id" element={<DriverBookingDetail />} />
        <Route path="profile" element={<DriverProfile />} />
      </Route>
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

const container = document.getElementById('app');
if (container) {
  // Reuse existing root on HMR re-runs to avoid "createRoot() on container that already has a root" warning
  const root = container._reactRoot ?? createRoot(container);
  if (!container._reactRoot) container._reactRoot = root;
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
