
-- Staff table
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  telegram_token TEXT,
  telegram_chat_id TEXT,
  role_type TEXT NOT NULL DEFAULT '영업',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read staff basic info" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Allow all insert staff" ON public.staff FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update staff" ON public.staff FOR UPDATE USING (true);
CREATE POLICY "Allow all delete staff" ON public.staff FOR DELETE USING (true);

-- Actor-Staff assignment (many-to-many)
CREATE TABLE public.actor_staff_assignment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL,
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  assignment_type TEXT NOT NULL DEFAULT '영업 담당',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(actor_id, staff_id, assignment_type)
);
ALTER TABLE public.actor_staff_assignment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read assignments" ON public.actor_staff_assignment FOR SELECT USING (true);
CREATE POLICY "Allow all insert assignments" ON public.actor_staff_assignment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update assignments" ON public.actor_staff_assignment FOR UPDATE USING (true);
CREATE POLICY "Allow all delete assignments" ON public.actor_staff_assignment FOR DELETE USING (true);

-- Access logs table
CREATE TABLE public.access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  entry_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  exit_time TIMESTAMPTZ,
  duration_seconds INTEGER
);
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert access_logs" ON public.access_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access_logs" ON public.access_logs FOR UPDATE USING (true);
CREATE POLICY "Public read access_logs" ON public.access_logs FOR SELECT USING (true);

-- Contact inquiries table
CREATE TABLE public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL,
  name TEXT NOT NULL,
  organization TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read inquiries" ON public.contact_inquiries FOR SELECT USING (true);
