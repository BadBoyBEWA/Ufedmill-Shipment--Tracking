import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

import Homepage from './pages/public/Homepage';
import Tracking from './pages/public/Tracking';
import Services from './pages/public/Services';
import Audit from './pages/public/Audit';
import ShipNow from './pages/public/ShipNow';
import Login from './pages/admin/Login';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
import Dashboard from './pages/admin/Dashboard';
import ShipmentManagement from './pages/admin/ShipmentManagement';
import NewShipment from './pages/admin/NewShipment';
import LiveChat from './pages/admin/LiveChat';
import AdminLayout from './components/layout/AdminLayout';
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/services" element={<Services />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/ship-now" element={<ShipNow />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="shipments" element={<ShipmentManagement />} />
          <Route path="shipments/new" element={<NewShipment />} />
          <Route path="shipments/:id" element={<NewShipment />} />
          <Route path="chat" element={<LiveChat />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
