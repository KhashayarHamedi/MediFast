-- Run this in Supabase SQL Editor after pushing Drizzle schema
-- 1. Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- 2. Users: users can read/update only their own row (matched by supabase_auth_id)
CREATE POLICY "Users can read own" ON users FOR SELECT
  USING (supabase_auth_id = auth.uid()::text);

CREATE POLICY "Users can insert own" ON users FOR INSERT
  WITH CHECK (supabase_auth_id = auth.uid()::text);

CREATE POLICY "Users can update own" ON users FOR UPDATE
  USING (supabase_auth_id = auth.uid()::text);

-- 3. Pharmacies: public read (no auth needed for listing)
CREATE POLICY "Pharmacies are public read" ON pharmacies FOR SELECT
  USING (true);

-- 4. Requests: patients see own, delivery sees pending + assigned
CREATE POLICY "Requests read" ON requests FOR SELECT
  USING (
    patient_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()::text)
    OR delivery_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()::text)
    OR (status = 'pending' AND EXISTS (SELECT 1 FROM users u WHERE u.supabase_auth_id = auth.uid()::text AND u.role = 'delivery'))
  );

CREATE POLICY "Patients create requests" ON requests FOR INSERT
  WITH CHECK (
    patient_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()::text)
  );

-- Delivery: can accept pending requests OR update their assigned requests
CREATE POLICY "Delivery update requests" ON requests FOR UPDATE
  USING (
    (status = 'pending' AND EXISTS (SELECT 1 FROM users u WHERE u.supabase_auth_id = auth.uid()::text AND u.role = 'delivery'))
    OR delivery_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()::text)
  );

-- 5. Storage bucket for prescription photos (create via Dashboard or API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('prescriptions', 'prescriptions', false);
-- CREATE POLICY "Users upload own prescriptions" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);
