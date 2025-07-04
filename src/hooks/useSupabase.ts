
import { supabase } from '@/integrations/supabase/client';

// Types for our database
export interface Profile {
  id: string;
  user_type: 'freelancer' | 'client';
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
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
  created_at: string;
  updated_at: string;
}

export interface ClientProfile {
  id: string;
  company_name?: string;
  company_size?: string;
  industry?: string;
  total_spent?: number;
  active_projects?: number;
  rating?: number;
  created_at: string;
  updated_at: string;
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

// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
      emailRedirectTo: `${window.location.origin}/`
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Profile CRUD operations
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

export const deleteProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
  return { data, error };
};

// Freelancer Profile CRUD operations
export const getFreelancerProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateFreelancerProfile = async (userId: string, updates: Partial<FreelancerProfile>) => {
  const { data, error } = await supabase
    .from('freelancer_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Client Profile CRUD operations
export const getClientProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateClientProfile = async (userId: string, updates: Partial<ClientProfile>) => {
  const { data, error } = await supabase
    .from('client_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Project CRUD operations
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

export const getProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  return { data, error };
};

export const updateProject = async (projectId: string, updates: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();
  return { data, error };
};

export const deleteProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);
  return { data, error };
};

// Application CRUD operations
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

export const getApplication = async (applicationId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .single();
  return { data, error };
};

export const updateApplication = async (applicationId: string, updates: Partial<Application>) => {
  const { data, error } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', applicationId)
    .select()
    .single();
  return { data, error };
};

export const deleteApplication = async (applicationId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .delete()
    .eq('id', applicationId);
  return { data, error };
};

// Export the supabase client for direct use
export { supabase };
