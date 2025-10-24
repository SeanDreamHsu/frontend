import React from 'react';

const AdminRoute = ({ userRole, userToken, children }) => {
  const isAdmin = typeof userRole === 'string' && userRole.trim().toLowerCase() === 'admin';

  if (!userToken) {
    // If no user token, prompt login
    return (
      <div style={{ padding: '2rem' }}>
        <h2>您需要先登录才能访问后台页面。</h2>
        <p>请使用管理员账户登录。</p>
      </div>
    );
  }

  if (!isAdmin) {
    // If user is logged in but not admin, show unauthorized message
    return (
      <div style={{ padding: '2rem' }}>
        <h2>无访问权限</h2>
        <p>当前用户不是管理员，无法访问后台页面。</p>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
