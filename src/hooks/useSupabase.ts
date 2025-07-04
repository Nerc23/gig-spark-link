import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a fallback client if environment variables are missing
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Types for our database
export interface Profile {
  id: string;
  user_type: 'freelancer' | 'client';
  full_name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  subscription_tier: 'free' | 'basic' | 'business' | 'enterprise';
  subscription_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FreelancerProfile {
  id: string;
  skills?: string[];
  hourly_rate?: number;
  experience_level?: string;
  portfolio_url?: string;
  availability_status?: string;
  total_earnings?: number;
  completed_projects?: number;
  rating?: number;
  total_reviews?: number;
}

export interface ClientProfile {
  id: string;
  company_name?: string;
  company_size?: string;
  industry?: string;
  total_spent?: number;
  active_projects?: number;
  rating?: number;
  total_reviews?: number;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  required_skills?: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  selected_freelancer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  project_id: string;
  freelancer_id: string;
  cover_letter?: string;
  proposed_rate?: number;
  estimated_duration?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Auth helpers with null checks
export const signUp = async (email: string, password: string, userData: any) => {
  if (!supabase) {
    console.warn('Supabase not configured');
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    console.warn('Supabase not configured');
    return { data: null, error: { message: 'Supabase not configured' } };
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  if (!supabase) {
    console.warn('Supabase not configured');
    return { error: { message: 'Supabase not configured' } };
  }
  
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!supabase) {
    console.warn('Supabase not configured');
    return { user: null, error: { message: 'Supabase not configured' } };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Profile helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Project helpers
export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();
  return { data, error };
};

export const getProjects = async (filters?: any) => {
  let query = supabase.from('projects').select('*');
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.client_id) {
    query = query.eq('client_id', filters.client_id);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

// Application helpers
export const createApplication = async (application: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('applications')
    .insert([application])
    .select()
    .single();
  return { data, error };
};

export const getApplications = async (filters?: any) => {
  let query = supabase.from('applications').select('*');
  
  if (filters?.project_id) {
    query = query.eq('project_id', filters.project_id);
  }
  if (filters?.freelancer_id) {
    query = query.eq('freelancer_id', filters.freelancer_id);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};
