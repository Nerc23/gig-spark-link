/*
  # Complete Database Schema for WorkFlow Bot

  1. Database Structure
    - User profiles with freelancer/client types
    - Projects with applications and milestones
    - Messaging and notifications system
    - Payment and subscription tracking
    - Analytics and bot interactions
    - Advertisements

  2. Sample Data
    - Demo users (freelancers and clients)
    - Sample projects across different categories
    - Applications and project interactions
    - Payment history and subscription data
    - Analytics and engagement metrics

  3. Security
    - Row Level Security (RLS) enabled
    - Proper access policies for all tables
    - User-specific data protection
*/

-- Drop all existing tables and types to start fresh
-- IMPORTANT: Running this will DELETE ALL DATA in these tables.
DROP TABLE IF EXISTS public.user_analytics CASCADE;
DROP TABLE IF EXISTS public.project_applications CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.bot_interactions CASCADE;
DROP TABLE IF EXISTS public.advertisements CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Drop existing enum types
DROP TYPE IF EXISTS user_type CASCADE;
DROP TYPE IF EXISTS subscription_tier CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;

-- Create custom enum types
CREATE TYPE user_type AS ENUM ('freelancer', 'client');
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro', 'business', 'enterprise');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'in_progress', 'completed', 'cancelled');
CREATE TYPE notification_type AS ENUM ('project_match', 'new_message', 'payment', 'system');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create profiles table (main user information, , includes freelancer and client specific fields)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    user_type user_type NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    phone TEXT,
    
    -- Freelancer specific fields
    hourly_rate DECIMAL(10,2),
    skills TEXT[],
    experience_level TEXT,
    availability_status TEXT DEFAULT 'available',
    portfolio_url TEXT,
    
    -- Client specific fields
    company_name TEXT,
    company_size TEXT,
    industry TEXT,
    
    -- Subscription fields
    subscription_tier subscription_tier NOT NULL DEFAULT 'free',
    subscription_expires_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    deadline TIMESTAMPTZ,
    required_skills TEXT[],
    project_type TEXT, -- e.g., 'Web Development', 'Design', 'Content'
    experience_required TEXT, 
    status project_status NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create project applications table
CREATE TABLE public.project_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    proposal TEXT NOT NULL,
    bid_amount DECIMAL(10,2) NOT NULL,
    estimated_duration TEXT,
    status application_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, freelancer_id)
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    related_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status payment_status NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    stripe_payment_intent_id TEXT,
    subscription_tier subscription_tier,
    billing_period TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user analytics table
CREATE TABLE public.user_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value INTEGER NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create bot interactions table
CREATE TABLE public.bot_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    response TEXT,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create advertisements table
CREATE TABLE public.advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    target_url TEXT NOT NULL,
    target_user_type user_type,
    target_skills TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        user_type
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New User'),
        CASE 
            WHEN NEW.raw_user_meta_data->>'user_type' = 'client' THEN 'client'::user_type
            ELSE 'freelancer'::user_type
        END
    );
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON public.project_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for projects table
CREATE POLICY "Anyone can view active projects" ON public.projects FOR SELECT USING (status = 'active');
CREATE POLICY "Clients can manage own projects" ON public.projects FOR ALL USING (auth.uid() = client_id);

-- RLS Policies for project applications table
CREATE POLICY "Freelancers can create applications" ON public.project_applications FOR INSERT WITH CHECK (auth.uid() = freelancer_id);
CREATE POLICY "Freelancers can view own applications" ON public.project_applications FOR SELECT USING (auth.uid() = freelancer_id);
CREATE POLICY "Clients can view applications for their projects" ON public.project_applications FOR SELECT USING (
    auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id)
);
CREATE POLICY "Clients can update applications for their projects" ON public.project_applications FOR UPDATE USING (
    auth.uid() IN (SELECT client_id FROM public.projects WHERE id = project_id)
);

-- RLS Policies for messages table
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
);
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
);

