const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(process.env.LOCALAPPDATA || 'C:\\Users\\oyele\\AppData\\Local', 'Programs', 'Git');
fs.mkdirSync(targetDir, { recursive: true });

const zipPath = path.join(targetDir, 'mingit.zip');
const url = 'https://github.com/git-for-windows/git/releases/download/v2.45.2.windows.1/MinGit-2.45.2-64-bit.zip';

console.log('Downloading MinGit from', url, 'to', zipPath);

function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  https.get(url, (res) => {
    if (res.statusCode === 302 || res.statusCode === 301) {
      return download(res.headers.location, dest, cb);
    }
    res.pipe(file);
    file.on('finish', () => {
      file.close(cb);
    });
  }).on('error', (err) => {
    fs.unlink(dest, () => {});
    cb(err);
  });
}

download(url, zipPath, (err) => {
  if (err) {
    console.error('Download error:', err);
    return;
  }
  console.log('Downloaded. Extracting with tar...');
  try {
    execSync(`tar -xf "${zipPath}" -C "${targetDir}"`, { stdio: 'inherit' });
    console.log('MinGit extracted successfully to', targetDir);
    const gitExe = path.join(targetDir, 'cmd', 'git.exe');
    console.log('Git executable exists:', fs.existsSync(gitExe));
    const ver = execSync(`"${gitExe}" --version`, { encoding: 'utf8' });
    console.log('Version:', ver);
  } catch (e) {
    console.error('Extraction error:', e.message);
  }
});
