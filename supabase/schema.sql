
-- 1. Profiles (Base table extension of auth.users)
-- This table stores common information for all user types.
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text check (role in ('learner', 'instructor', 'institution')) default 'learner',
  full_name text,
  avatar_url text,
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
  resume_url text,
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
  website text,
  contact_email text,
  contact_phone text,
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
