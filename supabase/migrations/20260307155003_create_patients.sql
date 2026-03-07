create table patients (
    id uuid primary key default gen_random_uuid(),
    nom text not null,
    dob date not null,
    tel text,
    email text,
    patient_number text unique not null,
    qr_code_url text,
    group_sanguin text,
    allergies text[],
    antecedents_critiques text,
    clinique_id uuid references clinics(id) not null,
    created_by uuid references users(id),
    created_at timestamptz default now()
);
