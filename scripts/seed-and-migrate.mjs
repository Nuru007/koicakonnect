import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zrmsaphrfjiezpcxnjgg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybXNhcGhyZmppZXpwY3huamdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjEzNzksImV4cCI6MjEwMjYzNzM3OX0.-TFHGXNuhFeLWGO6lfkyCZmMDxEVD1Jn2EMoASGFTDQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const INITIAL_CATEGORIES = [
  { id: 'cat_1', name: 'Technology', slug: 'technology', icon: 'Laptop', description: 'Software, cloud, cybersecurity & digital infrastructure' },
  { id: 'cat_2', name: 'Healthcare', slug: 'healthcare', icon: 'Activity', description: 'Medicine, healthtech, clinical research & biotech' },
  { id: 'cat_3', name: 'Engineering', slug: 'engineering', icon: 'Cpu', description: 'Hardware, robotics, mechanical, civil & electrical engineering' },
  { id: 'cat_4', name: 'Finance', slug: 'finance', icon: 'TrendingUp', description: 'Fintech, investment, banking, venture capital & crypto' },
  { id: 'cat_5', name: 'Education', slug: 'education', icon: 'GraduationCap', description: 'Edtech, academia, higher education & instructional design' },
  { id: 'cat_6', name: 'Logistics', slug: 'logistics', icon: 'Truck', description: 'Supply chain, freight, maritime & autonomous transport' },
  { id: 'cat_7', name: 'Research', slug: 'research', icon: 'Microscope', description: 'Scientific exploration, R&D, quantum computing & lab science' },
  { id: 'cat_8', name: 'Entrepreneurship', slug: 'entrepreneurship', icon: 'Rocket', description: 'Startup founders, venture builders & early-stage innovators' },
  { id: 'cat_9', name: 'Agriculture', slug: 'agriculture', icon: 'Sprout', description: 'Agritech, sustainable farming, food systems & genomics' },
  { id: 'cat_10', name: 'Energy', slug: 'energy', icon: 'Zap', description: 'Clean energy, renewables, power grids, nuclear & battery storage' },
  { id: 'cat_11', name: 'Manufacturing', slug: 'manufacturing', icon: 'Factory', description: 'Industrial automation, 3D printing & precision fabrication' },
  { id: 'cat_12', name: 'Telecommunications', slug: 'telecommunications', icon: 'Radio', description: '5G/6G, satellite constellations, networking & fiber optics' },
  { id: 'cat_13', name: 'Media & Creative', slug: 'media-creative', icon: 'Sparkles', description: 'Design, audiovisual production, gaming & digital arts' },
  { id: 'cat_14', name: 'Government', slug: 'government', icon: 'Landmark', description: 'Public policy, civic tech, regulatory affairs & smart cities' },
  { id: 'cat_15', name: 'Other', slug: 'other', icon: 'Layers', description: 'Interdisciplinary, emerging fields & specialized domains' },
];

const INITIAL_LANGUAGES = [
  { id: 'lang_1', name: 'English', code: 'en' },
  { id: 'lang_2', name: 'French', code: 'fr' },
  { id: 'lang_3', name: 'Korean', code: 'ko' },
  { id: 'lang_4', name: 'Spanish', code: 'es' },
  { id: 'lang_5', name: 'German', code: 'de' },
  { id: 'lang_6', name: 'Mandarin Chinese', code: 'zh' },
  { id: 'lang_7', name: 'Japanese', code: 'ja' },
  { id: 'lang_8', name: 'Portuguese', code: 'pt' },
  { id: 'lang_9', name: 'Arabic', code: 'ar' },
  { id: 'lang_10', name: 'Hindi', code: 'hi' },
  { id: 'lang_11', name: 'Italian', code: 'it' },
  { id: 'lang_12', name: 'Dutch', code: 'nl' },
];

const INITIAL_SKILLS = [
  'Python', 'Machine Learning', 'Artificial Intelligence', 'Robotics', 'PCB Design',
  'Embedded Systems', 'Product Management', 'Data Science', 'Hardware Engineering',
  'TypeScript', 'React', 'Next.js', 'Rust', 'Go', 'Kubernetes', 'Cloud Architecture',
  'Deep Learning', 'Computer Vision', 'NLP', 'Bioinformatics', 'Quantum Computing',
  'Cybersecurity', 'Solidity', 'FPGA', 'UI/UX Design', 'Systems Architecture'
];

const INITIAL_INTERESTS = [
  'Artificial Intelligence', 'Healthcare Technology', 'Semiconductor Technology',
  'Medical Devices', 'Robotics', 'Climate Technology', 'FinTech', 'Space Exploration',
  'Autonomous Vehicles', 'Synthetic Biology', 'Quantum Information', 'Clean Energy',
  'Human-Computer Interaction', 'Decentralized Systems', 'Neurotechnology'
];

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uploadBase64Image(userId, base64Data) {
  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64Data; // Not a base64 data url, return as is
    }

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const ext = contentType.includes('png') ? 'png' : 'jpg';
    const filePath = `user_${userId}_avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn(`Failed to upload avatar to storage for user ${userId}:`, uploadError.message);
      return base64Data;
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    console.log(`Successfully uploaded avatar to CDN: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Error uploading base64 avatar:', err);
    return base64Data;
  }
}

