import fs from 'fs';

const rawData1 = fs.readFileSync('florida_new_cities.txt', 'utf8');
const rawData2 = fs.readFileSync('florida_cities_part2.txt', 'utf8');
const lines = (rawData1 + '\n' + rawData2).trim().split('\n').filter(line => line.trim() !== '');

const cities = lines.map(line => {
    const parts = line.split('\t');
    const name = parts[0].trim();
    // the URL can be in parts[2] or parts[1] depending on the format.
    // The format seems to be: City \t FL \t URL \t -
    let url = '';
    for (let i = 1; i < parts.length; i++) {
        if (parts[i].startsWith('http')) {
            url = parts[i].trim();
            break;
        }
    }
    return { name, url };
});

const formattedCities = cities.map(c => `    { name: "${c.name}", url: "${c.url}" }`).join(',\n');

let fileContent = fs.readFileSync('src/pages/Home.jsx', 'utf8');

// Replace the count in statesData block
const countRegex = /\{ id: 14, name: "Florida", cityCount: \d+ \}/;
fileContent = fileContent.replace(countRegex, `{ id: 14, name: "Florida", cityCount: ${cities.length} }`);

// Now replace the cities list
// Find where Florida array starts and ends
const startMarker = /14:\s*\[[^\n]*\n/;
const match = startMarker.exec(fileContent);
if (match) {
    const startIndex = match.index + match[0].length;
    // Find the end of this array, which is the next "],"
    const endIndex = fileContent.indexOf('],', startIndex);
    
    if (endIndex !== -1) {
        const header = fileContent.substring(0, match.index) + `14: [ // Florida - ${cities.length} cities COMPLETE\n`;
        const footer = fileContent.substring(endIndex);
        fileContent = header + formattedCities + '\n  ' + footer;
        fs.writeFileSync('src/pages/Home.jsx', fileContent);
        console.log('Update complete. Florida cities updated to', cities.length);
    } else {
        console.log('Could not find end of array');
    }
} else {
    console.log('Could not find start marker');
}
