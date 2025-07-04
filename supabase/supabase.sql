-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create custom types
CREATE TYPE user_type AS ENUM ('freelancer', 'client');
CREATE TYPE project_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'business', 'enterprise');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    user_type user_type NOT NULL,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    phone TEXT,
    subscription_tier subscription_tier DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Freelancer-specific profiles
CREATE TABLE public.freelancer_profiles (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    skills TEXT[],
    hourly_rate DECIMAL(10,2),
    experience_level TEXT,
    portfolio_url TEXT,
    availability_status TEXT DEFAULT 'available',
    total_earnings DECIMAL(12,2) DEFAULT 0,
    completed_projects INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client-specific profiles
CREATE TABLE public.client_profiles (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    company_name TEXT,
    company_size TEXT,
    industry TEXT,
    total_spent DECIMAL(12,2) DEFAULT 0,
    active_projects INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    deadline DATE,
    required_skills TEXT[],
    status project_status DEFAULT 'open',
    selected_freelancer_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    cover_letter TEXT,
    proposed_rate DECIMAL(10,2),
    estimated_duration TEXT,
    status application_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, freelancer_id)
);

-- Messages table
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL,
    stripe_subscription_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bot commands table
CREATE TABLE public.bot_commands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    command TEXT NOT NULL,
    response TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NEW TABLE: user_analytics
CREATE TABLE public.user_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(12,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelancer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY; -- Enable RLS for new table

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for freelancer_profiles
CREATE POLICY "Freelancer profiles are viewable by everyone" ON public.freelancer_profiles
    FOR SELECT USING (true);

CREATE POLICY "Freelancers can insert their own profile" ON public.freelancer_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Freelancers can update their own profile" ON public.freelancer_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for client_profiles
CREATE POLICY "Client profiles are viewable by everyone" ON public.client_profiles
    FOR SELECT USING (true);

CREATE POLICY "Clients can insert their own profile" ON public.client_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Clients can update their own profile" ON public.client_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for projects
CREATE POLICY "Projects are viewable by everyone" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Clients can insert their own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = client_id);

-- Create RLS policies for applications
CREATE POLICY "Applications are viewable by project owner and applicant" ON public.applications
    FOR SELECT USING (
        auth.uid() = freelancer_id OR
        auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id)
    );

CREATE POLICY "Freelancers can insert their own applications" ON public.applications
    FOR INSERT WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "Freelancers can update their own applications" ON public.applications
    FOR UPDATE USING (auth.uid() = freelancer_id);

