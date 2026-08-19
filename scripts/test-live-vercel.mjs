import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { SignJWT } from 'jose';

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
const JWT_SECRET = new TextEncoder().encode(envVars.JWT_SECRET || 'koicakonnect-super-secret-key-2026-production-secure');

const LIVE_URL = 'https://koicakonnect.vercel.app';

async function runLiveTests() {
  console.log('================================================================');
  console.log(`TESTING LIVE DEPLOYMENT AT: ${LIVE_URL}`);
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function report(name, ok, details) {
    if (ok) {
      console.log(`✅ [PASS] ${name}`);
      if (details) console.log(`   ↳ ${details}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}`);
      if (details) console.error(`   ↳ ${details}`);
      failed++;
    }
  }

  // 1. Live Health Check
  try {
    const taxRes = await fetch(`${LIVE_URL}/api/taxonomies`);
    const taxJson = await taxRes.json();
    report('Live API /api/taxonomies Health Check', taxRes.status === 200 && taxJson.categories?.length > 0, `Status: ${taxRes.status}, Categories loaded: ${taxJson.categories?.length}`);
  } catch (err) {
    report('Live API /api/taxonomies Health Check', false, err.message);
  }

  // 2. Fetch Lucy's record from Supabase
  const { data: lucy, error: lucyErr } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'isiborlucy00@gmail.com')
    .single();

  report('Fetch Lucy Isibor draft account from DB', !lucyErr && lucy, `ID: ${lucy?.id}, Status: ${lucy?.status}`);

  // 3. Generate Session Token
  const token = await new SignJWT({
    userId: lucy.id,
    email: lucy.email,
    username: lucy.username,
    name: lucy.name,
    role: lucy.role,
    isAdmin: Boolean(lucy.is_admin),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);

  const cookieHeader = `koicakonnect_session=${token}`;

  // 4. Live GET /api/auth/me on Vercel
  try {
    const meRes = await fetch(`${LIVE_URL}/api/auth/me`, {
      headers: { Cookie: cookieHeader },
    });
    const meJson = await meRes.json();
    console.log('DEBUG meJson:', JSON.stringify(meJson, null, 2));
    const meUser = meJson.data?.user || meJson.user;
    report(
      'Live /api/auth/me session recognition on Vercel',
      meRes.status === 200 && meUser?.id === lucy.id,
      `Status: ${meRes.status}, User ID: ${meUser?.id}, Role: "${meUser?.role}"`
    );
  } catch (err) {
    report('Live /api/auth/me session recognition on Vercel', false, err.message);
  }

  // 5. Live PUT /api/profile draft save on Vercel
  try {
    const putRes = await fetch(`${LIVE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        name: 'Lucy Isibor',
        username: 'luciara',
        role: 'Development Specialist | Health, Tech & Education',
        organisation: 'KOICA Alumni Network',
        country: 'Nigeria',
        city: 'Benin City',
        bio: 'Lucy Isibor is an experienced development and public health specialist driving technology-enabled educational transformations across Africa.',
        status: 'draft',
        isDiscoverable: false,
        skills: ['Public Health Strategy', 'Educational Technology', 'Program Management'],
        interests: ['Digital Health', 'Youth Mentorship', 'Global Development'],
        languageCodes: ['en', 'fr'],
        links: [{ platform: 'linkedin', url: 'https://linkedin.com/in/lucy-isibor' }],
      }),
    });

    const putJson = await putRes.json();
    const profile = putJson.data?.profile || putJson.profile;
    report(
      'Live PUT /api/profile draft persistence on Vercel',
      putRes.status === 200 && putJson.success && profile?.status === 'draft',
      `Status: ${putRes.status}, Saved Status: ${profile?.status}, Saved Bio Length: ${profile?.bio?.length} chars`
    );
  } catch (err) {
    report('Live PUT /api/profile draft persistence on Vercel', false, err.message);
  }

  // 6. Live Discover Query (Ensure Draft user is NOT on Discover)
  try {
    const discRes = await fetch(`${LIVE_URL}/api/users?countries=Nigeria`);
    const discJson = await discRes.json();
    const users = discJson.data?.users || discJson.users || [];
    const lucyOnDiscover = users.some(u => u.id === lucy.id || u.username === 'luciara');
    report(
      'Live Discover isolation on Vercel (Draft NOT discoverable)',
      !lucyOnDiscover,
      `Draft account found on Discover: ${lucyOnDiscover} (Expected: false)`
    );
  } catch (err) {
    report('Live Discover isolation on Vercel', false, err.message);
  }

  console.log('\n================================================================');
  console.log(`LIVE VERCEL TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('================================================================\n');
}

runLiveTests();
