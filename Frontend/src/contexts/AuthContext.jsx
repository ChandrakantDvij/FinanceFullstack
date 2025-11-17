import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    // Backwards compatibility: some modules store token as 'userToken' and user parts separately
    const altToken = localStorage.getItem('userToken');
    const altName = localStorage.getItem('userName');
    const altRole = localStorage.getItem('userRole');
    const altEmail = localStorage.getItem('userEmail');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else if (altToken && (altName || altRole)) {
      // Reconstruct a minimal user object from legacy keys
      const reconstructedUser = {
        name: altName || '',
        role: altRole || '',
        email: altEmail || '',
      };
      setUser(reconstructedUser);
      setToken(altToken);
    }
    setIsLoading(false);
  }, []);

  const login = (newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);
    // Store both canonical and legacy keys so all modules can read them
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('token', newToken);
    localStorage.setItem('userToken', newToken);
    if (newUser?.name) localStorage.setItem('userName', newUser.name);
    if (newUser?.role) localStorage.setItem('userRole', newUser.role);
    if (newUser?.email) localStorage.setItem('userEmail', newUser.email);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Remove both canonical and legacy keys
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