-- Create RLS policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create RLS policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for bot_commands
CREATE POLICY "Users can view their own bot commands" ON public.bot_commands
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bot commands" ON public.bot_commands
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- NEW RLS policy for user_analytics
CREATE POLICY "Users can view their own analytics" ON public.user_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics" ON public.user_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create functions and triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_freelancer_profiles
    BEFORE UPDATE ON public.freelancer_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_client_profiles
    BEFORE UPDATE ON public.client_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_projects
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_applications
    BEFORE UPDATE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_payments
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_subscriptions
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, user_type, email, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'user_type', 'freelancer')::user_type,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_applications_project_id ON public.applications(project_id);
CREATE INDEX idx_applications_freelancer_id ON public.applications(freelancer_id);
CREATE INDEX idx_messages_sender_recipient ON public.messages(sender_id, recipient_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_bot_commands_user_id ON public.bot_commands(user_id);
CREATE INDEX idx_user_analytics_user_id ON public.user_analytics(user_id); -- Index for new table

-- Insert sample projects data
INSERT INTO public.projects (client_id, title, description, budget_min, budget_max, deadline, required_skills, status) VALUES
-- Get a client user ID (we'll use the first profile with client type, or create sample data)
((SELECT id FROM public.profiles WHERE user_type = 'client' LIMIT 1), 'E-commerce Website Development', 'Looking for a full-stack developer to build a modern e-commerce platform with React and Node.js. The project includes user authentication, payment integration, and admin dashboard.', 3000, 5000, NOW() + INTERVAL '30 days', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], 'open'),

((SELECT id FROM public.profiles WHERE user_type = 'client' LIMIT 1), 'Mobile App UI/UX Design', 'Need a talented designer to create modern and intuitive UI/UX for our fitness tracking mobile app. Includes wireframes, prototypes, and final designs.', 1500, 2500, NOW() + INTERVAL '21 days', ARRAY['Figma', 'UI/UX Design', 'Mobile Design', 'Prototyping'], 'open'),

((SELECT id FROM public.profiles WHERE user_type = 'client' LIMIT 1), 'Content Writing for Tech Blog', 'Seeking experienced tech writers to create engaging blog posts about AI, blockchain, and web development. 10 articles needed, 1000-1500 words each.', 800, 1200, NOW() + INTERVAL '14 days', ARRAY['Content Writing', 'Technical Writing', 'SEO', 'Research'], 'open'),

((SELECT id FROM public.profiles WHERE user_type = 'client' LIMIT 1), 'Data Analysis Dashboard', 'Build an interactive dashboard using Python and Plotly for business intelligence. Need to connect to multiple data sources and create real-time visualizations.', 2000, 3500, NOW() + INTERVAL '45 days', ARRAY['Python', 'Plotly', 'Data Analysis', 'SQL'], 'open'),

((SELECT id FROM public.profiles WHERE user_type = 'client' LIMIT 1), 'WordPress Theme Customization', 'Customize existing WordPress theme for our agency website. Includes responsive design improvements and performance optimization.', 500, 1000, NOW() + INTERVAL '10 days', ARRAY['WordPress', 'PHP', 'CSS', 'JavaScript'], 'open'),

((SELECT id FROM public.profiles WHERE user_type = 'client' LIMIT 1), 'Logo and Brand Identity Design', 'Create a complete brand identity package including logo, color palette, typography, and brand guidelines for a fintech startup.', 1000, 1800, NOW() + INTERVAL '20 days', ARRAY['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Graphic Design'], 'open');

-- Insert sample project applications (assuming we have freelancer profiles)
INSERT INTO public.applications (project_id, freelancer_id, cover_letter, proposed_rate, estimated_duration, status) VALUES
((SELECT id FROM public.projects WHERE title = 'E-commerce Website Development' LIMIT 1), (SELECT id FROM public.profiles WHERE user_type = 'freelancer' LIMIT 1), 'I have 5+ years of experience building e-commerce platforms. I can deliver a scalable solution using React, Node.js, and PostgreSQL with integrated Stripe payments.', 4200, '4-5 weeks', 'pending'),

((SELECT id FROM public.projects WHERE title = 'Mobile App UI/UX Design' LIMIT 1), (SELECT id FROM public.profiles WHERE user_type = 'freelancer' LIMIT 1), 'As a UI/UX designer with expertise in mobile apps, I can create stunning designs that enhance user experience and drive engagement.', 2000, '3 weeks', 'accepted'),

((SELECT id FROM public.projects WHERE title = 'Content Writing for Tech Blog' LIMIT 1), (SELECT id FROM public.profiles WHERE user_type = 'freelancer' LIMIT 1), 'Technical writing is my specialty. I have written for major tech publications and can deliver SEO-optimized, engaging content.', 1000, '2 weeks', 'pending'),

((SELECT id FROM public.projects WHERE title = 'Data Analysis Dashboard' LIMIT 1), (SELECT id FROM public.profiles WHERE user_type = 'freelancer' LIMIT 1), 'I specialize in Python data visualization and have built similar dashboards. I can create an interactive BI solution with real-time capabilities.', 2800, '6 weeks', 'rejected');

-- Insert sample payments data
INSERT INTO public.payments (client_id, freelancer_id, project_id, amount, status, stripe_payment_intent_id) VALUES
-- Payment for a project (client pays freelancer)
((SELECT client_id FROM public.projects WHERE title = 'Mobile App UI/UX Design' LIMIT 1), (SELECT id FROM public.profiles WHERE user_type = 'freelancer' LIMIT 1), (SELECT id FROM public.projects WHERE title = 'Mobile App UI/UX Design' LIMIT 1), 2000, 'completed', 'pi_sample_12345'),
-- Client subscription payment
((SELECT id FROM public.profiles WHERE user_type = 'client' LIMIT 1), NULL, NULL, 29.99, 'completed', 'pi_sample_67890'),
-- Freelancer subscription payment
(NULL, (SELECT id FROM public.profiles WHERE user_type = 'freelancer' LIMIT 1), NULL, 9.99, 'completed', 'pi_sample_abcde');

-- Insert sample user analytics
INSERT INTO public.user_analytics (user_id, metric_name, metric_value, date) VALUES
((SELECT id FROM public.profiles WHERE user_type = 'freelancer' LIMIT 1), 'profile_views', 150, CURRENT_DATE - INTERVAL '1 day'),
((SELECT id FROM public.profiles WHERE user_type = 'freelancer' LIMIT 1), 'project_applications', 8, CURRENT_DATE - INTERVAL '1 day'),
((SELECT id FROM public.profiles WHERE user_type = 'client' LIMIT 1), 'project_views', 245, CURRENT_DATE - INTERVAL '1 day'),
((SELECT id FROM public.profiles WHERE user_type = 'client' LIMIT 1), 'applications_received', 15, CURRENT_DATE - INTERVAL '1 day');

-- Insert sample notifications
INSERT INTO public.notifications (user_id, title, message, type, read_at, data) VALUES
((SELECT id FROM public.profiles WHERE user_type = 'freelancer' LIMIT 1), 'New Project Match', 'A new project matching your skills has been posted: E-commerce Website Development', 'project_match', NULL, NULL),
((SELECT id FROM public.profiles WHERE user_type = 'client' LIMIT 1), 'Application Received', 'You received a new application for your project: Mobile App UI/UX Design', 'new_message', NULL, NULL),
((SELECT id FROM public.profiles WHERE user_type = 'freelancer' LIMIT 1), 'Payment Received', 'Payment of $2000 has been processed for your completed project', 'payment', NOW(), NULL);

-- Insert sample bot commands
INSERT INTO public.bot_commands (user_id, command, response, executed_at) VALUES
((SELECT id FROM public.profiles WHERE user_type = 'freelancer' LIMIT 1), 'How do I improve my profile?', 'To improve your profile, make sure to add a professional photo, detailed bio, showcase your best work in your portfolio, and keep your skills updated. Also, maintain a high response rate to client messages.', NOW()),
((SELECT id FROM public.profiles WHERE user_type = 'client' LIMIT 1), 'How to write a good project description?', 'A good project description should be clear and detailed. Include the project scope, required skills, timeline, budget range, and any specific requirements. The more information you provide, the better proposals you will receive.', NOW());
