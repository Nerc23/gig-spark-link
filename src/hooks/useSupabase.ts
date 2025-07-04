
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

// Auth helpers with proper error handling and logging
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    console.log('Supabase signUp called with:', { email, userData });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    console.log('Supabase signUp response:', { data, error });
    
    if (error) {
      console.error('SignUp error details:', error);
      // Handle specific error cases
      if (error.message.includes('User already registered')) {
        return { data: null, error: { message: 'An account with this email already exists. Please sign in instead.' } };
      }
      return { data, error };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in signUp:', err);
    return { data: null, error: { message: 'An unexpected error occurred during sign up. Please try again.' } };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Supabase signIn called with:', { email });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('Supabase signIn response:', { data, error });
    
    if (error) {
      console.error('SignIn error details:', error);
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        return { data: null, error: { message: 'Invalid email or password. Please check your credentials and try again.' } };
      }
      return { data, error };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in signIn:', err);
    return { data: null, error: { message: 'An unexpected error occurred during sign in. Please try again.' } };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err) {
    console.error('Unexpected error in signOut:', err);
    return { error: { message: 'An unexpected error occurred during sign out' } };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('getCurrentUser result:', { user, error });
    return { user, error };
  } catch (err) {
    console.error('Unexpected error in getCurrentUser:', err);
    return { user: null, error: { message: 'An unexpected error occurred getting current user' } };
  }
};

// Profile CRUD operations
export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error getting profile:', err);
    return { data: null, error: { message: 'Error fetching profile' } };
  }
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error updating profile:', err);
    return { data: null, error: { message: 'Error updating profile' } };
  }
};

export const deleteProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    return { data, error };
  } catch (err) {
    console.error('Error deleting profile:', err);
    return { data: null, error: { message: 'Error deleting profile' } };
  }
};

// Freelancer Profile CRUD operations
export const getFreelancerProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('freelancer_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error getting freelancer profile:', err);
    return { data: null, error: { message: 'Error fetching freelancer profile' } };
  }
};

export const updateFreelancerProfile = async (userId: string, updates: Partial<FreelancerProfile>) => {
  try {
    const { data, error } = await supabase
      .from('freelancer_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error updating freelancer profile:', err);
    return { data: null, error: { message: 'Error updating freelancer profile' } };
  }
};

// Client Profile CRUD operations
export const getClientProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error getting client profile:', err);
    return { data: null, error: { message: 'Error fetching client profile' } };
  }
};

export const updateClientProfile = async (userId: string, updates: Partial<ClientProfile>) => {
  try {
    const { data, error } = await supabase
      .from('client_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error updating client profile:', err);
    return { data: null, error: { message: 'Error updating client profile' } };
  }
};

// Project CRUD operations
export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error creating project:', err);
    return { data: null, error: { message: 'Error creating project' } };
  }
};

export const getProjects = async (filters?: any) => {
  try {
    let query = supabase.from('projects').select('*');
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.client_id) {
      query = query.eq('client_id', filters.client_id);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  } catch (err) {
    console.error('Error getting projects:', err);
    return { data: null, error: { message: 'Error fetching projects' } };
  }
};

export const getProject = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error getting project:', err);
    return { data: null, error: { message: 'Error fetching project' } };
  }
};

export const updateProject = async (projectId: string, updates: Partial<Project>) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error updating project:', err);
    return { data: null, error: { message: 'Error updating project' } };
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    return { data, error };
  } catch (err) {
    console.error('Error deleting project:', err);
    return { data: null, error: { message: 'Error deleting project' } };
  }
};

// Application CRUD operations
export const createApplication = async (application: Omit<Application, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .insert([application])
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error creating application:', err);
    return { data: null, error: { message: 'Error creating application' } };
  }
};

export const getApplications = async (filters?: any) => {
  try {
    let query = supabase.from('applications').select('*');
    
    if (filters?.project_id) {
      query = query.eq('project_id', filters.project_id);
    }
    if (filters?.freelancer_id) {
      query = query.eq('freelancer_id', filters.freelancer_id);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  } catch (err) {
    console.error('Error getting applications:', err);
    return { data: null, error: { message: 'Error fetching applications' } };
  }
};

export const getApplication = async (applicationId: string) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error getting application:', err);
    return { data: null, error: { message: 'Error fetching application' } };
  }
};

export const updateApplication = async (applicationId: string, updates: Partial<Application>) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', applicationId)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error updating application:', err);
    return { data: null, error: { message: 'Error updating application' } };
  }
};

export const deleteApplication = async (applicationId: string) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId);
    return { data, error };
  } catch (err) {
    console.error('Error deleting application:', err);
    return { data: null, error: { message: 'Error deleting application' } };
  }
};

// Export the supabase client for direct use
export { supabase };
