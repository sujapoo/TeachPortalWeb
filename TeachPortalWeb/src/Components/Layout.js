import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../Services/AuthService';
import './Layout.css'; 

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isAuthed   = AuthService.isAuthenticated();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const showDashboard = isAuthed && !isAuthPage;
  const showOverview  = isAuthed && !isAuthPage;

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <>
      <header className="appbar">
        {!isAuthPage? (<div className="brand">Teacher Portal</div>):""}

        <nav className="nav">
          {showDashboard && (
            <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
          )}
          {showOverview && (
            <NavLink to="/teacheroverview" className="nav-link">Teacher Overview</NavLink>
          )}

          {isAuthed ? (
            <button className="btn btn-danger" onClick={handleLogout}>Sign Out</button>
          ) : (
            // Optional: show these only on auth pages
            isAuthPage && (
              <>
                
              </>
            )
          )}
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}
