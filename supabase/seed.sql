-- =========================================================================
-- Awliya Parent Portal – Supabase PostgreSQL Initial Seed Data
-- =========================================================================

-- 1. Insert Teachers
INSERT INTO public.teachers (id, full_name_ar, full_name_en, username, email, phone, languages_taught, specialization, experience, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'أ. سارة بن علي', 'Sarah Benali', 'sarah.teacher', 'sarah.benali@myschool.edu', '+213 770 300 001', ARRAY['English'], 'CEFR Grammar & Conversation', '7 years in TEFL / Cambridge Curriculum', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'مستر ديفيد ويلسون', 'Mr. David Wilson', 'david.wilson', 'david.wilson@myschool.edu', '+213 770 300 002', ARRAY['English'], 'IELTS / TOEFL & Speaking Labs', '10 years in ESL & Pronunciation', 'active'),
  ('33333333-3333-3333-3333-333333333333', 'مدام كلير ديبوا', 'Mme. Claire Dubois', 'claire.dubois', 'claire.dubois@myschool.edu', '+213 770 300 003', ARRAY['French'], 'DELF Prim & Junior Specialist', '8 years in French Pedagogy', 'active')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Groups
INSERT INTO public.groups (id, name, code, language, level, level_number, teacher_id, days_ar, days_en, start_time, end_time, max_capacity, attendance_rate, average_progress, average_performance, status)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'فوج التأسيس المتقدم A1', 'A1-G01', 'English', 'A1', 1, '11111111-1111-1111-1111-111111111111', 'الأحد / الثلاثاء', 'Sun / Tue', '16:00', '18:00', 18, 92, 75, 80, 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'فوج الطلاقة اللغوية A2', 'A2-G03', 'English', 'A2', 2, '11111111-1111-1111-1111-111111111111', 'السبت / الأربعاء', 'Sat / Wed', '18:00', '20:00', 20, 95, 67, 85, 'active'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'فوج المحادثة والتعبير B1', 'B1-G02', 'English', 'B1', 3, '22222222-2222-2222-2222-222222222222', 'الإثنين / الخميس', 'Mon / Thu', '17:30', '19:30', 15, 88, 55, 78, 'active')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Parents
INSERT INTO public.parents (id, full_name_ar, full_name_en, phone, email, national_id, address, status)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'محمد عبد الله الهادي', 'Mohamed Abdallah Al-Hadi', '+213 661 123 456', 'parent.hadi@gmail.com', 'NID-99281-DZ', 'حي النخيل، الجزائر العاصمة', 'active'),
  ('55555555-5555-5555-5555-555555555555', 'كريم منصوري', 'Karim Mansouri', '+213 550 987 654', 'karim.mansouri@yahoo.com', 'NID-77213-DZ', 'حي الورود، وهران', 'active'),
  ('66666666-6666-6666-6666-666666666666', 'فاطمة الزهراء بن ناصر', 'Fatima Zahra Bennacer', '+213 770 456 789', 'f.bennacer@outlook.com', 'NID-44120-DZ', 'حي المستقبل، قسنطينة', 'active')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Students
