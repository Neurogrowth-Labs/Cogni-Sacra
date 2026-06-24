
-- 1. Profiles (Base table extension of auth.users)
-- This table stores common information for all user types.
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text check (role in ('learner', 'instructor', 'institution')) default 'learner',
  full_name text,
  avatar_url text,
  onboarding_completed boolean default false,
  onboarding_step text default 'role-selection',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Learners Data
-- Stores specific information for students/learners.
create table public.learners_data (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  username text unique,
  display_name text,
  bio text,
  title text default 'Lifelong Learner',
  cover_image_url text,
  location_city text,
  location_country text,
  skills text[],
  social_links jsonb default '{}'::jsonb,
  education jsonb default '[]'::jsonb, -- Stores array of education objects
  learning_goals text[],
  interests text[] default '{}',
  streak_count integer default 0,
  xp_points integer default 0,
  mentorship_status text check (mentorship_status in ('seeking', 'offering', 'none')) default 'none',
  target_career text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Instructors Data
-- Stores specific information for course creators/instructors.
create table public.instructors_data (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  display_name text,
  bio text,
  social_links jsonb default '{}'::jsonb,
  accreditations text[],
  licenses text[],
  credentials text,
  resume_url text,
  verified boolean default false,
  payout_method text default 'paypal',
  payout_settings jsonb default '{"method": "paypal", "stripeConnected": false}'::jsonb,
  notification_settings jsonb default '{"studentJoins": true, "courseReviews": true, "newEnrollments": true}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Institutions Data
-- Stores specific information for universities or organizations.
create table public.institutions_data (
  id uuid references public.profiles(id) on delete cascade not null primary key,
  name text,
  tagline text,
  about text,
  banner_url text,
  logo_url text,
  domain text,
  website text,
  contact_email text,
  contact_phone text,
  verified boolean default false,
  branding_logo_url text,
  branding_primary_color text,
  settings jsonb default '{"whiteLabel": false, "multiLanguage": false, "profileVisibility": "public"}'::jsonb,
  monetization_settings jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Trigger to handle new user signup
-- Automatically creates a profile entry when a user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'learner')
  );

  -- By default, initialize as learner. The role can be updated later, 
  -- and specific data tables can be populated then.
  insert into public.learners_data (id) values (new.id);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Row Level Security (RLS) Policies
-- Secure the data so users can only edit their own information.

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.learners_data enable row level security;
alter table public.instructors_data enable row level security;
alter table public.institutions_data enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone" 
  on public.profiles for select using (true);

create policy "Users can update their own profile" 
  on public.profiles for update using (auth.uid() = id);

-- Learners Data Policies
create policy "Learners data viewable by everyone" 
  on public.learners_data for select using (true);

create policy "Learners can update their own data" 
  on public.learners_data for update using (auth.uid() = id);

create policy "Learners can insert their own data" 
  on public.learners_data for insert with check (auth.uid() = id);

-- Instructors Data Policies
create policy "Instructors data viewable by everyone" 
  on public.instructors_data for select using (true);

create policy "Instructors can update their own data" 
  on public.instructors_data for update using (auth.uid() = id);

create policy "Instructors can insert their own data" 
  on public.instructors_data for insert with check (auth.uid() = id);

-- Institutions Data Policies
create policy "Institutions data viewable by everyone" 
  on public.institutions_data for select using (true);

create policy "Institutions can update their own data" 
  on public.institutions_data for update using (auth.uid() = id);

create policy "Institutions can insert their own data" 
  on public.institutions_data for insert with check (auth.uid() = id);

-- 7. Helper function: auto-update updated_at
-- Used by triggers to keep modification timestamps current.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- 8. Helper functions for course ownership / visibility
-- These are used by RLS policies for course content tables.
create or replace function public.is_course_owner(course_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.courses c
    where c.id = course_id
      and (c.instructor_id = auth.uid() or c.institution_id = auth.uid())
  );
end;
$$ language plpgsql security definer;

create or replace function public.can_view_course(course_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.courses c
    where c.id = course_id
      and (c.status = 'published' or c.instructor_id = auth.uid() or c.institution_id = auth.uid())
  );
end;
$$ language plpgsql security definer;

-- Helpers for nested course content (lessons/quizzes/projects live under modules -> courses)
create or replace function public.is_module_course_owner(module_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.modules m
    join public.courses c on m.course_id = c.id
    where m.id = module_id
      and (c.instructor_id = auth.uid() or c.institution_id = auth.uid())
  );
end;
$$ language plpgsql security definer;

create or replace function public.can_view_module(module_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.modules m
    join public.courses c on m.course_id = c.id
    where m.id = module_id
      and (c.status = 'published' or c.instructor_id = auth.uid() or c.institution_id = auth.uid())
  );
end;
$$ language plpgsql security definer;

create or replace function public.is_lesson_course_owner(lesson_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.lessons l
    join public.modules m on l.module_id = m.id
    join public.courses c on m.course_id = c.id
    where l.id = lesson_id
      and (c.instructor_id = auth.uid() or c.institution_id = auth.uid())
  );
end;
$$ language plpgsql security definer;

create or replace function public.can_view_lesson(lesson_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.lessons l
    join public.modules m on l.module_id = m.id
    join public.courses c on m.course_id = c.id
    where l.id = lesson_id
      and (c.status = 'published' or c.instructor_id = auth.uid() or c.institution_id = auth.uid())
  );
end;
$$ language plpgsql security definer;

-- 9. MVP Course Management
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  instructor_id uuid references public.profiles(id) on delete set null,
  institution_id uuid references public.profiles(id) on delete set null,
  price numeric default 0,
  status text check (status in ('draft', 'published', 'archived')) default 'draft',
  level text check (level in ('Beginner', 'Intermediate', 'Advanced')),
  category text,
  duration text,
  language text default 'en',
  certificate_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.modules (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  order_index integer default 0,
  prerequisites uuid[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  format text check (format in ('video', 'reading', 'quiz', 'adaptive-quiz', 'project', 'live-session', 'metaverse')) default 'video',
  content text,
  duration text,
  video_url text,
  order_index integer default 0,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. MVP Progress & Enrollment
create table public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  progress integer default 0 check (progress between 0 and 100),
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  unique (user_id, course_id)
);

create table public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  completed boolean default false,
  completed_at timestamp with time zone,
  unique (user_id, lesson_id)
);

-- 11. MVP Assessment
create table public.quizzes (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  title text not null,
  questions_json jsonb default '[]'::jsonb,
  passing_score integer default 70,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  score integer default 0,
  answers_json jsonb default '{}'::jsonb,
  attempted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.projects (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  title text not null,
  brief text,
  rubric_json jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.project_submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  content text,
  file_url text,
  grade numeric,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. MVP Social & Gamification
create table public.achievements (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  icon text,
  xp_reward integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.user_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  achievement_id uuid references public.achievements(id) on delete cascade not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, achievement_id)
);

create table public.certificates (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  issued_at timestamp with time zone default timezone('utc'::text, now()) not null,
  blockchain_hash text,
  unique (user_id, course_id)
);

create table public.community_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.post_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. MVP Calendar & Scheduling
create table public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  type text check (type in ('live-session', 'mentorship', 'deadline', 'office-hours', 'other')) default 'other',
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.mentorship_sessions (
  id uuid default gen_random_uuid() primary key,
  mentor_id uuid references public.profiles(id) on delete cascade not null,
  learner_id uuid references public.profiles(id) on delete cascade not null,
  scheduled_at timestamp with time zone not null,
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. Triggers for updated_at
create trigger set_courses_updated_at
  before update on public.courses
  for each row execute procedure public.set_updated_at();

create trigger set_modules_updated_at
  before update on public.modules
  for each row execute procedure public.set_updated_at();

create trigger set_lessons_updated_at
  before update on public.lessons
  for each row execute procedure public.set_updated_at();

create trigger set_quizzes_updated_at
  before update on public.quizzes
  for each row execute procedure public.set_updated_at();

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute procedure public.set_updated_at();

create trigger set_achievements_updated_at
  before update on public.achievements
  for each row execute procedure public.set_updated_at();

create trigger set_events_updated_at
  before update on public.events
  for each row execute procedure public.set_updated_at();

create trigger set_mentorship_sessions_updated_at
  before update on public.mentorship_sessions
  for each row execute procedure public.set_updated_at();

-- 15. Enable RLS on MVP tables
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.projects enable row level security;
alter table public.project_submissions enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.certificates enable row level security;
alter table public.community_posts enable row level security;
alter table public.post_comments enable row level security;
alter table public.events enable row level security;
alter table public.mentorship_sessions enable row level security;

-- 16. RLS Policies for MVP tables

-- Courses: owners manage; published drafts are visible to owners only
create policy "Published courses are viewable by everyone"
  on public.courses for select using (status = 'published' or auth.uid() = instructor_id or auth.uid() = institution_id);

create policy "Instructors and institutions can create courses"
  on public.courses for insert with check (auth.uid() = instructor_id or auth.uid() = institution_id);

create policy "Course owners can update their courses"
  on public.courses for update using (auth.uid() = instructor_id or auth.uid() = institution_id);

create policy "Course owners can delete their courses"
  on public.courses for delete using (auth.uid() = instructor_id or auth.uid() = institution_id);

-- Modules: visible if course is published/owned; only course owners manage
create policy "Modules are viewable by course viewers"
  on public.modules for select using (public.can_view_course(course_id));

create policy "Course owners can manage modules"
  on public.modules for all using (public.is_course_owner(course_id)) with check (public.is_course_owner(course_id));

-- Lessons: same pattern as modules
create policy "Lessons are viewable by course viewers"
  on public.lessons for select using (public.can_view_module(module_id));

create policy "Course owners can manage lessons"
  on public.lessons for all using (public.is_module_course_owner(module_id)) with check (public.is_module_course_owner(module_id));

-- Quizzes & Projects: same pattern as modules (nested under lessons)
create policy "Quizzes are viewable by course viewers"
  on public.quizzes for select using (public.can_view_lesson(lesson_id));

create policy "Course owners can manage quizzes"
  on public.quizzes for all using (public.is_lesson_course_owner(lesson_id)) with check (public.is_lesson_course_owner(lesson_id));

create policy "Projects are viewable by course viewers"
  on public.projects for select using (public.can_view_lesson(lesson_id));

create policy "Course owners can manage projects"
  on public.projects for all using (public.is_lesson_course_owner(lesson_id)) with check (public.is_lesson_course_owner(lesson_id));

-- Enrollments: learners own their enrollments
create policy "Users can view their own enrollments"
  on public.enrollments for select using (auth.uid() = user_id);

create policy "Users can enroll themselves"
  on public.enrollments for insert with check (auth.uid() = user_id);

create policy "Users can update their own enrollments"
  on public.enrollments for update using (auth.uid() = user_id);

create policy "Users can delete their own enrollments"
  on public.enrollments for delete using (auth.uid() = user_id);

-- Lesson progress: learners own their progress
create policy "Users can view their own lesson progress"
  on public.lesson_progress for select using (auth.uid() = user_id);

create policy "Users can manage their own lesson progress"
  on public.lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Quiz attempts: learners own their attempts
create policy "Users can view their own quiz attempts"
  on public.quiz_attempts for select using (auth.uid() = user_id);

create policy "Users can manage their own quiz attempts"
  on public.quiz_attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Project submissions: learners own their submissions
create policy "Users can view their own project submissions"
  on public.project_submissions for select using (auth.uid() = user_id);

create policy "Users can manage their own project submissions"
  on public.project_submissions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Achievements: global read-only (seeded / managed via service role)
create policy "Achievements are viewable by everyone"
  on public.achievements for select using (true);

-- User achievements: learners own theirs
create policy "Users can view their own achievements"
  on public.user_achievements for select using (auth.uid() = user_id);

create policy "Users can manage their own achievements"
  on public.user_achievements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Certificates: learners own theirs
create policy "Users can view their own certificates"
  on public.certificates for select using (auth.uid() = user_id);

create policy "Users can receive their own certificates"
  on public.certificates for insert with check (auth.uid() = user_id);

-- Community posts and comments: public read; authors manage
create policy "Community posts are viewable by everyone"
  on public.community_posts for select using (true);

create policy "Users can create their own posts"
  on public.community_posts for insert with check (auth.uid() = user_id);

create policy "Users can update their own posts"
  on public.community_posts for update using (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.community_posts for delete using (auth.uid() = user_id);

create policy "Post comments are viewable by everyone"
  on public.post_comments for select using (true);

create policy "Users can create their own comments"
  on public.post_comments for insert with check (auth.uid() = user_id);

create policy "Users can update their own comments"
  on public.post_comments for update using (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.post_comments for delete using (auth.uid() = user_id);

-- Events: users own their calendar
create policy "Users can view their own events"
  on public.events for select using (auth.uid() = user_id);

create policy "Users can manage their own events"
  on public.events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Mentorship sessions: both mentor and learner can see and manage their sessions
create policy "Mentorship participants can view their sessions"
  on public.mentorship_sessions for select using (auth.uid() = mentor_id or auth.uid() = learner_id);

create policy "Mentorship participants can create sessions"
  on public.mentorship_sessions for insert with check (auth.uid() = mentor_id or auth.uid() = learner_id);

create policy "Mentorship participants can update their sessions"
  on public.mentorship_sessions for update using (auth.uid() = mentor_id or auth.uid() = learner_id);

create policy "Mentorship participants can delete their sessions"
  on public.mentorship_sessions for delete using (auth.uid() = mentor_id or auth.uid() = learner_id);
