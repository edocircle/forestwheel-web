import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const mainNav = [
  { icon: 'dashboard', label: 'Dashboard', path: '/' },
  { icon: 'directions_car', label: 'Inventory', path: '/inventory' },
  { icon: 'group', label: 'Leads', path: '/leads' },
  { icon: 'people', label: 'Users', path: '/users' },
  { icon: 'settings', label: 'Settings', path: '/settings' },
];

const superAdminNav = [
  { icon: 'admin_panel_settings', label: 'Admins', path: '/admins' },
];

export default function AdminLayout({ children }) {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = isSuperAdmin ? [...mainNav, ...superAdminNav] : mainNav;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex h-screen w-72 flex-col fixed left-0 top-0 z-40 bg-white border-r border-surface-container-high">
        <div className="flex flex-col h-full py-10">
          {/* Brand */}
          <div className="px-8 mb-12">
            <h1 className="text-primary font-black italic text-2xl tracking-tighter uppercase font-headline">
              Forest Wheel
            </h1>
            <p className="text-secondary uppercase tracking-widest text-[10px] font-bold mt-1 font-headline">
              Management Portal
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `group flex items-center py-4 px-8 font-headline uppercase tracking-widest text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-primary/10 text-primary border-r-4 border-primary'
                          : 'text-secondary hover:text-on-surface hover:bg-surface-variant'
                      }`
                    }
                  >
                    <span className="material-symbols-outlined mr-4 group-hover:translate-x-1 transition-transform">
                      {item.icon}
                    </span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* New Listing Button */}
            <div className="px-8 mt-10">
              <button
                onClick={() => navigate('/inventory/new')}
                className="w-full py-4 rounded-lg bg-primary text-white font-bold tracking-tight shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all duration-200"
              >
                New Listing
              </button>
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="mt-auto px-2">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full group flex items-center text-secondary py-4 px-6 hover:text-error hover:bg-error-container/20 font-headline uppercase tracking-widest text-xs font-bold transition-all duration-300"
                >
                  <span className="material-symbols-outlined mr-4">logout</span>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-72 flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 glass-header border-b border-surface-container-high h-20 w-full flex items-center justify-between px-8">
          <div className="flex items-center gap-8">
            {/* Mobile brand */}
            <span className="md:hidden text-2xl font-black tracking-tighter text-primary font-headline uppercase italic">
              Forest Wheel
            </span>
            <div className="hidden lg:flex items-center bg-surface-variant rounded-full px-4 py-2 border border-surface-container-highest">
              <span className="material-symbols-outlined text-secondary text-sm mr-2">search</span>
              <input
                className="bg-transparent border-none text-sm focus:ring-0 text-on-surface w-64 placeholder:text-secondary"
                placeholder="Search..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-variant">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-on-surface">{user?.fullName}</p>
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl flex items-center justify-around px-4 z-50 border-t border-surface-container shadow-lg">
        {mainNav.slice(0, 4).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-secondary'}`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </NavLink>
        ))}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-secondary'}`
          }
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px] font-bold">Config</span>
        </NavLink>
      </nav>
    </div>
  );
}
