
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import authApi from '@/api/authApi'; // ✅ Import your real API file

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { DollarSign, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ Use your backend login API
      const data = await authApi.login(email, password);

      if (data?.user && data?.token) {
        login(data.user, data.token); // ✅ Update context
        toast.success('Login successful!');
        navigate(`/${data.user.role}/dashboard`);
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      // Log detailed axios/network error info to help debug
      console.error('Login error:', error);
      if (error.response) {
        // Server responded with a status outside 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        toast.error(`Login failed: ${error.response.data?.message || error.response.status}`);
      } else if (error.request) {
        // Request was made but no response received (network / CORS / server down)
        console.error('No response received. Request:', error.request);
        toast.error('Network error: could not reach server. Check backend and CORS.');
      } else {
        // Something else happened
        toast.error(error.message || 'Login failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_50%)]" />
      
      <Card className="w-full max-w-md p-8 animate-scale-in backdrop-blur-sm bg-card/95 border-border/50 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-glow animate-pulse-glow">
            <DollarSign className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            FinanceHub
          </h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          {/* Fake hidden fields to trick browser autofill */}
          <input type="text" name="fake-username" autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} tabIndex={-1} />
          <input type="password" name="fake-password" autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} tabIndex={-1} />
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                name="user_email"
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => {
                  // Remove readonly on focus to allow typing
                  if (e.target.readOnly) {
                    e.target.readOnly = false;
                  }
                }}
                readOnly
                autoComplete="off"
                data-form-type="other"
                required
                className="pl-10 h-12 transition-all focus:scale-[1.02]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                name="user_password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => {
                  // Remove readonly on focus to allow typing
                  if (e.target.readOnly) {
                    e.target.readOnly = false;
                  }
                }}
                readOnly
                autoComplete="off"
                data-form-type="other"
                required
                className="pl-10 h-12 transition-all focus:scale-[1.02]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary-glow transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">Need an account? Please contact your administrator.</p>
        </div>
      </Card>
    </div>
  );
}
