-- Create ENUM types
CREATE TYPE user_role AS ENUM ('creator', 'admin', 'staff');
CREATE TYPE user_status AS ENUM ('active', 'pending', 'suspended');
CREATE TYPE profile_status AS ENUM ('active', 'inactive');
CREATE TYPE review_type AS ENUM ('performance', 'technical', 'content', 'growth');
CREATE TYPE review_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Users Table (Extended from auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role DEFAULT 'creator',
  status user_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Creator Profiles Table
CREATE TABLE public.creator_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  handle TEXT UNIQUE,
  bio TEXT,
  profile_image_url TEXT,
  banner_image_url TEXT,
  categories JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '{}'::jsonb,
  status profile_status DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reviews/Notes Table (Internal)
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  review_type review_type NOT NULL,
  notes TEXT NOT NULL,
  priority review_priority DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: 
-- 1. Can read their own record
-- 2. Admins can read all records
CREATE POLICY "Users can read own record" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all users" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
CREATE POLICY "Users can update own record" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Creator Profiles:
-- 1. Public can read active profiles
-- 2. Creators can manage their own profile
-- 3. Admins can manage all profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.creator_profiles FOR SELECT USING (status = 'active');
CREATE POLICY "Creators can view their own profile." ON public.creator_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Creators can update their own profile." ON public.creator_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Creators can insert their own profile." ON public.creator_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins have full access to profiles." ON public.creator_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- Reviews:
-- 1. Admins/Staff only
CREATE POLICY "Admins and staff can view reviews." ON public.reviews FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
CREATE POLICY "Admins and staff can insert reviews." ON public.reviews FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
CREATE POLICY "Admins and staff can update reviews." ON public.reviews FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
