import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, Info, Wrench, FolderOpen, Award, Mail, Settings, LogOut, Menu, X, ChevronLeft,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Profile', path: '/admin/profile', icon: User },
  { label: 'About', path: '/admin/about', icon: Info },
  { label: 'Skills', path: '/admin/skills', icon: Wrench },
  { label: 'Projects', path: '/admin/projects', icon: FolderOpen },
  { label: 'Awards', path: '/admin/awards', icon: Award },
  { label: 'Messages', path: '/admin/messages', icon: Mail },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-dark flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 bg-white dark:bg-dark-50 border-r border-slate-200 dark:border-white/5 transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-white/5">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-0.5 border border-primary/40 flex items-center justify-center flex-shrink-0">
                <img src="/logo.png" alt="JA" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-sm tracking-wide text-gradient">JERYLL ANNE</span>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-full overflow-hidden bg-white p-0.5 border border-primary/40 flex items-center justify-center">
              <img src="/logo.png" alt="JA" className="w-full h-full object-contain" />
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white p-1">
            <ChevronLeft size={18} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                } ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-white/5">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white/80 dark:bg-dark-50/50 backdrop-blur-sm border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 md:px-6">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">
            <Menu size={22} />
          </button>
          <div className="hidden md:block">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 dark:text-gray-400 hover:text-primary transition-colors">
              ← View Public Site
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500 dark:text-gray-400">{user?.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
