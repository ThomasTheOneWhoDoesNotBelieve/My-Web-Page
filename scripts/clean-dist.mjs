import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const astroDir = path.join(dist, '_astro');

if (!fs.existsSync(astroDir)) {
  console.log('No dist/_astro folder found.');
  process.exit(0);
}

// Files that may contain references to generated assets.
const textExtensions = new Set([
  '.html',
  '.css',
  '.js',
  '.json',
  '.xml',
  '.txt',
  '.map',
]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);

    return entry.isDirectory()
      ? walk(full)
      : [full];
  });
}

const allFiles = walk(dist);

// Combine generated text into one searchable string.
const referencedText = allFiles
  .filter((file) => textExtensions.has(path.extname(file).toLowerCase()))
  .map((file) => {
    try {
      return fs.readFileSync(file, 'utf8');
    } catch {
      return '';
    }
  })
  .join('\n');

const jpgFiles = allFiles.filter((file) => {
  const ext = path.extname(file).toLowerCase();
  return ext === '.jpg' || ext === '.jpeg';
});

let deleted = 0;
let freed = 0;

for (const file of jpgFiles) {
  const filename = path.basename(file);

  if (!referencedText.includes(filename)) {
    const size = fs.statSync(file).size;

    fs.unlinkSync(file);

    deleted++;
    freed += size;
  }
}

console.log(
  `Cleaned dist: removed ${deleted} unused JPG files, freed ${(freed / 1024 / 1024).toFixed(1)} MB.`
);