/*
 Combines attendees from:
 1) Supabase reservations for event_id = 1 (summing seats per email)
 2) Eventbrite CSV at imports/MH aug 15 Attendees Eventbrite.csv (summing ticket quantity or repeated rows)
 Writes: imports/combined_attendees_aug15.csv with columns:
 Email,Name,TotalSeats,SourceDBSeats,SourceEventbriteSeats
*/

const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { createClient } = require('@supabase/supabase-js');

const ROOT = process.cwd();
const INPUT_CSV = path.join(ROOT, 'imports', 'MH aug 15 Attendees Eventbrite.csv');
const OUTPUT_CSV = path.join(ROOT, 'imports', 'combined_attendees_aug15.csv');

// Supabase creds from src/lib/supabase.ts
const SUPABASE_URL = 'https://zhdltlfzdybadlmgmlqa.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoZGx0bGZ6ZHliYWRsbWdtbHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MTcwOTAsImV4cCI6MjA2MjQ5MzA5MH0.SwmR40lP37sAMAGY_zalYBUlkTqDpIKtwky78KchbKs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

async function loadDbAttendees(eventId = 1) {
  const { data, error } = await supabase
    .from('reservations')
    .select('visitor_email, visitor_name, seats')
    .eq('event_id', eventId);
  if (error) throw error;
  const map = new Map();
  (data || []).forEach((r) => {
    const email = (r.visitor_email || '').toLowerCase().trim();
    if (!email) return;
    const name = (r.visitor_name || '').trim();
    const prev = map.get(email) || { name: name, dbSeats: 0, ebSeats: 0 };
    if (!prev.name && name) prev.name = name;
    prev.dbSeats += Number(r.seats || 0);
    map.set(email, prev);
  });
  return map;
}

function loadEventbrite(filePath) {
  const csv = fs.readFileSync(filePath, 'utf8');
  const parsed = Papa.parse(csv, { header: true });
  const rows = parsed.data || [];
  const map = new Map();
  rows.forEach((row) => {
    const email = (row['Attendee email'] || '').toLowerCase().trim();
    if (!email) return;
    const first = (row['Attendee first name'] || '').trim();
    const last = (row['Attendee last name'] || '').trim();
    const name = [first, last].filter(Boolean).join(' ');
    const qtyRaw = row['Ticket quantity'];
    const qty = qtyRaw ? Number(qtyRaw) : 1; // many files duplicate rows per ticket
    const prev = map.get(email) || { name, dbSeats: 0, ebSeats: 0 };
    if (!prev.name && name) prev.name = name;
    prev.ebSeats += Number.isFinite(qty) && qty > 0 ? qty : 1;
    map.set(email, prev);
  });
  return map;
}

async function main() {
  const dbMap = await loadDbAttendees(1);
  const ebMap = loadEventbrite(INPUT_CSV);

  // Merge maps
  const allEmails = new Set([...dbMap.keys(), ...ebMap.keys()]);
  // include Alex explicitly if present in community (optional) — we skip here to avoid duplicates unless needed
  const rows = [];
  for (const email of allEmails) {
    const d = dbMap.get(email) || { name: '', dbSeats: 0, ebSeats: 0 };
    const e = ebMap.get(email) || { name: '', dbSeats: 0, ebSeats: 0 };
    const name = d.name || e.name || '';
    const dbSeats = d.dbSeats || 0;
    const ebSeats = e.ebSeats || 0;
    const total = dbSeats + ebSeats;
    rows.push({ Email: email, Name: name, TotalSeats: total, SourceDBSeats: dbSeats, SourceEventbriteSeats: ebSeats });
  }

  // Sort by email
  rows.sort((a, b) => (a.Email < b.Email ? -1 : a.Email > b.Email ? 1 : 0));

  const csvOut = Papa.unparse(rows, { columns: ['Email', 'Name', 'TotalSeats', 'SourceDBSeats', 'SourceEventbriteSeats'] });
  fs.writeFileSync(OUTPUT_CSV, csvOut, 'utf8');
  console.log(`Wrote ${rows.length} rows to ${OUTPUT_CSV}`);
}

main().catch((e) => {
  console.error('Combine failed:', e);
  process.exit(1);
});




