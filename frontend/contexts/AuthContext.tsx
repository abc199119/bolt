import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: '1',
  username: 'akshaaybs',
  name: 'Akshay BS',
  email: 'akshay@github.com',
  avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  bio: 'Full-stack developer passionate about open source and clean code',
  location: 'San Francisco, CA',
  company: 'TechCorp',
  githubUrl: 'https://github.com/akshaaybs',
  joinedDate: '2022-01-15'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Check for GitHub OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // In a real app, exchange code for access token
      handleGitHubCallback(code);
    }
    
    setLoading(false);
  }, []);

  const handleGitHubCallback = async (code: string) => {
    setLoading(true);
    // Simulate GitHub OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would:
    // 1. Exchange code for access token
    // 2. Fetch user data from GitHub API
    // 3. Create/update user in your database
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
    setLoading(false);
  };

  const loginWithGitHub = () => {
    // In a real app, redirect to GitHub OAuth
    const clientId = 'your_github_client_id';
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
    const scope = 'read:user user:email public_repo';
    
    // For demo purposes, simulate the callback
    setTimeout(() => {
      handleGitHubCallback('mock_code');
    }, 1000);
    
    // In production, uncomment this:
    // window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('useit');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loginWithGitHub,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
