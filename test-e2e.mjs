// Comprehensive E2E Verification Script for KoicaKonnect Platform
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🚀 Starting KoicaKonnect E2E Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      failed++;
    }
  }

  try {
    // 1. Test Homepage
    const homeRes = await fetch(`${BASE_URL}/`);
    assert(homeRes.status === 200, 'Homepage renders with HTTP 200');
    const homeHtml = await homeRes.text();
    assert(homeHtml.includes('KoicaKonnect'), 'Homepage includes "KoicaKonnect" brand');
    assert(homeHtml.includes('with your fellow leaders across Africa'), 'Homepage includes core hero discovery headline');

    // 2. Test Initial Database state for Discover
    const initialUsersRes = await fetch(`${BASE_URL}/api/users`);
    const initialUsersData = await initialUsersRes.json();
    assert(initialUsersRes.status === 200, 'GET /api/users returns HTTP 200');
    assert(Array.isArray(initialUsersData.users), 'Users array is valid array from real database');

    // 3. Test Taxonomies
    const taxRes = await fetch(`${BASE_URL}/api/taxonomies`);
    const taxData = await taxRes.json();
    assert(taxData.categories && taxData.categories.length >= 15, `Taxonomies endpoint returns ${taxData.categories?.length} master categories`);
    assert(taxData.languages && taxData.languages.some(l => l.code === 'fr') && taxData.languages.some(l => l.code === 'ko'), 'Taxonomies include French and Korean');

    // 4. Test Registration Flow
    const marcusEmail = `marcus.vance.${Date.now()}@deepmind.com`;
    const registerPayload = {
      name: 'Dr. Marcus Vance',
      email: marcusEmail,
      password: 'SecurePassword123!',
      role: 'Lead AI Research Scientist',
      organisation: 'Google DeepMind',
      country: 'United Kingdom',
      city: 'London',
    };

    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerPayload),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.success, 'User registration succeeds with 201 Created');
    assert(regData.user && regData.user.name === 'Dr. Marcus Vance', 'Registered user has correct name');

    // Extract cookie
    const rawSetCookie = regRes.headers.get('set-cookie');
    const setCookie = rawSetCookie ? rawSetCookie.split(';')[0] : '';
    assert(!!setCookie, 'Authentication session cookie issued');

    // 5. Test Current Session (/api/auth/me)
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: setCookie },
    });
    const meData = await meRes.json();
    assert(meData.user && meData.user.email === registerPayload.email, 'Current session authenticated via cookie');
    assert(meData.user.status === 'draft', 'Newly created profile starts in draft state');

    // 6. Test Profile Update & Publishing
    const userSlug = meData.user.username;
    const techCategory = taxData.categories.find(c => c.slug === 'technology');
    const researchCategory = taxData.categories.find(c => c.slug === 'research');

    const updatePayload = {
      name: 'Dr. Marcus Vance',
      role: 'Lead AI Research Scientist',
      organisation: 'Google DeepMind',
      country: 'United Kingdom',
      city: 'London',
      bio: 'Research scientist specializing in reinforcement learning, multimodal frontier models, and autonomous robotics systems.',
      profileImage: '',
      preferredLanguage: 'en',
      status: 'published',
      categoryIds: [techCategory?.id, researchCategory?.id].filter(Boolean),
      skills: ['Python', 'Deep Learning', 'Robotics', 'Machine Learning'],
      interests: ['Artificial Intelligence', 'Autonomous Vehicles', 'Climate Technology'],
      languageCodes: ['en', 'fr'],
      links: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/marcus-vance' },
        { platform: 'github', url: 'https://github.com/marcusvance' },
        { platform: 'website', url: 'https://marcusvance.ai' },
      ],
    };

    const updateRes = await fetch(`${BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: setCookie,
      },
      body: JSON.stringify(updatePayload),
    });
    const updateData = await updateRes.json();
    if (!updateData.success) console.error('PUT profile error:', updateData);
    assert(updateData.success, 'Profile updated and published successfully');
    assert(updateData.profile?.status === 'published', 'Profile status is now "published"');
    assert(updateData.profile?.skills?.length === 4, 'Profile skills correctly persisted');
    assert(updateData.profile?.links?.some(l => l.platform === 'linkedin'), 'LinkedIn link recorded');

    // 7. Test Discover Page after Publishing
    const discoverRes = await fetch(`${BASE_URL}/api/users`);
    const discoverData = await discoverRes.json();
    assert(discoverData.users.some(u => u.name === 'Dr. Marcus Vance'), 'Discover query retrieves Marcus');

    // 8. Test Search Keywords
    const querySearchRes = await fetch(`${BASE_URL}/api/users?q=DeepMind`);
    const querySearchData = await querySearchRes.json();
    assert(querySearchData.users.some(u => u.name === 'Dr. Marcus Vance'), 'Search query "DeepMind" matches profile');

    const mismatchSearchRes = await fetch(`${BASE_URL}/api/users?q=Astronaut`);
    const mismatchSearchData = await mismatchSearchRes.json();
    assert(mismatchSearchData.total === 0, 'Mismatched query "Astronaut" returns 0 results');

    // 9. Test Category Filter
    const catMatchRes = await fetch(`${BASE_URL}/api/users?category=technology`);
    const catMatchData = await catMatchRes.json();
    assert(catMatchData.users.some(u => u.name === 'Dr. Marcus Vance'), 'Filter category "technology" matches profile');

    // 10. Test Skill Filter
    const skillMatchRes = await fetch(`${BASE_URL}/api/users?skill=Python`);
    const skillMatchData = await skillMatchRes.json();
    assert(skillMatchData.users.some(u => u.name === 'Dr. Marcus Vance'), 'Skill filter "Python" matches profile');

    // 11. Test Public Profile by Username
    const currentUsername = updateData.profile.username;
    const publicProfileRes = await fetch(`${BASE_URL}/api/users/${encodeURIComponent(currentUsername)}`);
    const publicProfileData = await publicProfileRes.json();
    assert(publicProfileRes.status === 200, 'Public profile endpoint returns HTTP 200');
    assert(publicProfileData.profile && publicProfileData.profile.name === 'Dr. Marcus Vance', 'Public profile has correct name');
    assert(publicProfileData.profile.links.some(l => l.platform === 'linkedin'), 'Public profile contains LinkedIn URL');

    // 12. Cleanup Marcus
    await fetch(`${BASE_URL}/api/auth/delete-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: setCookie },
      body: JSON.stringify({ action: 'delete' }),
    });

    // 13. Test Static Routes
    const [catPageRes, countriesPageRes, discPageRes] = await Promise.all([
      fetch(`${BASE_URL}/categories`),
      fetch(`${BASE_URL}/countries`),
      fetch(`${BASE_URL}/discover`),
    ]);
    assert(catPageRes.status === 200, '/categories renders HTTP 200');
    assert(countriesPageRes.status === 200, '/countries renders HTTP 200');
    assert(discPageRes.status === 200, '/discover renders HTTP 200');

    console.log(`\n========================================`);
    console.log(`Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
