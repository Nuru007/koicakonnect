// test-real-data.mjs
// Automated verification suite for KoicaKonnect Real-Data Architecture & Eligibility

const BASE_URL = 'http://localhost:3000';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(message);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

async function runSuite() {
  console.log('🚀 Starting KoicaKonnect Real-Data Discovery & Eligibility Suite...\n');
  let passCount = 0;

  const timestamp = Date.now();
  const aliceName = `Alice ${timestamp}`;
  const aliceEmail = `alice.${timestamp}@realuser.org`;
  const bobName = `Bob ${timestamp}`;
  const bobEmail = `bob.${timestamp}@realuser.org`;

  let aliceCookie = '';
  let bobCookie = '';

  try {
    // 1. Initial State Check
    const initialRes = await fetch(`${BASE_URL}/api/users`);
    assert(initialRes.status === 200, 'GET /api/users returns HTTP 200');
    const initialData = await initialRes.json();
    console.log(`Current published eligible count in DB: ${initialData.total}`);
    passCount++;

    // 2. Register Test User 1 (Alice)
    const aliceRegRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: aliceName,
        email: aliceEmail,
        password: 'Password123!',
        role: 'Quantum Systems Engineer',
        organisation: 'CERN Labs',
        country: 'Switzerland',
        city: 'Geneva',
      }),
    });
    assert(aliceRegRes.status === 201, 'Alice registers with HTTP 201');
    const rawAliceCookie = aliceRegRes.headers.get('set-cookie');
    aliceCookie = rawAliceCookie ? rawAliceCookie.split(';')[0] : '';
    assert(!!aliceCookie, 'Alice receives session auth cookie');
    passCount += 2;

    // 3. Newly created profile is in draft state -> Not eligible for Discover yet
    const guestQueryAfterDraft = await fetch(`${BASE_URL}/api/users`);
    const guestDataAfterDraft = await guestQueryAfterDraft.json();
    assert(
      !guestDataAfterDraft.users.some(u => u.email === aliceEmail),
      'Draft user Alice does NOT appear in Discover'
    );
    passCount++;

    // 4. Complete Alice's profile and publish
    const aliceProfileRes = await fetch(`${BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: aliceCookie,
      },
      body: JSON.stringify({
        name: aliceName,
        role: 'Quantum Systems Engineer',
        organisation: 'CERN Labs',
        country: 'Switzerland',
        city: 'Geneva',
        bio: 'Pioneering fault-tolerant quantum error correction and topological quantum computing architectures.',
        status: 'published',
        isDiscoverable: true,
        skills: ['Quantum Computing', 'Python', 'Qiskit'],
        categoryIds: ['technology', 'research'],
        languageCodes: ['en', 'fr'],
        links: [{ platform: 'linkedin', url: 'https://linkedin.com/in/aliceturing' }],
      }),
    });
    assert(aliceProfileRes.status === 200, 'Alice completes and publishes profile');
    passCount++;

    // 5. Guest discovers Alice
    const guestQueryAfterPublish = await fetch(`${BASE_URL}/api/users`);
    const guestDataAfterPublish = await guestQueryAfterPublish.json();
    assert(
      guestDataAfterPublish.users.some(u => u.name === aliceName),
      'Published Alice now appears in guest Discover search'
    );
    passCount++;

    // 6. Self-Exclusion Rule: Alice querying Discover with excludeSelf=true does NOT see her own card
    const aliceSelfDiscover = await fetch(`${BASE_URL}/api/users?excludeSelf=true`, {
      headers: { Cookie: aliceCookie },
    });
    const aliceSelfData = await aliceSelfDiscover.json();
    assert(
      !aliceSelfData.users.some(u => u.name === aliceName),
      'Self-Exclusion: Alice does NOT see her own profile when excludeSelf=true'
    );
    passCount++;

    // 7. Register User 2 (Bob)
    const bobRegRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: bobName,
        email: bobEmail,
        password: 'Password123!',
        role: 'Robotics Perception Lead',
        organisation: 'Boston Dynamic Labs',
        country: 'United States',
        city: 'Boston',
      }),
    });
    assert(bobRegRes.status === 201, 'Bob registers with HTTP 201');
    const rawBobCookie = bobRegRes.headers.get('set-cookie');
    bobCookie = rawBobCookie ? rawBobCookie.split(';')[0] : '';
    passCount++;

    // 8. Complete Bob's profile and publish
    const bobProfileRes = await fetch(`${BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: bobCookie,
      },
      body: JSON.stringify({
        name: bobName,
        role: 'Robotics Perception Lead',
        organisation: 'Boston Dynamic Labs',
        country: 'United States',
        city: 'Boston',
        bio: 'Developing visual SLAM algorithms, LiDAR point-cloud processing, and legged robotic locomotion.',
        status: 'published',
        isDiscoverable: true,
        skills: ['Robotics', 'C++', 'Computer Vision', 'ROS2'],
        categoryIds: ['engineering', 'technology'],
        languageCodes: ['en'],
        links: [{ platform: 'linkedin', url: 'https://linkedin.com/in/boblovelace' }],
      }),
    });
    assert(bobProfileRes.status === 200, 'Bob completes and publishes profile');
    passCount++;

    // 9. Inter-User Discoverability:
    // Alice sees Bob
    const aliceViewsDiscover = await fetch(`${BASE_URL}/api/users?excludeSelf=true`, {
      headers: { Cookie: aliceCookie },
    });
    const aliceViewsData = await aliceViewsDiscover.json();
    assert(
      aliceViewsData.users.some(u => u.name === bobName),
      'Alice sees Bob in Discover'
    );
    assert(
      !aliceViewsData.users.some(u => u.name === aliceName),
      'Alice still does not see herself when excludeSelf=true'
    );
    passCount += 2;

    // Bob sees Alice
    const bobViewsDiscover = await fetch(`${BASE_URL}/api/users?excludeSelf=true`, {
      headers: { Cookie: bobCookie },
    });
    const bobViewsData = await bobViewsDiscover.json();
    assert(
      bobViewsData.users.some(u => u.name === aliceName),
      'Bob sees Alice in Discover'
    );
    assert(
      !bobViewsData.users.some(u => u.name === bobName),
      'Bob does not see himself when excludeSelf=true'
    );
    passCount += 2;

    // 10. Multi-Attribute Filter Tests on Real Profiles
    // Skill Filter: "Qiskit" -> Matches Alice only
    const qiskitFilterRes = await fetch(`${BASE_URL}/api/users?skill=Qiskit`);
    const qiskitData = await qiskitFilterRes.json();
    assert(qiskitData.users.some(u => u.name === aliceName), 'Skill filter Qiskit matches Alice');
    passCount++;

    // Skill Filter: "ROS2" -> Matches Bob only
    const rosFilterRes = await fetch(`${BASE_URL}/api/users?skill=ROS2`);
    const rosData = await rosFilterRes.json();
    assert(rosData.users.some(u => u.name === bobName), 'Skill filter ROS2 matches Bob');
    passCount++;

    // Category Filter: "engineering" -> Matches Bob
    const engFilterRes = await fetch(`${BASE_URL}/api/users?category=engineering`);
    const engData = await engFilterRes.json();
    assert(engData.users.some(u => u.name === bobName), 'Category engineering matches Bob');
    passCount++;

    // Country Filter: "Switzerland" -> Matches Alice
    const chFilterRes = await fetch(`${BASE_URL}/api/users?country=Switzerland`);
    const chData = await chFilterRes.json();
    assert(chData.users.some(u => u.name === aliceName), 'Country filter Switzerland matches Alice');
    passCount++;

    // Keyword Search: "SLAM" -> Matches Bob
    const slamSearchRes = await fetch(`${BASE_URL}/api/users?q=SLAM`);
    const slamData = await slamSearchRes.json();
    assert(slamData.users.some(u => u.name === bobName), 'Keyword search SLAM matches Bob');
    passCount++;

    // 11. Discoverability Toggle Test:
    // Bob disables discoverability in Settings
    const bobToggleRes = await fetch(`${BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: bobCookie,
      },
      body: JSON.stringify({ isDiscoverable: false }),
    });
    assert(bobToggleRes.status === 200, 'Bob sets isDiscoverable: false');
    passCount++;

    // Now guest checks Discover -> Bob should NOT appear
    const guestChecksUndiscoverable = await fetch(`${BASE_URL}/api/users`);
    const guestUndiscData = await guestChecksUndiscoverable.json();
    assert(
      !guestUndiscData.users.some(u => u.name === bobName),
      'Bob with isDiscoverable: false is hidden from Discover'
    );
    passCount++;

    // 12. Account Deletion Test:
    // Alice deletes her account
    const aliceDeleteRes = await fetch(`${BASE_URL}/api/auth/delete-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: aliceCookie,
      },
      body: JSON.stringify({ action: 'delete' }),
    });
    assert(aliceDeleteRes.status === 200, 'Alice deletes account with HTTP 200');
    passCount++;

    // Alice should no longer appear on Discover for guest or anyone
    const guestAfterDelete = await fetch(`${BASE_URL}/api/users`);
    const guestDeleteData = await guestAfterDelete.json();
    assert(
      !guestDeleteData.users.some(u => u.name === aliceName),
      'Deleted user Alice is permanently removed from Discover'
    );
    passCount++;

    // Clean up Bob as well to keep DB in pristine state
    await fetch(`${BASE_URL}/api/auth/delete-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: bobCookie,
      },
      body: JSON.stringify({ action: 'delete' }),
    });

    console.log('\n========================================');
    console.log(`Summary: All ${passCount} Verification Steps Passed!`);
    console.log('========================================\n');
  } catch (error) {
    console.error('\nSuite Failed:', error);
    // Cleanup on failure
    if (aliceCookie) {
      await fetch(`${BASE_URL}/api/auth/delete-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: aliceCookie },
        body: JSON.stringify({ action: 'delete' }),
      }).catch(() => {});
    }
    if (bobCookie) {
      await fetch(`${BASE_URL}/api/auth/delete-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: bobCookie },
        body: JSON.stringify({ action: 'delete' }),
      }).catch(() => {});
    }
    process.exit(1);
  }
}

runSuite();
