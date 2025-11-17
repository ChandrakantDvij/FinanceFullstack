import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  DollarSign,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';


export function Sidebar({ role }) {
  const [collapsed, setCollapsed] = useState(false);

  // Keep sidebar state persistent on route change
  useEffect(() => {
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState) setCollapsed(JSON.parse(storedState));
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const accountantLinks = [
    { to: `/accountant/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { to: `/accountant/users`, label: 'Users', icon: UserCircle },
    { to: `/accountant/projects`, label: 'Projects', icon: FolderKanban },
    { to: `/accountant/employees`, label: 'Employees', icon: Users },
    { to: `/accountant/expenses`, label: 'Expenses', icon: DollarSign },
    { to: `/accountant/investors`, label: 'Investors', icon: TrendingUp },
  ];

  const reviewerLinks = [
    { to: `/reviewer/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { to: `/reviewer/users`, label: 'Users', icon: UserCircle },
    { to: `/reviewer/projects`, label: 'Projects', icon: FolderKanban },
    { to: `/reviewer/employees`, label: 'Employees', icon: Users },
    { to: `/reviewer/expenses`, label: 'Expenses', icon: DollarSign },
    { to: `/reviewer/investors`, label: 'Investors', icon: TrendingUp },
  ];

  const superadminLinks = [
    { to: `/superadmin/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { to: `/superadmin/users`, label: 'Users', icon: UserCircle },
    { to: `/superadmin/projects`, label: 'Projects', icon: FolderKanban },
    { to: `/superadmin/employees`, label: 'Employees', icon: Users },
    { to: `/superadmin/expenses`, label: 'Expenses', icon: DollarSign },
    { to: `/superadmin/investors`, label: 'Investors', icon: TrendingUp },
  ];

  const links =
    role === 'accountant'
      ? accountantLinks
      : role === 'reviewer'
      ? reviewerLinks
      : superadminLinks;

  return (
    <aside
      className={cn(
        'bg-card border-r border-border h-screen sticky top-0 transition-all duration-300 animate-slide-in-left z-50',
        collapsed ? 'w-21' : 'w-64'
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div
          className={cn(
            'flex items-center transition-all duration-300',
            collapsed ? 'justify-center w-full' : 'space-x-2'
          )}
        >
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
              Finance
            </span>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-3 rounded-lg transition-all duration-200 group',
                collapsed ? 'justify-center' : 'space-x-3',
                isActive
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <link.icon
                  className={cn(
                    'w-5 h-5 transition-transform group-hover:scale-110',
                    isActive && 'drop-shadow-glow'
                  )}
                />
                {!collapsed && (
                  <span className="font-medium whitespace-nowrap">
                    {link.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
