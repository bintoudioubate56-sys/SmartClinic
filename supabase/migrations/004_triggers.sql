-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_clinics_updated_at BEFORE UPDATE ON clinics FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Patient number sequence and function
CREATE SEQUENCE IF NOT EXISTS patient_number_seq;

CREATE OR REPLACE FUNCTION generate_patient_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.patient_number IS NULL THEN
        NEW.patient_number := 'SC-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('patient_number_seq')::text, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_patient_number
BEFORE INSERT ON patients
FOR EACH ROW
EXECUTE FUNCTION generate_patient_number();

-- QR token generation function
CREATE OR REPLACE FUNCTION generate_qr_token()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.qr_token IS NULL THEN
        NEW.qr_token := encode(gen_random_bytes(32), 'hex');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_qr_token
BEFORE INSERT ON patients
FOR EACH ROW
EXECUTE FUNCTION generate_qr_token();
