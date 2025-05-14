
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole, ResellerStage } from '@/types/user';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS_KEY = 'ila_beauty_users';
const MOCK_CURRENT_USER_KEY = 'ila_beauty_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(MOCK_CURRENT_USER_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedUsersString = localStorage.getItem(MOCK_USERS_KEY);
      const storedUsers: Record<string, User> = storedUsersString ? JSON.parse(storedUsersString) : {};
      
      const foundUser = Object.values(storedUsers).find(u => u.email === email);
      
      if (!foundUser) {
        toast({
          title: "Authentication Error",
          description: "User not found. Please check your email or sign up.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // In a real app, we would verify password here
      
      // Check if reseller is approved
      if (foundUser.role === 'reseller' && !foundUser.approved) {
        toast({
          title: "Account Pending Approval",
          description: "Your reseller account is pending approval. Please check back later.",
          variant: "default"
        });
        setLoading(false);
        return;
      }
      
      setUser(foundUser);
      localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(foundUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back${foundUser.role === 'reseller' ? ' reseller' : ''}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to log in. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const storedUsersString = localStorage.getItem(MOCK_USERS_KEY);
      const storedUsers: Record<string, User> = storedUsersString ? JSON.parse(storedUsersString) : {};
      
      // Check if user already exists
      if (Object.values(storedUsers).some(u => u.email === email)) {
        toast({
          title: "Registration Error",
          description: "This email is already registered. Please log in instead.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        role,
        approved: role === 'customer', // Customers are auto-approved, resellers need approval
        resellerStage: role === 'reseller' ? 'brown' : null, // Default stage for resellers
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      storedUsers[newUser.id] = newUser;
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(storedUsers));
      
      if (role === 'reseller') {
        toast({
          title: "Registration Successful",
          description: "Your reseller account has been created and is pending approval.",
        });
      } else {
        // Auto-login customers
        setUser(newUser);
        localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(newUser));
        toast({
          title: "Registration Successful",
          description: "Your account has been created and you are now logged in.",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: "Failed to create an account. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(MOCK_CURRENT_USER_KEY);
    toast({
      title: "Logout Successful",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