INSERT INTO public.students (id, matricule, full_name_ar, full_name_en, nickname_ar, date_of_birth, gender, blood_type, current_level, cefr_level, enrolled_path_ar, enrolled_path_en, language, group_id, parent_id, relationship, avatar_url, status, overall_progress, attendance_rate, average_performance, completed_lessons_count, total_lessons_count, skills_listening, skills_speaking, skills_reading, skills_writing)
VALUES
  ('77777777-7777-7777-7777-777777777777', 'STU-2025-001', 'أنس محمد الهادي', 'Anas Al-Hadi', 'أنوس', '2013-05-14', 'male', 'O+', 2, 'A2', 'المسار الأكاديمي الشامل (CEFR)', 'Comprehensive CEFR Track', 'English', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'أب', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150', 'active', 67, 95, 88, 16, 24, 90, 85, 92, 84),
  ('88888888-8888-8888-8888-888888888888', 'STU-2025-002', 'ياسمين محمد الهادي', 'Yasmine Al-Hadi', 'ياسمينة', '2015-09-20', 'female', 'A+', 1, 'A1', 'مسار الصغار التفاعلي (Young Learners)', 'Young Learners Track', 'English', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'أب', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'active', 82, 98, 92, 20, 24, 95, 90, 94, 88),
  ('99999999-9999-9999-9999-999999999999', 'STU-2025-003', 'ريان كريم منصوري', 'Rayan Mansouri', 'ريانو', '2012-11-03', 'male', 'B+', 3, 'B1', 'المسار الأكاديمي المتقدم', 'Advanced Track', 'English', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555', 'أب', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 'active', 55, 88, 76, 13, 24, 75, 78, 80, 72)
ON CONFLICT (id) DO NOTHING;

-- 5. Link Parent & Students
INSERT INTO public.parent_students (parent_id, student_id, relationship, is_primary_contact)
VALUES
  ('44444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', 'أب', true),
  ('44444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888888', 'أب', true),
  ('55555555-5555-5555-5555-555555555555', '99999999-9999-9999-9999-999999999999', 'أب', true)
ON CONFLICT (parent_id, student_id) DO NOTHING;

-- 6. Insert Sample Attendance
INSERT INTO public.attendance (student_id, group_id, date, day_name_ar, subject_ar, status, session_time_ar)
VALUES
  ('77777777-7777-7777-7777-777777777777', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE, 'اليوم', 'English Conversation Lab', 'present', '18:00 - 20:00'),
  ('77777777-7777-7777-7777-777777777777', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE - INTERVAL '3 days', 'الأربعاء', 'English Grammar & Vocabulary', 'present', '18:00 - 20:00'),
  ('88888888-8888-8888-8888-888888888888', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_DATE, 'اليوم', 'Phonics & Reading Fun', 'present', '16:00 - 18:00');

-- 7. Insert Sample Homeworks
INSERT INTO public.homeworks (student_id, group_id, title_ar, subject_ar, level, status, due_date, score, total_score, teacher_note)
VALUES
  ('77777777-7777-7777-7777-777777777777', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'واجب الأزمنة والمحادثة اليومية Unit 4', 'English Grammar', 2, 'completed', CURRENT_DATE + INTERVAL '2 days', 19, 20, 'عمل ممتاز يا أنس، دقة عالية في تصريف الأفعال الشاذة!'),
  ('77777777-7777-7777-7777-777777777777', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'تسجيل مقطع صوتي يصف الروتين اليومي', 'Speaking Skills', 2, 'pending', CURRENT_DATE + INTERVAL '5 days', NULL, 20, 'يرجى التركيز على نطق الأصوات /th/ و /r/'),
  ('88888888-8888-8888-8888-888888888888', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'تمرين قراءة الكلمات البصرية وتلوين الصور', 'Reading Fun', 1, 'completed', CURRENT_DATE + INTERVAL '1 day', 20, 20, 'رائعة جداً يا ياسمين!');

-- 8. Insert Sample Invoices
INSERT INTO public.invoices (invoice_number, student_id, parent_id, title, amount, paid_amount, due_date, status)
VALUES
  ('INV-2025-0101', '77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'رسوم الفصل الدراسي الثاني - المستوى الثاني A2', 15000, 15000, CURRENT_DATE - INTERVAL '10 days', 'paid'),
  ('INV-2025-0102', '88888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444', 'رسوم الفصل الدراسي الثاني - مسار الصغار A1', 12000, 12000, CURRENT_DATE - INTERVAL '10 days', 'paid');

-- 9. Insert Sample Announcements
INSERT INTO public.announcements (title, content, category, target_role, priority)
VALUES
  ('انطلاق المسابقة الفصلية للتهجئة والإلقاء', 'يسر إدارة الأكاديمية الإعلان عن بدء التسجيل في المسابقة الفصلية الكبرى للتهجئة والطلاقة اللغوية (Spelling Bee). نرجو من الأولياء تشجيع أبنائهم للمشاركة.', 'event', 'all', 'normal'),
  ('جدول الاختبارات التقييمية لمنتصف الفصل', 'نحيطكم علماً بأن الاختبارات الشفهية والتحريرية ستنطلق ابتداءً من الأسبوع القادم وفق الجدول الزمني المعتمد لكل فوج.', 'academic', 'all', 'urgent');
