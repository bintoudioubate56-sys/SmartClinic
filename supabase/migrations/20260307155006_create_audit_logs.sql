create table audit_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id),
    action text not null,
    target_type text,
    target_id uuid,
    ip_address text,
    timestamp timestamptz default now(),
    meta_json jsonb
);
