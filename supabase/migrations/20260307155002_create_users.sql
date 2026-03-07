create table users (
    id uuid primary key references auth.users(id) on delete cascade,
    nom text not null,
    email text unique not null,
    tel text,
    role text check (role in ('superadmin','admin','doctor','reception','patient')),
    clinique_id uuid references clinics(id),
    created_at timestamptz default now()
);
