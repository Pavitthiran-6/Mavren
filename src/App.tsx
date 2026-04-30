import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';

// Components
import Home from './pages/Home';
import Discovery from './pages/Discovery';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';

// Admin
import AdminDashboard from './admin/pages/Dashboard';
import AdminInventory from './admin/pages/Inventory';
import AdminCuration from './admin/pages/Curation';
import AdminCategories from './admin/pages/Categories';
import AdminLogin from './admin/pages/AdminLogin';
import AdminSettings from './admin/pages/Settings';
import AdminMessages from './admin/pages/Messages';
import AdminHomeSections from './admin/pages/HomeSections';
import AdminLayout from './admin/components/AdminLayout';
import ProtectedRoute from './admin/components/ProtectedRoute';

export default function App() {
  return (
    <WishlistProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* User Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Discovery />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="*" element={<NotFound />} />

          {/* Auth Redirects */}
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="curation" element={<AdminCuration />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="home-sections" element={<AdminHomeSections />} />
            <Route index element={<Navigate to="/admin/dashboard" />} />
          </Route>
        </Routes>
      </Router>
    </WishlistProvider>
  );
}
