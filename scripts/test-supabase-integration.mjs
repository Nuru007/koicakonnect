import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zrmsaphrfjiezpcxnjgg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybXNhcGhyZmppZXpwY3huamdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjEzNzksImV4cCI6MjEwMjYzNzM3OX0.-TFHGXNuhFeLWGO6lfkyCZmMDxEVD1Jn2EMoASGFTDQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testIntegration() {
  console.log('--- Testing Supabase Integration ---');

  // 1. Taxonomies
  const { data: categories, error: catErr } = await supabase.from('categories').select('*').order('name');
  if (catErr) throw catErr;
  console.log(`✓ Fetched ${categories.length} categories from Supabase`);

  const { data: skills, error: skillErr } = await supabase.from('skills').select('*').order('name');
  if (skillErr) throw skillErr;
  console.log(`✓ Fetched ${skills.length} skills from Supabase`);

  const { data: languages, error: langErr } = await supabase.from('languages').select('*').order('name');
  if (langErr) throw langErr;
  console.log(`✓ Fetched ${languages.length} languages from Supabase`);

  // 2. Fetch existing user
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'oyeleye.nurudeen@gmail.com')
    .single();

  if (userErr || !user) throw new Error(`Migrated user not found in Supabase: ${userErr?.message}`);
  console.log(`✓ Found migrated user: ${user.name}`);
  console.log(`  - Avatar URL: ${user.profile_image}`);

  // 3. Test Create User
  const testEmail = `test_supa_${Date.now()}@example.com`;
  const testId = `usr_test_${Date.now()}`;
  console.log(`Creating test user ${testEmail}...`);

  const { error: insErr } = await supabase.from('users').insert({
    id: testId,
    name: 'Integration Test User',
    email: testEmail,
    password_hash: '$2a$10$dummyhashfortestingonly1234567890',
    username: `test-supa-${Date.now()}`,
    role: 'Full Stack Engineer',
    organisation: 'Supabase Test Corp',
    country: 'United Kingdom',
    city: 'London',
    bio: 'Testing Supabase integration',
    status: 'published',
    is_discoverable: true,
    is_deactivated: false,
  });
  if (insErr) throw insErr;
  console.log(`✓ Created test user (ID: ${testId})`);

  // 4. Test Update User Profile + Avatar Storage Upload
  console.log('Testing avatar storage upload...');
  const sample1x1Png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const filePath = `test_${testId}_avatar.png`;

  const { error: uploadErr } = await supabase.storage
    .from('avatars')
    .upload(filePath, sample1x1Png, { contentType: 'image/png', upsert: true });

  if (uploadErr) throw uploadErr;

  const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
  console.log(`✓ Uploaded avatar to Supabase Storage CDN: ${publicUrlData.publicUrl}`);

  const { error: updateErr } = await supabase.from('users').update({
    profile_image: publicUrlData.publicUrl,
    bio: 'Updated bio in Supabase live',
  }).eq('id', testId);
  if (updateErr) throw updateErr;

  // 5. Test Junction Relations
  const { error: juncCatErr } = await supabase.from('user_categories').insert([
    { user_id: testId, category_id: 'cat_1' },
    { user_id: testId, category_id: 'cat_3' },
  ]);
  if (juncCatErr) throw juncCatErr;

  const { data: joinedCats } = await supabase
    .from('user_categories')
    .select('category:categories(*)')
    .eq('user_id', testId);

  console.log(`✓ Joined Categories: ${joinedCats.map(i => i.category.name).join(', ')}`);

  // 6. Test Aggregations
  const { data: publishedUsers } = await supabase
    .from('users')
    .select('id, name, country')
    .eq('status', 'published')
    .eq('is_discoverable', true)
    .eq('is_deactivated', false);

  console.log(`✓ Discover query returned ${publishedUsers.length} published users`);

  // 7. Cleanup
  console.log('Cleaning up test user and avatar...');
  await supabase.from('user_categories').delete().eq('user_id', testId);
  await supabase.from('users').delete().eq('id', testId);
  await supabase.storage.from('avatars').remove([filePath]);
  console.log('✓ Cleaned up test data successfully');

  console.log('\n======================================');
  console.log('ALL SUPABASE INTEGRATION TESTS PASSED!');
  console.log('======================================\n');
}

testIntegration().catch(err => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
