import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Admin.css';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isAdmin, isTeacher } = useAuth();

  const isActiveRoute = (path: string) => {
    return location.pathname.startsWith(`/admin${path}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h1>Novademy</h1>
        </div>
        <nav className="admin-nav">
          <Link 
            to="/admin/dashboard" 
            className={`nav-item ${isActiveRoute('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/courses" 
            className={`nav-item ${isActiveRoute('/courses') ? 'active' : ''}`}
          >
            Kurslar
          </Link>
          <Link 
            to="/admin/lessons" 
            className={`nav-item ${isActiveRoute('/lessons') ? 'active' : ''}`}
          >
            Dərslər
          </Link>
          {isAdmin && (
            <>
              <Link 
                to="/admin/packages" 
                className={`nav-item ${isActiveRoute('/packages') ? 'active' : ''}`}
              >
                Paketlər
              </Link>
              <Link 
                to="/admin/subscriptions" 
                className={`nav-item ${isActiveRoute('/subscriptions') ? 'active' : ''}`}
              >
                Abunəliklər
              </Link>
              <Link 
                to="/admin/users" 
                className={`nav-item ${isActiveRoute('/users') ? 'active' : ''}`}
              >
                İstifadəçilər
              </Link>
            </>
          )}
        </nav>
      </aside>
      <main className="admin-content">
        <header className="admin-header">
          <div className="admin-header-content">
            <h2>Admin Panel{user && ` - ${user.name}`}</h2>
            <div className="admin-user-menu">
              <button className="logout-button" onClick={handleLogout}>
                Çıxış
              </button>
            </div>
          </div>
        </header>
        <div className="admin-main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 