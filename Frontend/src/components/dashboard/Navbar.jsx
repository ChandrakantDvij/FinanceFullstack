import { useAuth } from '@/contexts/AuthContext';
import { Bell, LogOut, User, ArrowLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import authApi from "@/api/authApi";

import { toast } from 'sonner';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();

      logout();
      navigate('/login', { replace: true });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleBackToLogin = async () => {
    try {
      await authApi.logout();
      logout();
      navigate('/login', { replace: true });
      toast.success('Returned to login page');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const initials = user?.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  const roleColors = {
    superadmin: 'bg-gradient-primary',
    reviewer: 'bg-gradient-secondary',
    accountant: 'bg-gradient-success',
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-lg bg-opacity-90 animate-fade-in">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleBackToLogin}
            className="flex items-center space-x-2 hover:bg-muted transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Button> */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {user?.role === 'superadmin' && 'Super Admin Dashboard'}
              {user?.role === 'reviewer' && 'Reviewer Dashboard'}
              {user?.role === 'accountant' && 'Accountant Dashboard'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-muted transition-all hover:scale-110 relative group">
            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-all hover:scale-105">
                <Avatar className={cn("w-10 h-10", roleColors[user?.role || 'accountant'])}>
                  <AvatarFallback className="text-white font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">{user?.name}</p> 
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-scale-in">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
           className="cursor-pointer"
           onClick={() => navigate("/Profile")}
             >
            <User className="w-4 h-4 mr-2" />
           My Profile
          </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
