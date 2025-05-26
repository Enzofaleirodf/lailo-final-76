import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { handleError } from '@/utils/errorUtils';
import { logUserAction } from '@/utils/loggingUtils';

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
    // Skip if Supabase is not configured
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          setSession(session);
          setIsAuthenticated(true);
          
          // Get user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.warn('Error fetching user profile:', profileError);
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.full_name || (session.user.email ? session.user.email.split('@')[0] : 'User'),
            photoUrl: profile?.avatar_url || undefined
          });
        }
      } catch (error) {
        handleError(error, 'useAuth.initializeAuth');
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setIsAuthenticated(!!newSession);
        
        if (newSession) {
          try {
            // Get user profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .single();
              
            if (profileError && profileError.code !== 'PGRST116') {
              console.warn('Error fetching user profile:', profileError);
            }
            
            setUser({
              id: newSession.user.id,
              email: newSession.user.email || '',
              name: profile?.full_name || (newSession.user.email ? newSession.user.email.split('@')[0] : 'User'),
              photoUrl: profile?.avatar_url || undefined
            });
          } catch (error) {
            handleError(error, 'useAuth.onAuthStateChange');
          }
        } else {
          setUser(null);
        }
      }
    );

    // Initialize auth
    initializeAuth();

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      logUserAction('sign_in_attempt', { email });
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        logUserAction('sign_in_error', { error: error.message });
        return { error };
      }
      
      logUserAction('sign_in_success', { email });
      return { error: null };
    } catch (error) {
      handleError(error, 'useAuth.signIn');
      return { error: error as Error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    try {
      logUserAction('sign_up_attempt', { email });
      
      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        logUserAction('sign_up_error', { error: error.message });
        return { error };
      }
      
      // Create the user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: name,
              avatar_url: null,
              updated_at: new Date().toISOString(),
            },
          ]);
          
        if (profileError) {
          logUserAction('profile_creation_error', { error: profileError.message });
          return { error: profileError };
        }
      }
      
      logUserAction('sign_up_success', { email });
      return { error: null };
    } catch (error) {
      handleError(error, 'useAuth.signUp');
      return { error: error as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      logUserAction('sign_out_attempt');
      
      await supabase.auth.signOut();
      
      logUserAction('sign_out_success');
    } catch (error) {
      handleError(error, 'useAuth.signOut');
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      logUserAction('reset_password_attempt', { email });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      
      if (error) {
        logUserAction('reset_password_error', { error: error.message });
        return { error };
      }
      
      logUserAction('reset_password_email_sent', { email });
      return { error: null };
    } catch (error) {
      handleError(error, 'useAuth.resetPassword');
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