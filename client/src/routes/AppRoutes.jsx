import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public site imports
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Categories from '../pages/Categories';
import CategoryDetails from '../pages/CategoryDetails';
import About from '../pages/About';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

// Admin foundation imports
import { AuthProvider } from '../admin/context/AuthContext.jsx';
import ProtectedRoute from '../admin/routes/ProtectedRoute.jsx';
import PublicRoute from '../admin/routes/PublicRoute.jsx';
import AdminLayout from '../admin/layouts/AdminLayout.jsx';
import Login from '../admin/pages/Login.jsx';
import Dashboard from '../admin/pages/Dashboard.jsx';
import AdminCategories from '../admin/pages/Categories.jsx';
import AdminProducts from '../admin/pages/Products.jsx';
import AdminInventory from '../admin/pages/Inventory.jsx';
import AdminBilling from '../admin/pages/Billing.jsx';
import AdminEnquiries from '../admin/pages/MaterialEnquiries.jsx';
import AdminSettings from '../admin/pages/Settings.jsx';
import Admin404 from '../admin/pages/error/Admin404.jsx';

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        
        {/* 1. Public Facing Website */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetails />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:slug" element={<CategoryDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="404" element={<NotFound />} />
        </Route>

        {/* 2. Admin Authentication Path */}
        <Route element={<PublicRoute />}>
          <Route path="/admin/login" element={<Login />} />
        </Route>

        {/* 3. Protected Admin Panel Area */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="billing" element={<AdminBilling />} />
            <Route path="material-enquiries" element={<AdminEnquiries />} />
            <Route path="settings" element={<AdminSettings />} />
            
            {/* Catch missing directories inside Admin Shell */}
            <Route path="*" element={<Admin404 />} />
          </Route>
        </Route>

        {/* 4. Global Wildcard Catcher */}
        <Route path="*" element={<Navigate to="/404" replace />} />
        
      </Routes>
    </AuthProvider>
  );
}
