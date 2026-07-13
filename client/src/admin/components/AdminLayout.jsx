import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: 'fas fa-chart-pie', end: true },
    { label: 'Projects', path: '/admin/projects', icon: 'fas fa-project-diagram', end: false },
    { label: 'Skills', path: '/admin/skills', icon: 'fas fa-laptop-code', end: false },
    { label: 'Certifications', path: '/admin/certifications', icon: 'fas fa-certificate', end: false },
    { label: 'Messages', path: '/admin/messages', icon: 'fas fa-envelope', end: false },
    { label: 'Edit Profile', path: '/admin/profile', icon: 'fas fa-user-cog', end: false },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row relative">

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-surface-container border-b border-white/10 px-6 py-4 flex items-center justify-between z-30">
        <span className="font-montserrat font-bold text-lg text-gradient">PC Admin</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-on-surface hover:text-primary transition-colors focus:outline-none"
        >
          <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-xl`} />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-20 w-64 bg-[#0e1112] border-r border-white/10 flex flex-col justify-between py-8 px-6 transform transition-transform duration-300 md:transform-none ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        <div className="space-y-8">
          {/* Admin Header Title */}
          <div>
            <h2 className="font-montserrat font-bold text-xl text-white">
              🐼 Asik.Dev
            </h2>
            <p className="font-mono text-[10px] text-primary/70 tracking-widest mt-1 uppercase">
              Admin console
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium tracking-wide transition-all duration-200 ${isActive
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-transparent border-transparent text-on-surface-variant hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <i className={`${item.icon} text-base`} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar bottom */}
        <div className="border-t border-white/5 pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary border border-white/10">
              {user?.username ? user.username[0].toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.username || 'Admin'}</p>
              <p className="text-[10px] text-on-surface-variant font-mono truncate">Role: Developer</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate('/')}
              className="px-3 py-2 rounded-lg bg-surface-container border border-white/5 hover:bg-white/5 text-center text-xs font-medium text-secondary transition-colors"
            >
              Public
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-center text-xs font-medium text-red-400 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Content Box */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Desktop Topbar header */}
        <header className="hidden md:flex bg-surface-container/30 border-b border-white/5 px-8 py-4 items-center justify-between z-10">
          <span className="text-xs font-mono text-tertiary">
            System status: <span className="text-green-500 font-bold">● Operational</span>
          </span>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <i className="fas fa-external-link-alt text-[10px]" />
              Go to public site
            </button>
          </div>
        </header>

        {/* Content container */}
        <div className="p-6 md:p-8 flex-1 bg-background overflow-y-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
