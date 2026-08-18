// copy-flags.js
const fs = require('fs');
const path = require('path');

const uploadDir = 'C:/Users/oyele/.gemini/antigravity-ide/brain/da39e66e-4b3f-417e-8d24-8b121ff5147c/.user_uploaded';
const targetDir = path.join(process.cwd(), 'public', 'flags');

fs.mkdirSync(targetDir, { recursive: true });

fs.copyFileSync(path.join(uploadDir, 'media_1787061467312.jpg'), path.join(targetDir, 'senegal.jpg'));
fs.copyFileSync(path.join(uploadDir, 'media_1787061479392.jpg'), path.join(targetDir, 'cameroon.jpg'));
fs.copyFileSync(path.join(uploadDir, 'media_1787061498613.png'), path.join(targetDir, 'ghana.png'));
fs.copyFileSync(path.join(uploadDir, 'media_1787061518505.jpg'), path.join(targetDir, 'nigeria.jpg'));

// Côte d'Ivoire flag SVG (Orange, White, Green vertical tricolor)
const coteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="100%" height="100%">
  <rect width="300" height="600" fill="#F77F00"/>
  <rect x="300" width="300" height="600" fill="#FFFFFF"/>
  <rect x="600" width="300" height="600" fill="#009E60"/>
</svg>`;
fs.writeFileSync(path.join(targetDir, 'cote-divoire.svg'), coteSvg, 'utf8');

console.log('Flags placed successfully:', fs.readdirSync(targetDir));
