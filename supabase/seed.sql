-- SMARTCLINIC PRODUCTION SEED
-- Clinical Infrastructure: Clinique Ambroise Paré, Conakry

-- 1. CLINICS
INSERT INTO clinics (id, name, address, quartier, commune, phone, email) 
VALUES (
  'c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0',
  'Clinique Ambroise Paré',
  'Rue KI-021, face au Centre Culturel Franco-Guinéen',
  'Kipé',
  'Ratoma',
  '+224622000000',
  'contact@ambroise-pare.gn'
);

-- Note: Auth users are managed by Supabase Auth Service.
-- We assume UUIDs for the seed staff below represent auth.users.id.
-- In a real environment, you'd create these via API/Auth.

-- 2. CLINIC STAFF (RBAC Roles)
-- Admin
INSERT INTO clinic_staff (user_id, clinic_id, first_name, last_name, role)
VALUES ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0', 'Admin', 'SmartClinic', 'admin');

-- doctor: Dr. Ibrahima Bah
INSERT INTO clinic_staff (user_id, clinic_id, first_name, last_name, role, specialty)
VALUES ('d2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d2d2', 'c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0', 'Ibrahima', 'Bah', 'doctor', 'Cardiologie');

-- receptionist: Fatoumata Camara
INSERT INTO clinic_staff (user_id, clinic_id, first_name, last_name, role)
VALUES ('r3r3r3r3-r3r3-r3r3-r3r3-r3r3r3r3r3r3', 'c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0', 'Fatoumata', 'Camara', 'receptionist');

-- 3. PATIENTS (Realistic Guinean Profiles)
-- Patient 1: Mamadou Diallo (Commune de Kaloum)
INSERT INTO patients (id, clinic_id, first_name, last_name, birth_date, gender, blood_group, city, commune, quartier, phone, emergency_contact)
VALUES (
  'p4p4p4p4-p4p4-p4p4-p4p4-p4p4p4p4p4p4',
  'c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0',
  'Mamadou',
  'Diallo',
  '1985-05-12',
  'M',
  'O+',
  'Conakry',
  'Kaloum',
  'Boulbinet',
  '+224621111111',
  '{"name": "Mariama Diallo", "phone": "+224621111112", "allergies": "Pénicilline"}'
);

-- Patient 2: Aminata Condé (Commune de Matoto)
INSERT INTO patients (id, clinic_id, first_name, last_name, birth_date, gender, blood_group, city, commune, quartier, phone, emergency_contact)
VALUES (
  'p5p5p5p5-p5p5-p5p5-p5p5-p5p5p5p5p5p5',
  'c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0',
  'Aminata',
  'Condé',
  '1992-10-24',
  'F',
  'A-',
  'Conakry',
  'Matoto',
  'Sangoyah',
  '+224623333333',
  '{"name": "Sekou Condé", "phone": "+224623333334", "allergies": "Aucune", "chronic_diseases": "Asthme"}'
);

-- Patient 3: Alhassane Soumah (Commune de Dixinn)
INSERT INTO patients (id, clinic_id, first_name, last_name, birth_date, gender, blood_group, city, commune, quartier, phone, emergency_contact)
VALUES (
  'p6p6p6p6-p6p6-p6p6-p6p6-p6p6p6p6p6p6',
  'c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0',
  'Alhassane',
  'Soumah',
  '1970-02-15',
  'M',
  'AB+',
  'Conakry',
  'Dixinn',
  'Landréah',
  '+224625555555',
  '{"name": "Fode Soumah", "phone": "+224625555556"}'
);

-- 4. APPOINTMENTS
-- Completed Appointment for Mamadou Diallo
INSERT INTO appointments (id, clinic_id, patient_id, doctor_id, scheduled_at, duration_min, status, reason)
VALUES (
  'a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a7a7',
  'c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0',
  'p4p4p4p4-p4p4-p4p4-p4p4-p4p4p4p4p4p4',
  'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d2d2',
  '2026-04-07T09:00:00',
  30,
  'completed',
  'Consultation de routine (Hypertension)'
);

-- Scheduled Appointment for Aminata Condé (Tomorrow)
INSERT INTO appointments (id, clinic_id, patient_id, doctor_id, scheduled_at, duration_min, status, reason)
VALUES (
  'a8a8a8a8-a8a8-a8a8-a8a8-a8a8a8a8a8a8',
  'c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0',
  'p5p5p5p5-p5p5-p5p5-p5p5-p5p5p5p5p5p5',
  'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d2d2',
  '2026-04-09T10:30:00',
  45,
  'scheduled',
  'Suivi respiratoire'
);

-- 5. MEDICAL RECORDS
-- Record for Mamadou Diallo (Linked to completed appt)
INSERT INTO medical_records (id, clinic_id, patient_id, doctor_id, appointment_id, consultation_date, chief_complaint, diagnosis, treatment, prescription)
VALUES (
  'm9m9m9m9-m9m9-m9m9-m9m9-m9m9m9m9m9m9',
  'c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0',
  'p4p4p4p4-p4p4-p4p4-p4p4-p4p4p4p4p4p4',
  'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', -- Author
  'a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a7a7',
  '2026-04-07T09:30:00',
  'Céphalées et vertiges persistants',
  'Hypertension artérielle grade 1',
  'Réduction de la consommation de sel, marche quotidienne 20min',
  'Amlodipine 5mg: 1 comprimé par jour pendant 1 mois'
);
