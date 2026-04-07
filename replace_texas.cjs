const fs = require('fs');
const path = require('path');

const tsvData = fs.readFileSync(path.join('.', 'texas_cities.txt'), 'utf-8');
const lines = tsvData.trim().split('\n').filter(l => l.trim());
const cities = [];
for (const line of lines) {
  const parts = line.split('\t');
  if (parts.length >= 3) {
    const name = parts[0].trim().replace(/"/g, '');
    let url = parts[2].trim().replace(/"/g, '').replace(/\r/g, '');
    cities.push({ name, url });
  }
}
console.log('Parsed ' + cities.length + ' cities');

const jsLines = cities.map((city, i) => {
  const comma = i < cities.length - 1 ? ',' : '';
  return '    { name: "' + city.name + '", url: "' + city.url + '" }' + comma;
});

const replacement = '  15: [ // Texas - ' + cities.length + ' cities COMPLETE\r\n' + jsLines.join('\r\n') + '\r\n  ]';

const homePath = path.join('.', 'src', 'pages', 'Home.jsx');
let content = fs.readFileSync(homePath, 'utf-8');

// Find the start marker
const startMarker = '  15: [ // Texas';
const startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
  console.error('Could not find Texas section start marker');
  process.exit(1);
}

// Find the end: look for "\n  ]" that closes this array
let depth = 0;
let foundBracket = false;
let endIdx = startIdx;
for (let i = startIdx; i < content.length; i++) {
  if (content[i] === '[') { depth++; foundBracket = true; }
  if (content[i] === ']') {
    depth--;
    if (foundBracket && depth === 0) {
      endIdx = i + 1;
      break;
    }
  }
}

const before = content.substring(0, startIdx);
const after = content.substring(endIdx);
content = before + replacement + after;

fs.writeFileSync(homePath, content, 'utf-8');
console.log('Successfully replaced Texas section with ' + cities.length + ' cities');
