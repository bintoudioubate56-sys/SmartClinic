-- Activer RLS sur toutes les tables
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- POLITIQUES POUR 'clinics' et 'users'
-- Nécessaires pour permettre aux politiques de fonctionner
-- --------------------------------------------------------
CREATE POLICY "Clinics - Lecture permise pour tous" ON clinics
  FOR SELECT TO authenticated USING (true);

-- Permet à l'utilisateur de lire son propre rôle et clinique_id
CREATE POLICY "Users - Lecture propre profil" ON users
  FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Users - Lecture utilisateurs meme clinique" ON users
  FOR SELECT TO authenticated 
  USING (
    clinique_id = (SELECT clinique_id FROM users WHERE id = auth.uid()) OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'superadmin'
  );

-- --------------------------------------------------------
-- PATIENTS
-- --------------------------------------------------------
CREATE POLICY "Patients - Superadmin accès total" ON patients
  FOR ALL TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'superadmin');

CREATE POLICY "Patients - Admin/Rec/Doc select" ON patients
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'reception', 'doctor') AND
    clinique_id = (SELECT clinique_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Patients - Admin/Rec/Doc insert" ON patients
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'reception', 'doctor') AND
    clinique_id = (SELECT clinique_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Patients - Admin/Rec/Doc update" ON patients
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'reception', 'doctor') AND
    clinique_id = (SELECT clinique_id FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'reception', 'doctor') AND
    clinique_id = (SELECT clinique_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Patients - Patient select propre dossier" ON patients
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND
    id = auth.uid()
  );

-- --------------------------------------------------------
-- MEDICAL_RECORDS
-- --------------------------------------------------------
CREATE POLICY "Medical_Records - Superadmin accès total" ON medical_records
  FOR ALL TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'superadmin');

CREATE POLICY "Medical_Records - Doctor select" ON medical_records
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND
    clinic_id = (SELECT clinique_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Medical_Records - Doctor insert" ON medical_records
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'doctor' AND
    clinic_id = (SELECT clinique_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Medical_Records - Patient select propre records" ON medical_records
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND
    patient_id = auth.uid()
  );

CREATE POLICY "Medical_Records - Reception select" ON medical_records
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'reception' AND
    clinic_id = (SELECT clinique_id FROM users WHERE id = auth.uid())
  );

-- --------------------------------------------------------
-- APPOINTMENTS
-- --------------------------------------------------------
CREATE POLICY "Appointments - Superadmin accès total" ON appointments
  FOR ALL TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'superadmin');

CREATE POLICY "Appointments - Staff clinique all" ON appointments
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'reception', 'doctor') AND
    clinic_id = (SELECT clinique_id FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'reception', 'doctor') AND
    clinic_id = (SELECT clinique_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Appointments - Patient select" ON appointments
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND
    patient_id = auth.uid()
  );

CREATE POLICY "Appointments - Patient insert" ON appointments
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND
    patient_id = auth.uid()
  );

-- --------------------------------------------------------
-- AUDIT_LOGS
-- --------------------------------------------------------
-- Pas de UPDATE ni DELETE
CREATE POLICY "Audit_Logs - Insert allow" ON audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Audit_Logs - Superadmin select" ON audit_logs
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'superadmin'
  );

CREATE POLICY "Audit_Logs - Admin select" ON audit_logs
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin' AND
    user_id IN (SELECT id FROM users WHERE clinique_id = (SELECT clinique_id FROM users WHERE id = auth.uid()))
  );

-- --------------------------------------------------------
-- CONSENTS
-- --------------------------------------------------------
CREATE POLICY "Consents - Superadmin accès total" ON consents
  FOR ALL TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'superadmin');

CREATE POLICY "Consents - Patient insert" ON consents
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND
    patient_id = auth.uid()
  );

CREATE POLICY "Consents - Patient update" ON consents
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND
    patient_id = auth.uid()
  )
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'patient' AND
    patient_id = auth.uid()
  );

CREATE POLICY "Consents - Doctor/Reception select" ON consents
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('doctor', 'reception')
  );
