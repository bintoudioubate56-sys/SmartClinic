CREATE TYPE staff_role AS ENUM ('admin', 'doctor', 'receptionist');
CREATE TYPE blood_group AS ENUM ('A+','A-','B+','B-','AB+','AB-','O+','O-','INCONNU');
CREATE TYPE gender_type AS ENUM ('M', 'F');
CREATE TYPE language_type AS ENUM ('Français','Soussou','Pular','Malinké','Autre');
CREATE TYPE appt_status AS ENUM ('scheduled','confirmed','cancelled','completed','no_show');
CREATE TYPE audit_action AS ENUM ('patient_created','patient_updated','patient_viewed','record_created','record_viewed','appointment_created','appointment_cancelled','emergency_access','login','logout');

CREATE TABLE clinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  address TEXT NOT NULL,
  quartier VARCHAR(100),
  commune VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150),
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
