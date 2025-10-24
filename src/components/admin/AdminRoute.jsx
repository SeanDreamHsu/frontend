import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ userRole, userToken, children }) => {
  const isAdmin = typeof userRole === 'string' && userRole.trim().toLowerCase() === 'admin';

  if (!userToken || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
