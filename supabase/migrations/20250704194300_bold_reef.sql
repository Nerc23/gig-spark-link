/*
  # Enhanced Features for WorkFlow Bot Platform

  1. New Tables
    - `skills` - Standardized skills catalog
    - `project_milestones` - Break projects into trackable milestones
    - `reviews` - User reviews and ratings system
    - `saved_projects` - Freelancers can save interesting projects
    - `project_categories` - Standardized project categories
    - `user_preferences` - AI matching preferences
    - `chat_rooms` - Organized messaging by project
    - `file_attachments` - File sharing capabilities
    - `dispute_resolutions` - Handle project disputes
    - `time_tracking` - Track work hours for hourly projects

  2. Enhanced Features
    - Better AI matching with preferences
    - Milestone-based project management
    - Comprehensive review system
    - File sharing and attachments
    - Time tracking for hourly work
    - Dispute resolution system
    - Improved messaging with chat rooms

  3. Security & Performance
    - Proper RLS policies for all new tables
    - Optimized indexes for better performance
    - Data validation constraints
*/

-- Skills catalog for standardized skill matching
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project categories for better organization
CREATE TABLE IF NOT EXISTS public.project_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project milestones for better project management
CREATE TABLE IF NOT EXISTS public.project_milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(10,2),
    due_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'disputed')),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews and ratings system
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved projects for freelancers
CREATE TABLE IF NOT EXISTS public.saved_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, project_id)
);

-- User preferences for AI matching
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    preferred_project_types TEXT[],
    preferred_budget_range_min DECIMAL(10,2),
    preferred_budget_range_max DECIMAL(10,2),
    preferred_project_duration TEXT,
    notification_settings JSONB DEFAULT '{}',
    ai_matching_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat rooms for organized messaging
CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    participants UUID[] NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File attachments for projects and messages
CREATE TABLE IF NOT EXISTS public.file_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    uploader_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    file_url TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dispute resolution system
CREATE TABLE IF NOT EXISTS public.dispute_resolutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    initiated_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    dispute_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'closed')),
    resolution_notes TEXT,
    resolved_by UUID REFERENCES public.profiles(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time tracking for hourly projects
CREATE TABLE IF NOT EXISTS public.time_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    description TEXT,
    is_billable BOOLEAN DEFAULT true,
    hourly_rate DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns to existing tables
DO $$
BEGIN
    -- Add category reference to projects table
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'category_id'
    ) THEN
        ALTER TABLE public.projects ADD COLUMN category_id UUID REFERENCES public.project_categories(id);
    END IF;

    -- Add chat room reference to messages
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'chat_room_id'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN chat_room_id UUID REFERENCES public.chat_rooms(id);
    END IF;

    -- Add project type to projects (fixed/hourly)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'project_type'
    ) THEN
        ALTER TABLE public.projects ADD COLUMN project_type TEXT DEFAULT 'fixed' CHECK (project_type IN ('fixed', 'hourly'));
    END IF;

    -- Add verification status to profiles
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'is_verified'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN is_verified BOOLEAN DEFAULT false;
    END IF;

    -- Add last active timestamp
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'last_active_at'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Enable RLS on all new tables
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispute_resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skills (public read, admin write)
CREATE POLICY "Skills are viewable by everyone" ON public.skills
    FOR SELECT USING (true);

-- RLS Policies for project_categories (public read, admin write)
CREATE POLICY "Project categories are viewable by everyone" ON public.project_categories
    FOR SELECT USING (true);

-- RLS Policies for project_milestones
CREATE POLICY "Milestones viewable by project participants" ON public.project_milestones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_id 
            AND (p.client_id = auth.uid() OR p.selected_freelancer_id = auth.uid())
        )
    );

CREATE POLICY "Project owners can manage milestones" ON public.project_milestones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_id AND p.client_id = auth.uid()
        )
    );

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create reviews for completed projects" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() = reviewer_id AND
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_id 
            AND p.status = 'completed'
            AND (p.client_id = auth.uid() OR p.selected_freelancer_id = auth.uid())
        )
    );

-- RLS Policies for saved_projects
CREATE POLICY "Users can view their own saved projects" ON public.saved_projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own saved projects" ON public.saved_projects
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for chat_rooms
CREATE POLICY "Users can view chat rooms they participate in" ON public.chat_rooms
    FOR SELECT USING (auth.uid() = ANY(participants));

CREATE POLICY "Project participants can create chat rooms" ON public.chat_rooms
    FOR INSERT WITH CHECK (
        auth.uid() = created_by AND
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_id 
            AND (p.client_id = auth.uid() OR p.selected_freelancer_id = auth.uid())
        )
    );

-- RLS Policies for file_attachments
CREATE POLICY "Users can view project files they have access to" ON public.file_attachments
    FOR SELECT USING (
        is_public = true OR
        auth.uid() = uploader_id OR
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_id 
            AND (p.client_id = auth.uid() OR p.selected_freelancer_id = auth.uid())
        )
    );

CREATE POLICY "Users can upload files to their projects" ON public.file_attachments
    FOR INSERT WITH CHECK (
        auth.uid() = uploader_id AND
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_id 
            AND (p.client_id = auth.uid() OR p.selected_freelancer_id = auth.uid())
        )
    );

