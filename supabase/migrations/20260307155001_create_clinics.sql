create table clinics (
    id uuid primary key default gen_random_uuid(),
    nom text not null,
    adresse text,
    phone text,
    specialties text[],
    heures_ouverture jsonb,
    created_at timestamptz default now()
);
