-- =========================================================================
-- Awliya Parent & School Portal – Supabase PostgreSQL Complete Schema
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'parent' CHECK (role IN ('super_admin', 'administrator', 'teacher', 'parent', 'student')),
  full_name_ar TEXT NOT NULL,
  full_name_en TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TEACHERS TABLE
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name_ar TEXT NOT NULL,
  full_name_en TEXT,
  username TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  languages_taught TEXT[] DEFAULT ARRAY['English'],
  specialization TEXT,
  experience TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. GROUPS / CLASSES TABLE
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  language TEXT NOT NULL DEFAULT 'English' CHECK (language IN ('English', 'French', 'Dual')),
  level TEXT NOT NULL DEFAULT 'A1',
  level_number INT NOT NULL DEFAULT 1,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  days_ar TEXT,
  days_en TEXT,
  start_time TEXT,
  end_time TEXT,
  max_capacity INT NOT NULL DEFAULT 20,
  attendance_rate NUMERIC DEFAULT 90,
  average_progress NUMERIC DEFAULT 60,
  average_performance NUMERIC DEFAULT 75,
  completed_lessons_count INT DEFAULT 12,
  total_lessons_count INT DEFAULT 24,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'completed', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PARENTS TABLE
CREATE TABLE IF NOT EXISTS public.parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name_ar TEXT NOT NULL,
  full_name_en TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  national_id TEXT,
  address TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matricule TEXT UNIQUE,
  full_name_ar TEXT NOT NULL,
  full_name_en TEXT,
  nickname_ar TEXT,
  date_of_birth DATE,
  gender TEXT DEFAULT 'male' CHECK (gender IN ('male', 'female')),
  blood_type TEXT,
  current_level INT NOT NULL DEFAULT 1,
  cefr_level TEXT NOT NULL DEFAULT 'A1',
  enrolled_path_ar TEXT DEFAULT 'المسار الأكاديمي الأساسي',
  enrolled_path_en TEXT DEFAULT 'Core Academic Track',
  language TEXT DEFAULT 'English' CHECK (language IN ('English', 'French', 'Dual')),
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES public.parents(id) ON DELETE SET NULL,
  relationship TEXT DEFAULT 'أب',
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
  overall_progress NUMERIC DEFAULT 65,
  attendance_rate NUMERIC DEFAULT 95,
  average_performance NUMERIC DEFAULT 85,
  completed_lessons_count INT DEFAULT 15,
  total_lessons_count INT DEFAULT 24,
  is_falling_behind BOOLEAN DEFAULT FALSE,
  skills_listening NUMERIC DEFAULT 0,
  skills_speaking NUMERIC DEFAULT 0,
  skills_reading NUMERIC DEFAULT 0,
  skills_writing NUMERIC DEFAULT 0,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PARENT-STUDENT LINK TABLE (For multi-child & multi-guardian support)
CREATE TABLE IF NOT EXISTS public.parent_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'ولي أمر',
  is_primary_contact BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (parent_id, student_id)
);

-- 7. ATTENDANCE RECORDS
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  day_name_ar TEXT,
  subject_ar TEXT DEFAULT 'اللغة الإنجليزية',
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  note_ar TEXT,
  session_time_ar TEXT,
  is_covering_session BOOLEAN DEFAULT FALSE,
  covering_type TEXT,
  covering_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. HOMEWORKS & ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.homeworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  title_ar TEXT NOT NULL,
  subject_ar TEXT NOT NULL,
  level INT DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'needs_revision', 'pending', 'not_started')),
  due_date DATE,
  submitted_date DATE,
  teacher_note TEXT,
  score NUMERIC,
  total_score NUMERIC DEFAULT 20,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. INVOICES & PAYMENTS
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL UNIQUE,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES public.parents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  paid_amount NUMERIC DEFAULT 0,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue', 'partial')),
  payment_method TEXT,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ANNOUNCEMENTS & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  target_role TEXT DEFAULT 'all' CHECK (target_role IN ('all', 'parent', 'teacher', 'student', 'admin')),
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('urgent', 'normal', 'low')),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- Enable Row Level Security (RLS) on all tables
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homeworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Permissive Development Policies (Allow Anon/Auth Full Access for testing & initial sync)
CREATE POLICY "Allow public read access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Allow public all on teachers" ON public.teachers FOR ALL USING (true);
CREATE POLICY "Allow public all on groups" ON public.groups FOR ALL USING (true);
CREATE POLICY "Allow public all on parents" ON public.parents FOR ALL USING (true);
CREATE POLICY "Allow public all on students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow public all on parent_students" ON public.parent_students FOR ALL USING (true);
CREATE POLICY "Allow public all on attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Allow public all on homeworks" ON public.homeworks FOR ALL USING (true);
CREATE POLICY "Allow public all on invoices" ON public.invoices FOR ALL USING (true);
CREATE POLICY "Allow public all on announcements" ON public.announcements FOR ALL USING (true);
CREATE POLICY "Allow public all on messages" ON public.messages FOR ALL USING (true);

-- Enable Realtime replication on dynamic tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