-- RLS Policies for dispute_resolutions
CREATE POLICY "Users can view disputes for their projects" ON public.dispute_resolutions
    FOR SELECT USING (
        auth.uid() = initiated_by OR
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_id 
            AND (p.client_id = auth.uid() OR p.selected_freelancer_id = auth.uid())
        )
    );

CREATE POLICY "Users can create disputes for their projects" ON public.dispute_resolutions
    FOR INSERT WITH CHECK (
        auth.uid() = initiated_by AND
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_id 
            AND (p.client_id = auth.uid() OR p.selected_freelancer_id = auth.uid())
        )
    );

-- RLS Policies for time_tracking
CREATE POLICY "Users can view time tracking for their projects" ON public.time_tracking
    FOR SELECT USING (
        auth.uid() = freelancer_id OR
        EXISTS (
            SELECT 1 FROM public.projects p 
            WHERE p.id = project_id AND p.client_id = auth.uid()
        )
    );

CREATE POLICY "Freelancers can manage their own time tracking" ON public.time_tracking
    FOR ALL USING (auth.uid() = freelancer_id);

-- Create updated_at triggers for new tables
CREATE TRIGGER handle_updated_at_project_milestones
    BEFORE UPDATE ON public.project_milestones
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_user_preferences
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_dispute_resolutions
    BEFORE UPDATE ON public.dispute_resolutions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_time_tracking
    BEFORE UPDATE ON public.time_tracking
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON public.project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_status ON public.project_milestones(status);
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON public.reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_saved_projects_user_id ON public.saved_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_project_id ON public.chat_rooms(project_id);
CREATE INDEX IF NOT EXISTS idx_file_attachments_project_id ON public.file_attachments(project_id);
CREATE INDEX IF NOT EXISTS idx_dispute_resolutions_project_id ON public.dispute_resolutions(project_id);
CREATE INDEX IF NOT EXISTS idx_time_tracking_project_id ON public.time_tracking(project_id);
CREATE INDEX IF NOT EXISTS idx_time_tracking_freelancer_id ON public.time_tracking(freelancer_id);

-- Insert sample data for skills
INSERT INTO public.skills (name, category, description) VALUES
('React', 'Frontend Development', 'JavaScript library for building user interfaces'),
('Node.js', 'Backend Development', 'JavaScript runtime for server-side development'),
('Python', 'Programming Languages', 'High-level programming language'),
('UI/UX Design', 'Design', 'User interface and user experience design'),
('Content Writing', 'Writing', 'Creating written content for various purposes'),
('Digital Marketing', 'Marketing', 'Online marketing strategies and campaigns'),
('Data Analysis', 'Data Science', 'Analyzing and interpreting data'),
('WordPress', 'CMS', 'Content management system development'),
('Figma', 'Design Tools', 'Collaborative design and prototyping tool'),
('PostgreSQL', 'Databases', 'Advanced open-source relational database')
ON CONFLICT (name) DO NOTHING;

-- Insert sample data for project categories
INSERT INTO public.project_categories (name, description, icon) VALUES
('Web Development', 'Building websites and web applications', 'globe'),
('Mobile Development', 'Creating mobile applications', 'smartphone'),
('UI/UX Design', 'User interface and experience design', 'palette'),
('Content Writing', 'Writing and content creation', 'edit'),
('Digital Marketing', 'Online marketing and promotion', 'megaphone'),
('Data Science', 'Data analysis and machine learning', 'bar-chart'),
('DevOps', 'Development operations and infrastructure', 'server'),
('Graphic Design', 'Visual design and branding', 'image')
ON CONFLICT (name) DO NOTHING;

-- Function to calculate user ratings
CREATE OR REPLACE FUNCTION public.calculate_user_rating(user_id UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    avg_rating DECIMAL(3,2);
BEGIN
    SELECT COALESCE(AVG(rating), 0) INTO avg_rating
    FROM public.reviews
    WHERE reviewee_id = user_id AND is_public = true;
    
    RETURN ROUND(avg_rating, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to update user ratings automatically
CREATE OR REPLACE FUNCTION public.update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update freelancer profile rating
    IF EXISTS (SELECT 1 FROM public.freelancer_profiles WHERE id = NEW.reviewee_id) THEN
        UPDATE public.freelancer_profiles 
        SET rating = public.calculate_user_rating(NEW.reviewee_id),
            total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE reviewee_id = NEW.reviewee_id)
        WHERE id = NEW.reviewee_id;
    END IF;
    
    -- Update client profile rating
    IF EXISTS (SELECT 1 FROM public.client_profiles WHERE id = NEW.reviewee_id) THEN
        UPDATE public.client_profiles 
        SET rating = public.calculate_user_rating(NEW.reviewee_id),
            total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE reviewee_id = NEW.reviewee_id)
        WHERE id = NEW.reviewee_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update ratings when reviews are added
CREATE TRIGGER update_user_rating_on_review
    AFTER INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_user_rating();

-- Function to automatically calculate time tracking duration
CREATE OR REPLACE FUNCTION public.calculate_time_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
        NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 60;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate duration automatically
CREATE TRIGGER calculate_time_duration_trigger
    BEFORE INSERT OR UPDATE ON public.time_tracking
    FOR EACH ROW EXECUTE FUNCTION public.calculate_time_duration();