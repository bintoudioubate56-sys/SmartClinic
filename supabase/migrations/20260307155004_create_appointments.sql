create table appointments (
    id uuid primary key default gen_random_uuid(),
    patient_id uuid references patients(id) not null,
    clinic_id uuid references clinics(id) not null,
    doctor_id uuid references users(id) not null,
    datetime timestamptz not null,
    status text check (status in ('pending','confirmed','cancelled','done')) default 'pending',
    notes text,
    created_by uuid references users(id),
    created_at timestamptz default now()
);