-- RLS Policies for notifications table
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for payments table
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for user analytics table
CREATE POLICY "Users can view own analytics" ON public.user_analytics FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for bot interactions table
CREATE POLICY "Users can create bot interactions" ON public.bot_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own bot interactions" ON public.bot_interactions FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for advertisements table
CREATE POLICY "Anyone can view active ads" ON public.advertisements FOR SELECT USING (is_active = true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_applications_project_id ON public.project_applications(project_id);
CREATE INDEX idx_applications_freelancer_id ON public.project_applications(freelancer_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX idx_bot_interactions_user_id ON public.bot_interactions(user_id);

-- Insert sample data

-- Sample freelancer profiles
INSERT INTO public.profiles (id, email, full_name, user_type, bio, location, hourly_rate, skills, experience_level, availability_status, portfolio_url) VALUES
('11111111-1111-1111-1111-111111111111', 'sarah.chen@example.com', 'Sarah Chen', 'freelancer', 'Full-stack developer with 5+ years experience in React, Node.js, and cloud technologies. Passionate about creating scalable web applications.', 'San Francisco, CA', 85.00, ARRAY['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'], 'expert', 'available', 'https://sarahchen.dev'),
('22222222-2222-2222-2222-222222222222', 'mike.johnson@example.com', 'Mike Johnson', 'freelancer', 'Creative UI/UX designer specializing in mobile apps and modern web interfaces. 4 years of experience with top startups.', 'Austin, TX', 65.00, ARRAY['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'], 'intermediate', 'available', 'https://mikejohnson.design'),
('33333333-3333-3333-3333-333333333333', 'alex.rivera@example.com', 'Alex Rivera', 'freelancer', 'Mobile app developer focused on React Native and Flutter. Built 20+ apps with millions of downloads.', 'Miami, FL', 75.00, ARRAY['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'], 'expert', 'busy', 'https://alexrivera.dev'),
('44444444-4444-4444-4444-444444444444', 'emma.thompson@example.com', 'Emma Thompson', 'freelancer', 'Technical writer and content strategist. Specialized in creating documentation, blog posts, and marketing content for tech companies.', 'London, UK', 45.00, ARRAY['Technical Writing', 'Content Strategy', 'SEO', 'Documentation', 'Copywriting'], 'intermediate', 'available', 'https://emmathompson.writer'),
('55555555-5555-5555-5555-555555555555', 'david.park@example.com', 'David Park', 'freelancer', 'Data scientist and ML engineer with expertise in Python, TensorFlow, and cloud platforms. PhD in Computer Science.', 'Seattle, WA', 95.00, ARRAY['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'AWS'], 'expert', 'available', 'https://davidpark.ai');

-- Sample client profiles
INSERT INTO public.profiles (id, email, full_name, user_type, bio, location, company_name, company_size, industry, subscription_tier) VALUES
('66666666-6666-6666-6666-666666666666', 'john.startup@techcorp.com', 'John Smith', 'client', 'CTO at TechCorp, building the next generation of fintech solutions.', 'New York, NY', 'TechCorp Inc.', '50-100', 'Fintech', 'pro'),
('77777777-7777-7777-7777-777777777777', 'lisa.founder@startupxyz.com', 'Lisa Wang', 'client', 'Founder of StartupXYZ, revolutionizing the fitness industry with AI-powered solutions.', 'Los Angeles, CA', 'StartupXYZ', '10-50', 'Health & Fitness', 'basic'),
('88888888-8888-8888-8888-888888888888', 'robert.ceo@devblog.com', 'Robert Brown', 'client', 'CEO of DevBlog Media, creating educational content for developers worldwide.', 'Chicago, IL', 'DevBlog Media', '10-50', 'Media & Publishing', 'enterprise'),
('99999999-9999-9999-9999-999999999999', 'maria.director@healthtech.com', 'Maria Garcia', 'client', 'Product Director at HealthTech Solutions, building healthcare software that saves lives.', 'Boston, MA', 'HealthTech Solutions', '100-500', 'Healthcare', 'pro'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'james.vp@growthco.com', 'James Wilson', 'client', 'VP of Marketing at GrowthCo, helping businesses scale through digital marketing.', 'Denver, CO', 'GrowthCo', '50-100', 'Marketing', 'basic');

-- Sample projects
INSERT INTO public.projects (id, client_id, title, description, budget_min, budget_max, deadline, required_skills, project_type, experience_required, status, is_featured) VALUES
('p1111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'E-commerce Platform Development', 'Build a modern e-commerce platform with React frontend, Node.js backend, and PostgreSQL database. Must include user authentication, payment processing with Stripe, inventory management, and admin dashboard. The platform should handle high traffic and be scalable.', 8000.00, 12000.00, NOW() + INTERVAL '8 weeks', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'], 'Web Application', 'expert', 'active', true),
('p2222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 'Fitness App UI/UX Design', 'Design a complete UI/UX for our AI-powered fitness tracking mobile application. Need wireframes, high-fidelity mockups, prototypes, and design system. The app should be intuitive, motivating, and accessible. Include onboarding flow, workout tracking, progress visualization, and social features.', 3000.00, 5000.00, NOW() + INTERVAL '4 weeks', ARRAY['UI/UX Design', 'Figma', 'Mobile Design', 'Prototyping'], 'Design', 'intermediate', 'active', true),
('p3333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', 'Technical Blog Content Creation', 'Create 20 high-quality technical blog posts about web development, AI, blockchain, and emerging technologies. Each article should be 1500-2000 words, SEO-optimized, and include code examples. Target audience is intermediate to advanced developers.', 4000.00, 6000.00, NOW() + INTERVAL '6 weeks', ARRAY['Technical Writing', 'SEO', 'Web Development', 'AI'], 'Content Creation', 'intermediate', 'active', false),
('p4444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', 'React Native Healthcare App', 'Develop a cross-platform mobile app for healthcare providers using React Native. Features include patient management, appointment scheduling, telemedicine integration, secure messaging, and HIPAA compliance. Must integrate with existing backend APIs.', 15000.00, 20000.00, NOW() + INTERVAL '12 weeks', ARRAY['React Native', 'Healthcare', 'HIPAA', 'API Integration'], 'Mobile App', 'expert', 'active', true),
('p5555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Digital Marketing Campaign', 'Plan and execute a comprehensive digital marketing campaign including social media strategy, PPC advertising, content marketing, email campaigns, and analytics tracking. Goal is to increase brand awareness and generate qualified leads for B2B SaaS product.', 5000.00, 8000.00, NOW() + INTERVAL '10 weeks', ARRAY['Digital Marketing', 'PPC', 'Social Media', 'Analytics'], 'Marketing', 'intermediate', 'active', false),
('p6666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Data Analytics Dashboard', 'Build an interactive business intelligence dashboard using Python, Plotly, and Streamlit. Connect to multiple data sources (PostgreSQL, APIs, CSV files), create real-time visualizations, and implement user authentication. Include predictive analytics and automated reporting.', 6000.00, 9000.00, NOW() + INTERVAL '7 weeks', ARRAY['Python', 'Plotly', 'Data Analysis', 'SQL'], 'Data Science', 'expert', 'active', false),
('p7777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'WordPress Theme Customization', 'Customize existing WordPress theme for fitness company website. Improve responsive design, optimize performance, add custom post types for workouts and nutrition plans, integrate with WooCommerce, and ensure SEO optimization.', 2000.00, 3500.00, NOW() + INTERVAL '3 weeks', ARRAY['WordPress', 'PHP', 'CSS', 'WooCommerce'], 'Website', 'intermediate', 'active', false),
('p8888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'Brand Identity Design Package', 'Create complete brand identity for tech education company including logo design, color palette, typography system, brand guidelines, business card design, letterhead, and social media templates. Modern, professional, and tech-focused aesthetic.', 3500.00, 5500.00, NOW() + INTERVAL '5 weeks', ARRAY['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Graphic Design'], 'Design', 'intermediate', 'active', false);

-- Sample project applications
INSERT INTO public.project_applications (id, project_id, freelancer_id, proposal, bid_amount, estimated_duration, status) VALUES
('a1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'I have extensive experience building scalable e-commerce platforms. In my last project, I built a similar platform that handles 10k+ daily users. I will use React with TypeScript for the frontend, Node.js with Express for the backend, and PostgreSQL for the database. The architecture will be microservices-based for scalability. I can deliver this project in 7 weeks with weekly progress updates.', 10500.00, '7 weeks', 'pending'),
('a2222222-2222-2222-2222-222222222222', 'p1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'As a full-stack developer with 6 years of experience, I can build your e-commerce platform using modern technologies. I have built 5+ e-commerce sites with payment integration and can ensure high performance and security. My approach includes thorough testing and documentation.', 9800.00, '8 weeks', 'pending'),
('a3333333-3333-3333-3333-333333333333', 'p2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'I specialize in fitness app design and have created UI/UX for 3 successful fitness apps. I understand the importance of motivation and user engagement in fitness apps. I will create a comprehensive design system with user research, wireframes, high-fidelity designs, and interactive prototypes. My designs focus on accessibility and user retention.', 4200.00, '4 weeks', 'accepted'),
('a4444444-4444-4444-4444-444444444444', 'p3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Technical writing is my specialty with 4 years of experience writing for major tech publications. I have deep knowledge of web development, AI, and blockchain technologies. Each article will be thoroughly researched, include practical examples, and be optimized for SEO. I can deliver 3-4 articles per week with consistent quality.', 5000.00, '5 weeks', 'pending'),
('a5555555-5555-5555-5555-555555555555', 'p4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'I have extensive experience in healthcare app development with HIPAA compliance. I have built 3 healthcare apps that are currently in production. I understand the security requirements and can ensure full compliance. The app will be built with React Native for cross-platform compatibility and will include offline capabilities.', 18000.00, '11 weeks', 'pending'),
('a6666666-6666-6666-6666-666666666666', 'p5555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'I have 5 years of digital marketing experience with B2B SaaS companies. I have successfully increased lead generation by 300% for my previous clients. My approach includes comprehensive market research, competitor analysis, multi-channel campaigns, and detailed performance tracking. I will provide weekly reports and optimization recommendations.', 6500.00, '9 weeks', 'pending'),
('a7777777-7777-7777-7777-777777777777', 'p6666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', 'As a data scientist with PhD in Computer Science, I have built multiple BI dashboards for Fortune 500 companies. I will create an intuitive dashboard with real-time data processing, predictive analytics, and automated insights. The solution will be scalable and include comprehensive documentation and training.', 7500.00, '6 weeks', 'pending'),
('a8888888-8888-8888-8888-888888888888', 'p7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'I have 4 years of WordPress development experience and have customized 50+ themes. I understand the fitness industry requirements and can create a high-performance, SEO-optimized website. I will ensure mobile responsiveness, fast loading times, and seamless WooCommerce integration.', 2800.00, '3 weeks', 'pending');

-- Sample messages
INSERT INTO public.messages (sender_id, recipient_id, project_id, content, is_read) VALUES
('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'Hi Sarah, I reviewed your proposal and I''m very impressed with your experience. I''d like to schedule a call to discuss the project requirements in more detail. When would be a good time for you?', true),
('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'p1111111-1111-1111-1111-111111111111', 'Thank you for considering my proposal! I''m available for a call tomorrow between 2-4 PM EST or Thursday morning. I have some additional questions about the payment integration requirements that would be great to discuss.', false),
('77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222222', 'Mike, I love your design approach! Your portfolio shows exactly the kind of modern, engaging design we''re looking for. I''d like to move forward with your proposal. When can we start?', true),
('22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 'p2222222-2222-2222-2222-222222222222', 'Fantastic! I''m excited to work on this project. I can start immediately and will have the initial wireframes ready by Friday. I''ll also prepare some user research questions to better understand your target audience.', true),
('88888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444', 'p3333333-3333-3333-3333-333333333333', 'Emma, your writing samples are excellent. I particularly liked your article on microservices architecture. Could you provide a content calendar for the 20 articles with proposed topics and publication dates?', false);

-- Sample notifications
INSERT INTO public.notifications (user_id, title, message, type, related_id, is_read) VALUES
('11111111-1111-1111-1111-111111111111', 'New Project Match', 'A new project matching your skills has been posted: E-commerce Platform Development', 'project_match', 'p1111111-1111-1111-1111-111111111111', false),
('22222222-2222-2222-2222-222222222222', 'Application Accepted', 'Congratulations! Your application for "Fitness App UI/UX Design" has been accepted.', 'system', 'a3333333-3333-3333-3333-333333333333', false),
('66666666-6666-6666-6666-666666666666', 'New Application', 'You received a new application for your project: E-commerce Platform Development', 'system', 'a1111111-1111-1111-1111-111111111111', true),
('33333333-3333-3333-3333-333333333333', 'New Message', 'You have a new message from John Smith regarding E-commerce Platform Development', 'new_message', null, false),
('77777777-7777-7777-7777-777777777777', 'Payment Processed', 'Payment of $1,000 has been processed for milestone completion', 'payment', null, true);

-- Sample payments
INSERT INTO public.payments (user_id, project_id, amount, currency, status, payment_method, subscription_tier, billing_period) VALUES
-- Project payments
('22222222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222222', 1000.00, 'USD', 'completed', 'stripe', null, null),
('22222222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222222', 1500.00, 'USD', 'pending', 'stripe', null, null),
-- Subscription payments
('66666666-6666-6666-6666-666666666666', null, 29.99, 'USD', 'completed', 'stripe', 'pro', 'monthly'),
('77777777-7777-7777-7777-777777777777', null, 9.99, 'USD', 'completed', 'stripe', 'basic', 'monthly'),
('88888888-8888-8888-8888-888888888888', null, 99.99, 'USD', 'completed', 'stripe', 'enterprise', 'monthly'),
('99999999-9999-9999-9999-999999999999', null, 29.99, 'USD', 'completed', 'stripe', 'pro', 'monthly'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', null, 9.99, 'USD', 'completed', 'stripe', 'basic', 'monthly');

-- Sample user analytics
INSERT INTO public.user_analytics (user_id, metric_name, metric_value, date) VALUES
-- Freelancer analytics
('11111111-1111-1111-1111-111111111111', 'profile_views', 245, CURRENT_DATE - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'project_applications', 12, CURRENT_DATE - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'messages_sent', 8, CURRENT_DATE - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'profile_views', 189, CURRENT_DATE - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'project_applications', 6, CURRENT_DATE - INTERVAL '1 day'),
('33333333-3333-3333-3333-333333333333', 'profile_views', 156, CURRENT_DATE - INTERVAL '1 day'),
('33333333-3333-3333-3333-333333333333', 'project_applications', 4, CURRENT_DATE - INTERVAL '1 day'),
-- Client analytics
('66666666-6666-6666-6666-666666666666', 'project_views', 1250, CURRENT_DATE - INTERVAL '1 day'),
('66666666-6666-6666-6666-666666666666', 'applications_received', 25, CURRENT_DATE - INTERVAL '1 day'),
('77777777-7777-7777-7777-777777777777', 'project_views', 890, CURRENT_DATE - INTERVAL '1 day'),
('77777777-7777-7777-7777-777777777777', 'applications_received', 18, CURRENT_DATE - INTERVAL '1 day'),
('88888888-8888-8888-8888-888888888888', 'project_views', 567, CURRENT_DATE - INTERVAL '1 day'),
('88888888-8888-8888-8888-888888888888', 'applications_received', 12, CURRENT_DATE - INTERVAL '1 day');

-- Sample bot interactions
INSERT INTO public.bot_interactions (user_id, query, response, response_time_ms) VALUES
('11111111-1111-1111-1111-111111111111', 'How do I improve my freelancer profile?', 'To improve your freelancer profile: 1) Add a professional photo, 2) Write a compelling bio highlighting your expertise, 3) Showcase your best work in your portfolio, 4) Keep your skills updated, 5) Maintain a high response rate to messages, 6) Collect positive reviews from clients.', 250),
('66666666-6666-6666-6666-666666666666', 'What makes a good project description?', 'A good project description should: 1) Clearly state the project scope and objectives, 2) List required skills and technologies, 3) Specify timeline and budget range, 4) Include any special requirements or constraints, 5) Provide context about your company/project, 6) Be detailed enough to attract qualified freelancers.', 180),
('22222222-2222-2222-2222-222222222222', 'How to write a winning proposal?', 'To write a winning proposal: 1) Read the project description carefully, 2) Address the client''s specific needs, 3) Highlight relevant experience and portfolio pieces, 4) Provide a clear timeline and deliverables, 5) Ask thoughtful questions, 6) Be professional but personable, 7) Price competitively but fairly.', 320),
('77777777-7777-7777-7777-777777777777', 'How do I find the right freelancer?', 'To find the right freelancer: 1) Write a detailed project description, 2) Review portfolios and past work, 3) Check reviews and ratings, 4) Conduct interviews or calls, 5) Start with a small test project, 6) Look for good communication skills, 7) Consider timezone and availability.', 290);

-- Sample advertisements
INSERT INTO public.advertisements (title, description, image_url, target_url, target_user_type, target_skills, impressions, clicks) VALUES
('Upgrade to Pro - Unlock Premium Features', 'Get unlimited project applications, priority support, and advanced analytics. Start your free trial today!', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', '/subscription', 'freelancer', ARRAY['React', 'Node.js', 'Python'], 15420, 234),
('Find Top Talent Faster', 'Post your project and get proposals from verified freelancers within 24 hours. Enterprise features available.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400', '/post-jobs', 'client', null, 8930, 156),
('Master React Development', 'Join our comprehensive React course and become a sought-after developer. 50% off for freelancers!', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', 'https://reactcourse.example.com', 'freelancer', ARRAY['React', 'JavaScript'], 12340, 189),
('Freelancer Success Toolkit', 'Download our free guide with templates, pricing strategies, and client communication tips.', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400', 'https://toolkit.example.com', 'freelancer', null, 9876, 145);

-- Update subscription expiration dates for paid users
UPDATE public.profiles 
SET subscription_expires_at = NOW() + INTERVAL '1 month'
WHERE subscription_tier IN ('basic', 'pro', 'enterprise');
