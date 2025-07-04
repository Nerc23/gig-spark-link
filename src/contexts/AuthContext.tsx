
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile, getCurrentUser, getProfile } from '@/hooks/useSupabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      console.log('Refreshing profile for user:', user.id);
      const { data, error } = await getProfile(user.id);
      if (error) {
        console.error('Error refreshing profile:', error);
      } else {
        console.log('Profile refreshed:', data);
        setProfile(data);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Signing out user...');
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User logged in, fetching profile...');
          // Use setTimeout to avoid potential deadlock
          setTimeout(async () => {
            const { data, error } = await getProfile(session.user.id);
            if (error) {
              console.error('Error fetching profile:', error);
              setProfile(null);
            } else {
              console.log('Profile fetched:', data);
              setProfile(data);
            }
          }, 0);
        } else {
          console.log('No user session, clearing profile');
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setLoading(false);
          return;
        }

        console.log('Initial session:', session?.user?.id);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data, error: profileError } = await getProfile(session.user.id);
          if (profileError) {
            console.error('Error fetching initial profile:', profileError);
          } else {
            console.log('Initial profile:', data);
            setProfile(data);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    signOut: handleSignOut,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
