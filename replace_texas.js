const fs = require('fs');
const path = require('path');

// Read the TSV data
const tsvData = fs.readFileSync(path.join(__dirname, 'texas_cities.txt'), 'utf-8');
const lines = tsvData.trim().split('\n').filter(l => l.trim());

// Parse each line
const cities = [];
for (const line of lines) {
  const parts = line.split('\t');
  if (parts.length >= 3) {
    const name = parts[0].trim().replace(/"/g, '');
    let url = parts[2].trim().replace(/"/g, '').replace(/\r/g, '');
    cities.push({ name, url });
  }
}

console.log(`Parsed ${cities.length} cities`);

// Generate JS array entries
const jsLines = cities.map((city, i) => {
  // Escape special chars for JS string
  const escapedUrl = city.url.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const comma = i < cities.length - 1 ? ',' : '';
  return `    { name: "${city.name}", url: "${escapedUrl}" }${comma}`;
});

// Build the replacement block
const replacement = `  15: [ // Texas - ${cities.length} cities COMPLETE\n${jsLines.join('\n')}\n  ]`;

// Read Home.jsx
const homePath = path.join(__dirname, 'src', 'pages', 'Home.jsx');
let content = fs.readFileSync(homePath, 'utf-8');

// Find and replace the Texas section (key 15)
const startPattern = /  15: \[ \/\/ Texas.*?\n/;
const startMatch = content.match(startPattern);
if (!startMatch) {
  console.error('Could not find Texas section start');
  process.exit(1);
}

const startIdx = content.indexOf(startMatch[0]);
// Find the closing bracket for this array - look for "\n  ]" after the start
let bracketCount = 0;
let endIdx = startIdx + startMatch[0].length;
for (let i = endIdx; i < content.length; i++) {
  if (content[i] === '[') bracketCount++;
  if (content[i] === ']') {
    if (bracketCount === 0) {
      endIdx = i + 1;
      break;
    }
    bracketCount--;
  }
}

// Replace
const before = content.substring(0, startIdx);
const after = content.substring(endIdx);
content = before + replacement + after;

fs.writeFileSync(homePath, content, 'utf-8');
console.log(`Successfully replaced Texas section with ${cities.length} cities`);
