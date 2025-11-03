-- ============================================================================
-- FastMVP-Core: Supabase Setup Script
-- Database Schema, Row Level Security (RLS), and Initial Seed Data
-- ============================================================================

-- ============================================================================
-- 1. ENUMS & TYPES
-- ============================================================================

CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'EDITOR');

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'USER'::user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  published BOOLEAN DEFAULT FALSE NOT NULL,
  user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  featured BOOLEAN DEFAULT FALSE NOT NULL,
  user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Images Table
CREATE TABLE IF NOT EXISTS public.images (
  id BIGSERIAL PRIMARY KEY,
  url VARCHAR(255) UNIQUE NOT NULL,
  alt VARCHAR(255),
  caption TEXT,
  user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  article_id BIGINT REFERENCES public.articles(id) ON DELETE SET NULL,
  project_id BIGINT REFERENCES public.projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_articles_user_id ON public.articles(user_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_images_user_id ON public.images(user_id);
CREATE INDEX IF NOT EXISTS idx_images_article_id ON public.images(article_id);
CREATE INDEX IF NOT EXISTS idx_images_project_id ON public.images(project_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Allow public read-only access to all users
CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT
  USING (TRUE);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE
  USING (auth.uid()::bigint = id)
  WITH CHECK (auth.uid()::bigint = id);

-- Allow users to insert (for registration, though usually handled by auth service)
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid()::bigint = id);

-- Only admins can delete users
CREATE POLICY "Only admins can delete users" ON public.users
  FOR DELETE
  USING (auth.uid()::bigint IN (SELECT id FROM public.users WHERE role = 'ADMIN'::user_role));

-- ============================================================================
-- ARTICLES TABLE POLICIES
-- ============================================================================

-- Allow public read-only access to published articles
CREATE POLICY "Published articles are visible to all" ON public.articles
  FOR SELECT
  USING (published = TRUE);

-- Allow authors and admins to see their own unpublished articles
CREATE POLICY "Users can see their own articles" ON public.articles
  FOR SELECT
  USING (
    user_id = auth.uid()::bigint
    OR auth.uid()::bigint IN (SELECT id FROM public.users WHERE role = 'ADMIN'::user_role)
  );

-- Allow users to insert articles
CREATE POLICY "Users can create articles" ON public.articles
  FOR INSERT
  WITH CHECK (auth.uid()::bigint = user_id);

-- Allow users to update their own articles
CREATE POLICY "Users can update their own articles" ON public.articles
  FOR UPDATE
  USING (auth.uid()::bigint = user_id)
  WITH CHECK (auth.uid()::bigint = user_id);

-- Allow users to delete their own articles
CREATE POLICY "Users can delete their own articles" ON public.articles
  FOR DELETE
  USING (auth.uid()::bigint = user_id);

-- ============================================================================
-- PROJECTS TABLE POLICIES
-- ============================================================================

-- Allow public read-only access to all projects
CREATE POLICY "Projects are visible to all" ON public.projects
  FOR SELECT
  USING (TRUE);

-- Allow users to insert projects
CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT
  WITH CHECK (auth.uid()::bigint = user_id);

-- Allow users to update their own projects
CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE
  USING (auth.uid()::bigint = user_id)
  WITH CHECK (auth.uid()::bigint = user_id);

-- Allow users to delete their own projects
CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE
  USING (auth.uid()::bigint = user_id);

-- ============================================================================
-- IMAGES TABLE POLICIES
-- ============================================================================

-- Allow public read-only access to all images
CREATE POLICY "Images are visible to all" ON public.images
  FOR SELECT
  USING (TRUE);

-- Allow users to insert images
CREATE POLICY "Users can create images" ON public.images
  FOR INSERT
  WITH CHECK (auth.uid()::bigint = user_id);

-- Allow users to update their own images
CREATE POLICY "Users can update their own images" ON public.images
  FOR UPDATE
  USING (auth.uid()::bigint = user_id)
  WITH CHECK (auth.uid()::bigint = user_id);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images" ON public.images
  FOR DELETE
  USING (auth.uid()::bigint = user_id);

-- ============================================================================
-- 5. SEED DATA (TEST)
-- ============================================================================

-- Note: Replace with actual auth.uid() values from Supabase Auth
-- Insert test users
INSERT INTO public.users (email, name, password, role) VALUES
  ('admin@fastmvp.com', 'Admin User', 'hashed_password_admin', 'ADMIN'::user_role),
  ('editor@fastmvp.com', 'Editor User', 'hashed_password_editor', 'EDITOR'::user_role),
  ('user@fastmvp.com', 'Regular User', 'hashed_password_user', 'USER'::user_role)
ON CONFLICT (email) DO NOTHING;

-- Insert test articles
INSERT INTO public.articles (title, content, slug, published, user_id) VALUES
  ('Welcome to FastMVP', 'This is our first article about FastMVP framework.', 'welcome-to-fastmvp', TRUE, 2),
  ('Getting Started Guide', 'Learn how to set up FastMVP in 5 minutes.', 'getting-started-guide', TRUE, 2),
  ('Advanced Features', 'Explore advanced features and best practices.', 'advanced-features', FALSE, 2)
ON CONFLICT (slug) DO NOTHING;

-- Insert test projects
INSERT INTO public.projects (title, description, slug, featured, user_id) VALUES
  ('FastMVP Framework', 'A rapid MVP development framework with Next.js and PostgreSQL.', 'fastmvp-framework', TRUE, 2),
  ('Project Management Tool', 'A collaborative project management application.', 'project-management-tool', TRUE, 3),
  ('Learning Platform', 'An online learning platform with interactive courses.', 'learning-platform', FALSE, 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert test images
INSERT INTO public.images (url, alt, caption, user_id) VALUES
  ('https://via.placeholder.com/800x600?text=FastMVP', 'FastMVP Logo', 'The FastMVP framework logo', 2),
  ('https://via.placeholder.com/800x600?text=NextJS', 'Next.js Logo', 'Next.js framework logo', 2),
  ('https://via.placeholder.com/800x600?text=PostgreSQL', 'PostgreSQL Logo', 'PostgreSQL database logo', 3)
ON CONFLICT (url) DO NOTHING;

-- ============================================================================
-- END OF SETUP SCRIPT
-- ============================================================================
