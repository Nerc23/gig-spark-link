import { supabase } from '@/integrations/supabase/client';

// Enhanced types for new features
export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  amount?: number;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'disputed';
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  project_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  title?: string;
  comment?: string;
  is_public: boolean;
  created_at: string;
}

export interface SavedProject {
  id: string;
  user_id: string;
  project_id: string;
  notes?: string;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_project_types?: string[];
  preferred_budget_range_min?: number;
  preferred_budget_range_max?: number;
  preferred_project_duration?: string;
  notification_settings: Record<string, any>;
  ai_matching_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatRoom {
  id: string;
  project_id: string;
  name: string;
  participants: string[];
  created_by: string;
  created_at: string;
}

export interface FileAttachment {
  id: string;
  uploader_id: string;
  project_id?: string;
  message_id?: string;
  file_name: string;
  file_size?: number;
  file_type?: string;
  file_url: string;
  is_public: boolean;
  created_at: string;
}

export interface DisputeResolution {
  id: string;
  project_id: string;
  initiated_by: string;
  dispute_type: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  resolution_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeTracking {
  id: string;
  project_id: string;
  freelancer_id: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  description?: string;
  is_billable: boolean;
  hourly_rate?: number;
  created_at: string;
  updated_at: string;
}

// Skills CRUD operations
export const getSkills = async (category?: string) => {
  try {
    let query = supabase.from('skills').select('*').eq('is_active', true);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('name');
    return { data, error };
  } catch (err) {
    console.error('Error getting skills:', err);
    return { data: null, error: { message: 'Error fetching skills' } };
  }
};

export const getSkillCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('category')
      .eq('is_active', true)
      .order('category');
    
    const categories = [...new Set(data?.map(item => item.category) || [])];
    return { data: categories, error };
  } catch (err) {
    console.error('Error getting skill categories:', err);
    return { data: null, error: { message: 'Error fetching skill categories' } };
  }
};

// Project Categories CRUD operations
export const getProjectCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('project_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
    return { data, error };
  } catch (err) {
    console.error('Error getting project categories:', err);
    return { data: null, error: { message: 'Error fetching project categories' } };
  }
};

// Project Milestones CRUD operations
export const createMilestone = async (milestone: Omit<ProjectMilestone, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('project_milestones')
      .insert([milestone])
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error creating milestone:', err);
    return { data: null, error: { message: 'Error creating milestone' } };
  }
};

export const getProjectMilestones = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');
    return { data, error };
  } catch (err) {
    console.error('Error getting milestones:', err);
    return { data: null, error: { message: 'Error fetching milestones' } };
  }
};

export const updateMilestone = async (milestoneId: string, updates: Partial<ProjectMilestone>) => {
  try {
    const { data, error } = await supabase
      .from('project_milestones')
      .update(updates)
      .eq('id', milestoneId)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error updating milestone:', err);
    return { data: null, error: { message: 'Error updating milestone' } };
  }
};

// Reviews CRUD operations
export const createReview = async (review: Omit<Review, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error creating review:', err);
    return { data: null, error: { message: 'Error creating review' } };
  }
};

export const getUserReviews = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:reviewer_id(full_name, avatar_url),
        project:project_id(title)
      `)
      .eq('reviewee_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    return { data, error };
  } catch (err) {
    console.error('Error getting user reviews:', err);
    return { data: null, error: { message: 'Error fetching reviews' } };
  }
};

// Saved Projects CRUD operations
export const saveProject = async (userId: string, projectId: string, notes?: string) => {
  try {
    const { data, error } = await supabase
      .from('saved_projects')
      .insert([{ user_id: userId, project_id: projectId, notes }])
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error saving project:', err);
    return { data: null, error: { message: 'Error saving project' } };
  }
};

export const unsaveProject = async (userId: string, projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('saved_projects')
      .delete()
      .eq('user_id', userId)
      .eq('project_id', projectId);
    return { data, error };
  } catch (err) {
    console.error('Error unsaving project:', err);
    return { data: null, error: { message: 'Error unsaving project' } };
  }
};

export const getSavedProjects = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('saved_projects')
      .select(`
        *,
        project:project_id(
          *,
          client:client_id(full_name, avatar_url)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  } catch (err) {
    console.error('Error getting saved projects:', err);
    return { data: null, error: { message: 'Error fetching saved projects' } };
  }
};

// User Preferences CRUD operations
export const getUserPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error getting user preferences:', err);
    return { data: null, error: { message: 'Error fetching user preferences' } };
  }
};

