-- Seed data for CogniSacra Academy MVP
-- Run this after schema.sql in the Supabase SQL Editor to populate default lookup data.

-- Default achievement badges referenced by the gamification system
insert into public.achievements (name, description, icon, xp_reward) values
('First Steps', 'Completed your first lesson.', 'book-open', 100),
('Curious Mind', 'Asked a question to the AI Tutor.', 'sparkles', 150),
('Course Conqueror', 'Finished your first course.', 'trophy', 500),
('Lesson Leader', 'Complete a lesson and take a step forward.', 'trophy', 50),
('Pythonista', 'Completed the Data Science with Python course.', 'trophy', 300),
('React Master', 'Completed the Advanced React & State Management course.', 'trophy', 400),
('Design Thinker', 'Completed the AI-Powered UX/UI Design course.', 'trophy', 350),
('Cloud Explorer', 'Completed the Introduction to Cloud Computing course.', 'trophy', 250);