async function run() {
  console.log('Starting seed and migration to Supabase...');

  // 1. Seed Categories
  console.log('Seeding categories...');
  const { error: catErr } = await supabase.from('categories').upsert(INITIAL_CATEGORIES, { onConflict: 'id' });
  if (catErr) console.error('Error inserting categories:', catErr);

  // 2. Seed Languages
  console.log('Seeding languages...');
  const { error: langErr } = await supabase.from('languages').upsert(INITIAL_LANGUAGES, { onConflict: 'id' });
  if (langErr) console.error('Error inserting languages:', langErr);

  // 3. Seed Skills
  console.log('Seeding skills...');
  const skillsData = INITIAL_SKILLS.map((skill, i) => ({
    id: `skill_${i + 1}`,
    name: skill,
    slug: slugify(skill),
  }));
  const { error: skillErr } = await supabase.from('skills').upsert(skillsData, { onConflict: 'slug' });
  if (skillErr) console.error('Error inserting skills:', skillErr);

  // 4. Seed Interests
  console.log('Seeding interests...');
  const interestsData = INITIAL_INTERESTS.map((interest, i) => ({
    id: `int_${i + 1}`,
    name: interest,
    slug: slugify(interest),
  }));
  const { error: intErr } = await supabase.from('interests').upsert(interestsData, { onConflict: 'slug' });
  if (intErr) console.error('Error inserting interests:', intErr);

  // 5. Read local JSON data if present
  const jsonPath = path.join(__dirname, '..', 'data', 'koicakonnect.json');
  if (fs.existsSync(jsonPath)) {
    console.log('Migrating existing data from data/koicakonnect.json...');
    const localDb = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    // Migrate skills from localDb
    if (localDb.skills && localDb.skills.length > 0) {
      await supabase.from('skills').upsert(localDb.skills, { onConflict: 'id' });
    }

    // Migrate interests from localDb
    if (localDb.interests && localDb.interests.length > 0) {
      await supabase.from('interests').upsert(localDb.interests, { onConflict: 'id' });
    }

    // Migrate Users
    if (localDb.users && localDb.users.length > 0) {
      console.log(`Migrating ${localDb.users.length} users...`);
      for (const u of localDb.users) {
        let profileImageUrl = u.profileImage || '';
        if (profileImageUrl.startsWith('data:image')) {
          profileImageUrl = await uploadBase64Image(u.id, profileImageUrl);
        }

        const userRow = {
          id: u.id,
          name: u.name,
          email: u.email.toLowerCase().trim(),
          password_hash: u.passwordHash,
          username: u.username,
          role: u.role || '',
          organisation: u.organisation || '',
          country: u.country || '',
          city: u.city || '',
          bio: u.bio || '',
          profile_image: profileImageUrl,
          preferred_language: u.preferredLanguage || 'en',
          status: u.status || 'draft',
          is_discoverable: u.isDiscoverable !== false,
          is_deactivated: !!u.isDeactivated,
          is_admin: !!u.isAdmin,
          created_at: u.createdAt || new Date().toISOString(),
          updated_at: u.updatedAt || new Date().toISOString(),
        };

        const { error: userErr } = await supabase.from('users').upsert(userRow, { onConflict: 'id' });
        if (userErr) {
          console.error(`Error migrating user ${u.email}:`, userErr);
        } else {
          console.log(`Migrated user: ${u.name} (${u.email})`);
        }
      }
    }

    // Migrate Junctions
    if (localDb.userCategories && localDb.userCategories.length > 0) {
      const rows = localDb.userCategories.map(uc => ({ user_id: uc.userId, category_id: uc.categoryId }));
      await supabase.from('user_categories').upsert(rows, { onConflict: 'user_id,category_id' });
    }

    if (localDb.userSkills && localDb.userSkills.length > 0) {
      const rows = localDb.userSkills.map(us => ({ user_id: us.userId, skill_id: us.skillId }));
      await supabase.from('user_skills').upsert(rows, { onConflict: 'user_id,skill_id' });
    }

    if (localDb.userInterests && localDb.userInterests.length > 0) {
      const rows = localDb.userInterests.map(ui => ({ user_id: ui.userId, interest_id: ui.interestId }));
      await supabase.from('user_interests').upsert(rows, { onConflict: 'user_id,interest_id' });
    }

    if (localDb.userLanguages && localDb.userLanguages.length > 0) {
      const rows = localDb.userLanguages.map(ul => ({ user_id: ul.userId, language_id: ul.languageId }));
      await supabase.from('user_languages').upsert(rows, { onConflict: 'user_id,language_id' });
    }

    if (localDb.professionalLinks && localDb.professionalLinks.length > 0) {
      const rows = localDb.professionalLinks.map(pl => ({
        id: pl.id || `link_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: pl.userId,
        platform: pl.platform,
        url: pl.url,
        title: pl.title || '',
      }));
      await supabase.from('professional_links').upsert(rows, { onConflict: 'id' });
    }
  }

  console.log('Seed and migration completed successfully!');
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
