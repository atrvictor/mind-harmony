const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const FILE = path.join(process.cwd(), 'imports', 'combined_attendees_aug15.csv');

function loadCsv(file) {
  const csv = fs.readFileSync(file, 'utf8');
  const parsed = Papa.parse(csv, { header: true });
  return parsed.data.filter(r => Object.keys(r).length > 0);
}

function saveCsv(file, rows) {
  const csvOut = Papa.unparse(rows, { columns: ['Email','Name','TotalSeats','SourceDBSeats','SourceEventbriteSeats'] });
  fs.writeFileSync(file, csvOut, 'utf8');
}

function main() {
  const rows = loadCsv(FILE);
  // Normalize numbers
  rows.forEach(r => { r.TotalSeats = Number(r.TotalSeats || 0); });
  // Update Val (vallapinbratana)
  let updatedVal = false;
  for (const r of rows) {
    if ((r.Email || '').toLowerCase().includes('vallapinbratana')) {
      r.TotalSeats = 4;
      updatedVal = true;
      break;
    }
  }
  if (!updatedVal) {
    // If not found by email, try by name containing 'Val'
    for (const r of rows) {
      if ((r.Name || '').toLowerCase().startsWith('val')) {
        r.TotalSeats = 4;
        updatedVal = true;
        break;
      }
    }
  }
  // Add Olga and Miranda with 1 seat each if not present
  const addIfMissing = (name) => {
    const exists = rows.some(r => (r.Name || '').toLowerCase() === name.toLowerCase());
    if (!exists) {
      rows.push({ Email: '', Name: name, TotalSeats: 1, SourceDBSeats: 0, SourceEventbriteSeats: 0 });
    }
  };
  addIfMissing('Olga');
  addIfMissing('Miranda');

  // Compute total
  const total = rows.reduce((sum, r) => sum + Number(r.TotalSeats || 0), 0);

  // Sort by name/email for readability
  rows.sort((a,b) => (a.Name||a.Email).localeCompare(b.Name||b.Email));

  saveCsv(FILE, rows);
  console.log(`Updated ${FILE}`);
  console.log(`Total tickets: ${total}`);
}

main();
