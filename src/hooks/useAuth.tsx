import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock authentication for development
    const mockAuth = () => {
      setIsLoading(true);
      
      // Simulate a delay to mimic API call
      setTimeout(() => {
        // For now, we'll just set the user as not authenticated
        setIsAuthenticated(false);
        setUser(null);
        setSession(null);
        setIsLoading(false);
      }, 500);
    };
    
    mockAuth();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Sign in attempt:', email);
      
      // Simulate successful login
      setIsAuthenticated(true);
      setUser({
        id: '123',
        email: email,
        name: email.split('@')[0],
        photoUrl: undefined
      });
      
      // Mock session
      setSession({} as Session);
      
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: error as Error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Sign up attempt:', { email, name });
      
      // Simulate successful registration
      setIsAuthenticated(true);
      setUser({
        id: '123',
        email: email,
        name: name,
        photoUrl: undefined
      });
      
      // Mock session
      setSession({} as Session);
      
      return { error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error: error as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log('Sign out attempt');
      
      // Simulate sign out
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      console.log('Reset password attempt:', email);
      
      // Simulate password reset
      return { error: null };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
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