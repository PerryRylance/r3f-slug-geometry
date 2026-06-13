const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../dist/index.d.ts');

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const reference = '/// <reference path="../three-slug.d.ts" />\n\n';
  if (!content.includes(reference)) {
    fs.writeFileSync(filePath, reference + content, 'utf8');
    console.log('Successfully added triple-slash reference to dist/index.d.ts');
  } else {
    console.log('Reference already exists in dist/index.d.ts');
  }
} else {
  console.error('Error: dist/index.d.ts not found!');
  process.exit(1);
}
