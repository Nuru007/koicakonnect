import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zrmsaphrfjiezpcxnjgg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybXNhcGhyZmppZXpwY3huamdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjEzNzksImV4cCI6MjEwMjYzNzM3OX0.-TFHGXNuhFeLWGO6lfkyCZmMDxEVD1Jn2EMoASGFTDQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearData() {
  console.log('Clearing all users from Supabase...');

  // 1. Delete all users from Supabase table (cascade deletes user_categories, user_skills, etc.)
  const { error: userErr } = await supabase.from('users').delete().neq('id', 'non_existent_placeholder_id');
  if (userErr) {
    console.error('Error clearing users table:', userErr);
  } else {
    console.log('✓ Users table cleared (0 users)');
  }

  // 2. Clear avatars bucket
  console.log('Listing and clearing files in avatars storage bucket...');
  const { data: files, error: listErr } = await supabase.storage.from('avatars').list();
  if (listErr) {
    console.warn('Error listing avatars:', listErr);
  } else if (files && files.length > 0) {
    const filePaths = files.map(f => f.name);
    const { error: delErr } = await supabase.storage.from('avatars').remove(filePaths);
    if (delErr) {
      console.error('Error removing avatars:', delErr);
    } else {
      console.log(`✓ Deleted ${filePaths.length} avatar file(s) from Supabase Storage`);
    }
  } else {
    console.log('✓ Avatars bucket is already empty');
  }

  // 3. Clear users array from data/koicakonnect.json
  const jsonPath = path.join(__dirname, '..', 'data', 'koicakonnect.json');
  if (fs.existsSync(jsonPath)) {
    const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    raw.users = [];
    raw.userCategories = [];
    raw.userSkills = [];
    raw.userInterests = [];
    raw.userLanguages = [];
    raw.professionalLinks = [];
    fs.writeFileSync(jsonPath, JSON.stringify(raw, null, 2), 'utf-8');
    console.log('✓ Cleared users from local data/koicakonnect.json');
  }

  // 4. Verify user count
  const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
  console.log(`\nVerified: Current total users in Supabase = ${count || 0}`);
}

clearData().catch(err => {
  console.error('Clear failed:', err);
  process.exit(1);
});
