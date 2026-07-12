import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiTrendingUp, 
  FiLayers, 
  FiBox, 
  FiAward, 
  FiTruck, 
  FiClipboard, 
  FiFileText, 
  FiUsers, 
  FiMail, 
  FiSliders, 
  FiMenu, 
  FiX, 
  FiChevronDown, 
  FiLogOut, 
  FiUser
} from 'react-icons/fi';
import useAuth from '../hooks/useAuth.js';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: FiTrendingUp },
    { name: 'Categories', path: '/admin/categories', icon: FiLayers },
    { name: 'Products', path: '/admin/products', icon: FiBox },
    { name: 'Inventory', path: '/admin/inventory', icon: FiClipboard },
    { name: 'Billing', path: '/admin/billing', icon: FiFileText },
    { name: 'Enquiries', path: '/admin/material-enquiries', icon: FiMail },
    { name: 'Settings', path: '/admin/settings', icon: FiSliders },
  ];

  // Helper to resolve breadcrumb title
  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === '/admin') return 'Dashboard';
    const activeItem = menuItems.find(item => item.path === currentPath);
    return activeItem ? activeItem.name : 'Admin Panel';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex text-[#1E1E1B] font-sans">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1E1E1B] text-[#FCFBF8] border-r border-[#ECE7DF] sticky top-0 h-screen">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <Link to="/admin" className="font-headings text-lg font-bold tracking-tight uppercase flex items-center gap-2 text-[#FFFFFF]">
            <span className="text-[#B56A45]">Mhatre</span> Traders
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#B56A45] text-[#FFFFFF]' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-[#FFFFFF]'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm text-[#B56A45]">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-[#FFFFFF] truncate">{user?.name}</span>
              <span className="text-[10px] text-zinc-500 truncate">{user?.email}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors"
            title="Log Out"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay background */}
          <div 
            className="fixed inset-0 bg-[#1E1E1B]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Sidebar Drawer container */}
          <div className="relative flex flex-col w-64 max-w-xs bg-[#1E1E1B] text-[#FCFBF8] h-full shadow-2xl z-50">
            <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800">
              <span className="font-headings text-lg font-bold tracking-tight uppercase text-[#FFFFFF]">
                <span className="text-[#B56A45]">Mhatre</span> Traders
              </span>
              <button 
                onClick={() => setMobileOpen(false)}
                className="text-zinc-400 hover:text-[#FFFFFF] p-1"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-[#B56A45] text-[#FFFFFF]' 
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-[#FFFFFF]'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm text-[#B56A45]">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#FFFFFF]">{user?.name}</span>
                  <span className="text-[10px] text-zinc-500">{user?.email}</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Topbar */}
        <header className="h-16 bg-[#FFFFFF] border-b border-[#ECE7DF] flex items-center justify-between px-6 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-zinc-600 hover:bg-[#FCFBF8] rounded-lg"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm font-medium">
              <span className="text-zinc-400">Admin</span>
              <span className="mx-2 text-zinc-400">/</span>
              <span className="text-zinc-800 font-bold">{getPageTitle()}</span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Placeholder */}
            <div className="hidden sm:flex items-center gap-2 bg-[#FCFBF8] border border-[#ECE7DF] px-3 py-1.5 rounded-lg w-48 text-zinc-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Search...</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                className="flex items-center gap-2 p-1 hover:bg-[#FCFBF8] rounded-lg transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#B56A45] text-[#FFFFFF] flex items-center justify-center font-bold text-xs">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <span className="hidden md:block text-xs font-semibold text-zinc-700">{user?.name}</span>
                <FiChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] border border-[#ECE7DF] rounded-lg shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-[#ECE7DF]">
                    <p className="text-xs text-zinc-400">Signed in as</p>
                    <p className="text-xs font-semibold text-zinc-800 truncate">{user?.email}</p>
                  </div>
                  
                  <Link 
                    to="/admin/settings"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 hover:bg-[#FCFBF8] transition-colors"
                  >
                    <FiUser className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-[#FCFBF8] transition-colors"
                  >
                    <FiLogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#FCFBF8]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
