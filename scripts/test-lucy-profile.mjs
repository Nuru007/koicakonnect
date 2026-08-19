import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      envVars[key] = val;
    }
  }
}

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('users').select('*').eq('username', 'luciara').single();
  console.log('Lucy raw user:', data, error);

  // Test assemble user profile
  const [categoriesRes, skillsRes, interestsRes, languagesRes, linksRes] = await Promise.all([
    supabase.from('user_categories').select('category:categories(*)').eq('user_id', data.id),
    supabase.from('user_skills').select('skill:skills(*)').eq('user_id', data.id),
    supabase.from('user_interests').select('interest:interests(*)').eq('user_id', data.id),
    supabase.from('user_languages').select('language:languages(*)').eq('user_id', data.id),
    supabase.from('professional_links').select('*').eq('user_id', data.id),
  ]);

  console.log('Categories res error:', categoriesRes.error);
  console.log('Skills res error:', skillsRes.error);
  console.log('Interests res error:', interestsRes.error);
  console.log('Languages res error:', languagesRes.error);
  console.log('Links res error:', linksRes.error);
}

run();
