CREATE TABLE clinic_staff (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) NOT NULL,
  clinic_id   UUID REFERENCES clinics(id) ON DELETE CASCADE,
  role        staff_role NOT NULL,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, clinic_id)
);

CREATE TABLE patients (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id         UUID REFERENCES clinics(id) NOT NULL,
  patient_number    VARCHAR(20) UNIQUE,
  first_name        VARCHAR(100) NOT NULL,
  last_name         VARCHAR(100) NOT NULL,
  gender            gender_type NOT NULL,
  birth_date        DATE NOT NULL,
  blood_group       blood_group DEFAULT 'INCONNU',
  phone             VARCHAR(20),
  email             VARCHAR(150),
  address           TEXT,
  emergency_contact JSONB,
  qr_token          TEXT UNIQUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_patients_clinic ON patients(clinic_id);
CREATE INDEX idx_patients_name ON patients(last_name, first_name);

CREATE TABLE appointments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id   UUID REFERENCES clinics(id) NOT NULL,
  patient_id  UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id   UUID REFERENCES auth.users(id),
  date        TIMESTAMPTZ NOT NULL,
  status      appt_status DEFAULT 'scheduled',
  reason      TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_clinic ON appointments(clinic_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(date);

CREATE TABLE medical_records (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id     UUID REFERENCES clinics(id) NOT NULL,
  patient_id    UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id     UUID REFERENCES auth.users(id),
  content       JSONB,
  confidential  BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE record_attachments (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id     UUID REFERENCES medical_records(id) ON DELETE CASCADE,
  file_url      TEXT NOT NULL,
  file_type     VARCHAR(50),
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs ( 
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
  user_id       UUID, 
  clinic_id     UUID REFERENCES clinics(id), 
  action        audit_action NOT NULL, 
  target_table  VARCHAR(50), 
  target_id     UUID, 
  ip_address    INET, 
  user_agent    TEXT, 
  metadata      JSONB, 
  created_at    TIMESTAMPTZ DEFAULT NOW() 
); 

CREATE INDEX idx_audit_user ON audit_logs(user_id); 
CREATE INDEX idx_audit_target ON audit_logs(target_table, target_id); 
CREATE INDEX idx_audit_date ON audit_logs(created_at DESC); 
