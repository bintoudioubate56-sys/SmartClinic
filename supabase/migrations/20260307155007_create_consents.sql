create table consents (
    id uuid primary key default gen_random_uuid(),
    patient_id uuid references patients(id) not null,
    clinic_id uuid references clinics(id) not null,
    granted_at timestamptz default now(),
    revoked_at timestamptz
);
