-- Migration: Create sprint_projects table with RLS policies
-- Description: Sprint-specific project management with AI-powered features
-- Author: FastMVP-Core
-- Date: 2025-11-04

-- Create sprint_projects table
CREATE TABLE IF NOT EXISTS public.sprint_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'archived')),
  sprint_duration INTEGER NOT NULL DEFAULT 7 CHECK (sprint_duration > 0 AND sprint_duration <= 90),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  ai_recommendations JSONB DEFAULT '[]'::jsonb,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
  CONSTRAINT title_length CHECK (LENGTH(TRIM(title)) >= 3)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sprint_projects_user_id ON public.sprint_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_sprint_projects_status ON public.sprint_projects(status);
CREATE INDEX IF NOT EXISTS idx_sprint_projects_priority ON public.sprint_projects(priority);
CREATE INDEX IF NOT EXISTS idx_sprint_projects_created_at ON public.sprint_projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sprint_projects_tags ON public.sprint_projects USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_sprint_projects_metadata ON public.sprint_projects USING GIN(metadata);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_sprint_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_sprint_projects_updated_at ON public.sprint_projects;
CREATE TRIGGER trigger_update_sprint_projects_updated_at
  BEFORE UPDATE ON public.sprint_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sprint_projects_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.sprint_projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own sprint projects" ON public.sprint_projects;
DROP POLICY IF EXISTS "Users can create their own sprint projects" ON public.sprint_projects;
DROP POLICY IF EXISTS "Users can update their own sprint projects" ON public.sprint_projects;
DROP POLICY IF EXISTS "Users can delete their own sprint projects" ON public.sprint_projects;

-- RLS Policy: Users can view their own sprint projects
CREATE POLICY "Users can view their own sprint projects"
  ON public.sprint_projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can create their own sprint projects
CREATE POLICY "Users can create their own sprint projects"
  ON public.sprint_projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own sprint projects
CREATE POLICY "Users can update their own sprint projects"
  ON public.sprint_projects
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own sprint projects
CREATE POLICY "Users can delete their own sprint projects"
  ON public.sprint_projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.sprint_projects TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Add helpful comments
COMMENT ON TABLE public.sprint_projects IS 'Sprint-based project management with AI recommendations and progress tracking';
COMMENT ON COLUMN public.sprint_projects.id IS 'Unique identifier for the sprint project';
COMMENT ON COLUMN public.sprint_projects.user_id IS 'Reference to the user who owns this sprint project';
COMMENT ON COLUMN public.sprint_projects.title IS 'Project title (minimum 3 characters)';
COMMENT ON COLUMN public.sprint_projects.description IS 'Detailed project description';
COMMENT ON COLUMN public.sprint_projects.status IS 'Current project status: planning, in_progress, completed, or archived';
COMMENT ON COLUMN public.sprint_projects.sprint_duration IS 'Sprint duration in days (1-90)';
COMMENT ON COLUMN public.sprint_projects.start_date IS 'Sprint start date';
COMMENT ON COLUMN public.sprint_projects.end_date IS 'Sprint end date (must be >= start_date)';
COMMENT ON COLUMN public.sprint_projects.ai_recommendations IS 'AI-generated recommendations and insights stored as JSON array';
COMMENT ON COLUMN public.sprint_projects.progress_percentage IS 'Project completion percentage (0-100)';
COMMENT ON COLUMN public.sprint_projects.priority IS 'Project priority: low, medium, high, or critical';
COMMENT ON COLUMN public.sprint_projects.tags IS 'Array of tags for categorization and filtering';
COMMENT ON COLUMN public.sprint_projects.metadata IS 'Additional flexible metadata stored as JSON';
COMMENT ON COLUMN public.sprint_projects.created_at IS 'Timestamp when the project was created';
COMMENT ON COLUMN public.sprint_projects.updated_at IS 'Timestamp when the project was last updated (auto-updated)';
