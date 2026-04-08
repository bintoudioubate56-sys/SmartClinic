import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => env.split('\n').find(l => l.startsWith(key))?.split('=')[1]?.trim();

const supabase = createClient(
  getEnv('NEXT_PUBLIC_SUPABASE_URL'),
  getEnv('SUPABASE_SERVICE_ROLE_KEY'),
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const users = [
  { email: 'admin@smartclinic.gn', password: 'Admin2025!', metadata: { role: 'admin', first_name: 'Admin', last_name: 'SmartClinic' } },
  { email: 'doctor@smartclinic.gn', password: 'Dr2025!', metadata: { role: 'doctor', first_name: 'Ibrahima', last_name: 'Bah' } },
  { email: 'reception@smartclinic.gn', password: 'Rec2025!', metadata: { role: 'receptionist', first_name: 'Fatoumata', last_name: 'Camara' } },
  { email: 'patient@smartclinic.gn', password: 'Pat2025!', metadata: { role: 'patient', first_name: 'Mamadou', last_name: 'Diallo' } }
];

async function seed() {
  console.log('--- Seeding Auth Users ---');
  for (const u of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      user_metadata: u.metadata,
      email_confirm: true
    });
    
    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`User already exists: ${u.email}`);
      } else {
        console.error(`Error creating ${u.email}:`, error.message);
      }
    } else {
      console.log(`Created user: ${u.email} [${u.metadata.role}]`);
    }
  }
  console.log('---------------------------');
}

seed().catch(err => console.error('Seed script failed:', err));
