create table medical_records (
    id uuid primary key default gen_random_uuid(),
    patient_id uuid references patients(id) not null,
    clinic_id uuid references clinics(id) not null,
    type text check (type in ('result','prescription','note','file')),
    content_text text,
    file_path text,
    created_by uuid references users(id) not null,
    created_at timestamptz default now()
);
