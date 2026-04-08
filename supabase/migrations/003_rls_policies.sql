-- Enable RLS
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE record_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- clinic_staff: SELECT for staff of same clinic
CREATE POLICY select_clinic_staff ON clinic_staff FOR SELECT
USING (clinic_id IN (SELECT clinic_id FROM clinic_staff WHERE user_id = auth.uid()));

-- patients policies
CREATE POLICY doctors_see_own_clinic_patients ON patients FOR SELECT
USING (clinic_id IN (SELECT clinic_id FROM clinic_staff WHERE user_id = auth.uid() AND role = 'doctor'));

CREATE POLICY patients_see_own_record ON patients FOR SELECT
USING (email = auth.jwt() ->> 'email');

CREATE POLICY receptionist_insert_patient ON patients FOR INSERT
WITH CHECK (clinic_id IN (SELECT clinic_id FROM clinic_staff WHERE user_id = auth.uid() AND role = 'receptionist'));

-- appointments policies
CREATE POLICY staff_select_appointments ON appointments FOR SELECT
USING (clinic_id IN (SELECT clinic_id FROM clinic_staff WHERE user_id = auth.uid()));

CREATE POLICY staff_modify_appointments ON appointments FOR ALL
USING (clinic_id IN (SELECT clinic_id FROM clinic_staff WHERE user_id = auth.uid() AND role IN ('admin', 'receptionist')))
WITH CHECK (clinic_id IN (SELECT clinic_id FROM clinic_staff WHERE user_id = auth.uid() AND role IN ('admin', 'receptionist')));

-- medical_records policies
CREATE POLICY doctors_manage_medical_records ON medical_records FOR ALL
USING (clinic_id IN (SELECT clinic_id FROM clinic_staff WHERE user_id = auth.uid() AND role = 'doctor'))
WITH CHECK (clinic_id IN (SELECT clinic_id FROM clinic_staff WHERE user_id = auth.uid() AND role = 'doctor'));

CREATE POLICY patients_view_own_medical_records ON medical_records FOR SELECT
USING (patient_id IN (SELECT id FROM patients WHERE email = auth.jwt() ->> 'email'));

-- audit_logs policies
CREATE POLICY audit_insert_all ON audit_logs FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY audit_select_admin ON audit_logs FOR SELECT
USING (clinic_id IN (SELECT clinic_id FROM clinic_staff WHERE user_id = auth.uid() AND role = 'admin'));

-- record_attachments policies
CREATE POLICY staff_manage_record_attachments ON record_attachments FOR ALL
USING (record_id IN (SELECT id FROM medical_records WHERE clinic_id IN (SELECT clinic_id FROM clinic_staff WHERE user_id = auth.uid())))
WITH CHECK (record_id IN (SELECT id FROM medical_records WHERE clinic_id IN (SELECT clinic_id FROM clinic_staff WHERE user_id = auth.uid())));
