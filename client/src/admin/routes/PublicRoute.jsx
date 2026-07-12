import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import PageLoader from '../components/ui/PageLoader.jsx';

export const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