export const updateUserPreferences = async (userId: string, preferences: Partial<UserPreferences>) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ user_id: userId, ...preferences })
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error updating user preferences:', err);
    return { data: null, error: { message: 'Error updating user preferences' } };
  }
};

// Time Tracking CRUD operations
export const startTimeTracking = async (projectId: string, freelancerId: string, description?: string) => {
  try {
    const { data, error } = await supabase
      .from('time_tracking')
      .insert([{
        project_id: projectId,
        freelancer_id: freelancerId,
        start_time: new Date().toISOString(),
        description
      }])
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error starting time tracking:', err);
    return { data: null, error: { message: 'Error starting time tracking' } };
  }
};

export const stopTimeTracking = async (timeTrackingId: string) => {
  try {
    const { data, error } = await supabase
      .from('time_tracking')
      .update({ end_time: new Date().toISOString() })
      .eq('id', timeTrackingId)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error stopping time tracking:', err);
    return { data: null, error: { message: 'Error stopping time tracking' } };
  }
};

export const getTimeTrackingForProject = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('time_tracking')
      .select(`
        *,
        freelancer:freelancer_id(full_name)
      `)
      .eq('project_id', projectId)
      .order('start_time', { ascending: false });
    return { data, error };
  } catch (err) {
    console.error('Error getting time tracking:', err);
    return { data: null, error: { message: 'Error fetching time tracking' } };
  }
};

// File Attachments CRUD operations
export const uploadFileAttachment = async (file: File, projectId: string, uploaderId: string) => {
  try {
    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `project-files/${projectId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(filePath, file);

    if (uploadError) {
      return { data: null, error: uploadError };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-files')
      .getPublicUrl(filePath);

    // Save file metadata to database
    const { data, error } = await supabase
      .from('file_attachments')
      .insert([{
        uploader_id: uploaderId,
        project_id: projectId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_url: publicUrl
      }])
      .select()
      .single();

    return { data, error };
  } catch (err) {
    console.error('Error uploading file:', err);
    return { data: null, error: { message: 'Error uploading file' } };
  }
};

export const getProjectFiles = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('file_attachments')
      .select(`
        *,
        uploader:uploader_id(full_name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    return { data, error };
  } catch (err) {
    console.error('Error getting project files:', err);
    return { data: null, error: { message: 'Error fetching project files' } };
  }
};

// Dispute Resolution CRUD operations
export const createDispute = async (dispute: Omit<DisputeResolution, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('dispute_resolutions')
      .insert([dispute])
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('Error creating dispute:', err);
    return { data: null, error: { message: 'Error creating dispute' } };
  }
};

export const getProjectDisputes = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('dispute_resolutions')
      .select(`
        *,
        initiated_by_user:initiated_by(full_name),
        resolved_by_user:resolved_by(full_name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    return { data, error };
  } catch (err) {
    console.error('Error getting disputes:', err);
    return { data: null, error: { message: 'Error fetching disputes' } };
  }
};

// AI Matching function
export const getAIMatchedProjects = async (userId: string, limit: number = 10) => {
  try {
    // Get user preferences and skills
    const { data: preferences } = await getUserPreferences(userId);
    const { data: freelancerProfile } = await supabase
      .from('freelancer_profiles')
      .select('skills')
      .eq('id', userId)
      .single();

    // Build query based on preferences and skills
    let query = supabase
      .from('projects')
      .select(`
        *,
        client:client_id(full_name, avatar_url),
        category:category_id(name)
      `)
      .eq('status', 'open');

    // Apply budget filter if preferences exist
    if (preferences?.preferred_budget_range_min) {
      query = query.gte('budget_min', preferences.preferred_budget_range_min);
    }
    if (preferences?.preferred_budget_range_max) {
      query = query.lte('budget_max', preferences.preferred_budget_range_max);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    // Simple skill matching (in a real app, you'd use more sophisticated AI)
    if (data && freelancerProfile?.skills) {
      const matchedProjects = data.map(project => {
        const skillMatch = project.required_skills?.some(skill => 
          freelancerProfile.skills?.includes(skill)
        ) || false;
        
        return {
          ...project,
          match_score: skillMatch ? 0.8 : 0.3 // Simple scoring
        };
      }).sort((a, b) => b.match_score - a.match_score);

      return { data: matchedProjects, error };
    }

    return { data, error };
  } catch (err) {
    console.error('Error getting AI matched projects:', err);
    return { data: null, error: { message: 'Error fetching matched projects' } };
  }
};

export { supabase };