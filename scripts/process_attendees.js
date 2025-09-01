const fs = require('fs');
const path = require('path');

// Read the CSV file
const inputFile = path.join(__dirname, '../imports/Attendees_1964080994993_20250901_174228_242.csv');
const outputFile = path.join(__dirname, '../imports/Past EB Attendees before Sep.csv');

try {
  const data = fs.readFileSync(inputFile, 'utf8');
  const lines = data.split('\n');
  
  // Get header line
  const header = lines[0];
  
  // Process data lines (skip header and totals/empty lines)
  const dataLines = lines.slice(1).filter(line => {
    return line.trim() && !line.startsWith('TOTALS') && line.includes('@');
  });
  
  // Use Map to deduplicate by email (case-insensitive)
  const uniqueAttendees = new Map();
  
  dataLines.forEach(line => {
    const columns = line.split(',');
    if (columns.length >= 5) {
      const email = columns[4].toLowerCase().trim(); // Attendee email column (index 4)
      
      if (email && email.includes('@')) {
        // Only keep the first occurrence of each email
        if (!uniqueAttendees.has(email)) {
          uniqueAttendees.set(email, line);
        }
      }
    }
  });
  
  // Create output content
  const outputLines = [header, ...Array.from(uniqueAttendees.values())];
  const outputContent = outputLines.join('\n');
  
  // Write the deduplicated file
  fs.writeFileSync(outputFile, outputContent);
  
  console.log(`✅ Successfully processed attendees CSV:`);
  console.log(`   Original entries: ${dataLines.length}`);
  console.log(`   Unique attendees: ${uniqueAttendees.size}`);
  console.log(`   Duplicates removed: ${dataLines.length - uniqueAttendees.size}`);
  console.log(`   Output file: ${outputFile}`);
  
} catch (error) {
  console.error('❌ Error processing CSV:', error.message);
  process.exit(1);
}
