import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import JoinUs from './pages/JoinUs';
import BusinessApplication from './pages/BusinessApplication';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import QRMenu from './pages/QRMenu';
import AdminAuth from './admin/AdminAuth';
import SuperAdminAuth from './superadmin/SuperAdminAuth';
import AdminLayout from './admin/AdminLayout';
import SuperAdminLayout from './superadmin/SuperAdminLayout';
import DashboardView from './admin/DashboardView';
import TablePlanView from './admin/TablePlanView';
import MenuManagementView from './admin/MenuManagementView';
import ReservationRulesView from './admin/ReservationRulesView';
import PromotionsView from './admin/PromotionsView';
import ReservationManagementView from './admin/ReservationManagementView';
import BusinessSettingsView from './admin/BusinessSettingsView';
import SuperAdminDashboard from './superadmin/SuperAdminDashboard';
import BusinessManagementView from './superadmin/BusinessManagementView';
import ApplicationManagementView from './superadmin/ApplicationManagementView';

function AppContent() {
  const location = useLocation();

  const isFullScreenPage = ['/login', '/register', '/admin/login', '/admin'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  // Admin sayfaları için ayrı layout
  if (isAdminPage) {
    return (
      <Routes>
        <Route path="/admin" element={<SuperAdminAuth />} />
        <Route path="/admin/login" element={<AdminAuth />} />
        <Route path="/admin/super-dashboard" element={
          <SuperAdminLayout>
            <SuperAdminDashboard />
          </SuperAdminLayout>
        } />
        <Route path="/admin/application-management" element={
          <SuperAdminLayout>
            <ApplicationManagementView />
          </SuperAdminLayout>
        } />
        <Route path="/admin/business-management" element={
          <SuperAdminLayout>
            <BusinessManagementView />
          </SuperAdminLayout>
        } />
        <Route path="/admin/dashboard" element={
          <AdminLayout>
            <DashboardView />
          </AdminLayout>
        } />
        <Route path="/admin/table-plan" element={
          <AdminLayout>
            <TablePlanView />
          </AdminLayout>
        } />
        <Route path="/admin/menu-management" element={
          <AdminLayout>
            <MenuManagementView />
          </AdminLayout>
        } />
        <Route path="/admin/reservation-rules" element={
          <AdminLayout>
            <ReservationRulesView />
          </AdminLayout>
        } />
        <Route path="/admin/promotions" element={
          <AdminLayout>
            <PromotionsView />
          </AdminLayout>
        } />
        <Route path="/admin/reservations" element={
          <AdminLayout>
            <ReservationManagementView />
          </AdminLayout>
        } />
        <Route path="/admin/business-settings" element={
          <AdminLayout>
            <BusinessSettingsView />
          </AdminLayout>
        } />
      </Routes>
    );
  }

  const isQRMenuPage = location.pathname.startsWith('/menu/');
  const shouldShowNavbar = !isQRMenuPage;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {shouldShowNavbar && <Navbar />}
      <Box
        component="main"
        sx={{
          flex: 1,
          pt: (isFullScreenPage || isQRMenuPage) ? 0 : '80px'
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/joinus" element={<JoinUs />} />
          <Route path="/business-application" element={<BusinessApplication />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu/:businessId" element={<QRMenu />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
      {shouldShowNavbar && <Footer />}
    </Box>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
