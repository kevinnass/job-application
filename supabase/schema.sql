-- =============================================
-- JobTracker — Database Schema
-- =============================================
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query)

-- 1. Create the job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT DEFAULT '',
  company_name TEXT NOT NULL DEFAULT '',
  company_info TEXT DEFAULT '',
  job_profile TEXT DEFAULT '',
  main_missions TEXT DEFAULT '',
  primary_skills TEXT DEFAULT '',
  proposed_salary TEXT DEFAULT '',
  applied_at TIMESTAMPTZ,
  company_feedback TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'applied', 'interview', 'rejected', 'accepted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index for performance
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);

-- 3. Enable Row Level Security
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies — users can only access their own data
CREATE POLICY "Users can view their own applications"
  ON public.job_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.job_applications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
  ON public.job_applications FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Auto-update updated_at on changes
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_job_application_updated
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
