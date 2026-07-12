import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public site imports (static for landing page performance)
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Products from '../pages/Products';
import About from '../pages/About';
import Contact from '../pages/Contact';

// Public site imports (lazy loaded to trim initial bundle size)
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const CategoryDetails = lazy(() => import('../pages/CategoryDetails'));
const Categories = lazy(() => import('../pages/Categories'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Admin foundation imports (static)
import { AuthProvider } from '../admin/context/AuthContext.jsx';
import ProtectedRoute from '../admin/routes/ProtectedRoute.jsx';
import PublicRoute from '../admin/routes/PublicRoute.jsx';
import PageLoader from '../admin/components/ui/PageLoader.jsx';

// Admin layout and pages (lazy loaded to prevent public bundle leakage)
const AdminLayout = lazy(() => import('../admin/layouts/AdminLayout.jsx'));
const Login = lazy(() => import('../admin/pages/Login.jsx'));
const Dashboard = lazy(() => import('../admin/pages/Dashboard.jsx'));
const AdminCategories = lazy(() => import('../admin/pages/Categories.jsx'));
const AdminProducts = lazy(() => import('../admin/pages/Products.jsx'));
const AdminInventory = lazy(() => import('../admin/pages/Inventory.jsx'));
const AdminBilling = lazy(() => import('../admin/pages/Billing.jsx'));
const AdminEnquiries = lazy(() => import('../admin/pages/MaterialEnquiries.jsx'));
const AdminSettings = lazy(() => import('../admin/pages/Settings.jsx'));
const Admin404 = lazy(() => import('../admin/pages/error/Admin404.jsx'));

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader message="Loading..." />}>
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
      </Suspense>
    </AuthProvider>
  );
}

