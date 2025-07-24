const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '../data/raw');
const PROCESSED_DIR = path.join(__dirname, '../data/processed');

function parseDate(rawDate) {
  // Try to parse formats like 'Jul 2025' or 'Dec 2021'
  const months = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };
  const parts = rawDate.trim().split(' ');
  if (parts.length === 2 && months[parts[0]]) {
    return `${parts[1]}-${months[parts[0]]}-01`;
  }
  // fallback: return as is
  return rawDate;
}

fs.readdirSync(RAW_DIR).forEach(file => {
  if (!file.endsWith('.raw')) return;
  const rawPath = path.join(RAW_DIR, file);
  const processedPath = path.join(PROCESSED_DIR, file.replace('.raw', '.csv'));
  const lines = fs.readFileSync(rawPath, 'utf8').split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return;
  const headers = lines[0].split(/\t|\|/).map(h => h.trim()).join('|');
  const processed = [headers];
  for (let i = 1; i < lines.length; ++i) {
    const cols = lines[i].split(/\t|\|/).map(c => c.trim());
    if (cols.length !== headers.split('|').length) continue;
    cols[0] = parseDate(cols[0]);
    processed.push(cols.join('|'));
  }
  fs.writeFileSync(processedPath, processed.join('\n'));
  console.log(`Converted ${file} -> ${path.basename(processedPath)}`);
}); 