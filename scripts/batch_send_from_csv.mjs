// Batch-send announcement emails using the deployed API and a CSV export.
// Usage:
//   node scripts/batch_send_from_csv.mjs imports/Orders_....csv [--dry]

import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';

const PROD_ENDPOINT = 'https://www.mindharmony.life/api/sendAnnouncement';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/batch_send_from_csv.mjs <csvPath> [--dry]');
  process.exit(1);
}

const csvPath = path.resolve(args[0]);
const isDryRun = args.includes('--dry');

function buildHtml() {
  const link = 'https://www.eventbrite.com/e/mind-harmony-presents-victor-kulish-piano-meditation-experience-tickets-1560318036249?aff=oddtdtcreator';
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <p>Hi there,</p>
      <p>This Friday, <strong>August 29th at 6:30 PM</strong>, we’re gathering at the beautiful <strong>Kate Sessions Park</strong> for an open‑air piano concert at sunset.</p>
      <p>I’ll be guiding the evening with a gentle narrative between songs—a meditative story that threads the pieces together and deepens the experience.</p>
      <p><strong>Early Bird pricing ends tomorrow</strong>, so if you’re planning to come, now’s the time to reserve your spot.</p>
      <ul style="padding-left:18px;margin:16px 0;">
        <li><strong>When:</strong> Friday, August 29th, 6:30–8:00 PM</li>
        <li><strong>Where:</strong> Kate Sessions Memorial Park, 5115 Soledad Rd, San Diego, CA 92109</li>
        <li><strong>Vibe:</strong> Grounding + restorative piano at sunset</li>
        <li><strong>Flow:</strong> A narrated story woven between songs</li>
      </ul>
      <p>
        <a href="${link}" style="background:#111;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none;display:inline-block;">
          Get Tickets – Early Bird ends tomorrow
        </a>
      </p>
      <p style="margin-top:16px;"><strong>What to bring:</strong> a blanket or low chair, a light layer, and an open heart.</p>
      <p>With gratitude,<br/>Vitiá Kulish and the Mind Harmony Team</p>
      <p style="font-size:12px;color:#666;margin-top:24px;">You’re receiving this because you attended or purchased tickets previously with Mind Harmony.</p>
    </div>
  `;
}

function normalizeEmail(e) {
  return (e || '').trim().toLowerCase();
}

function isPaid(status) {
  const s = (status || '').toString().trim().toLowerCase();
  if (!s) return true; // if absent, include
  return s.includes('completed') || s === 'paid' || s === 'succeeded' || s === 'complete' || s.includes('free');
}

async function main() {
  const csv = await fs.readFile(csvPath, 'utf8');
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
  if (parsed.errors?.length) {
    console.error('CSV parse errors:', parsed.errors.slice(0, 3));
  }

  const rows = parsed.data || [];
  const emails = new Set();
  for (const row of rows) {
    const email = normalizeEmail(row['Buyer email'] || row['Email'] || row['Attendee Email']);
    const status = row['Payment status'] || row['Status'];
    if (!email) continue;
    if (status && !isPaid(status)) continue; // include only paid if status present
    emails.add(email);
  }

  const recipients = Array.from(emails);
  console.log(`Found ${recipients.length} unique recipient(s).`);

  if (recipients.length === 0) {
    console.log('Nothing to send.');
    return;
  }

  const subject = 'Early Bird ends tomorrow — Sunset piano at Kate Sessions, Fri 6:30';
  const html = buildHtml();

  const chunkSize = 90; // keep payload smaller than API's 100 internal batch size
  for (let i = 0; i < recipients.length; i += chunkSize) {
    const to = recipients.slice(i, i + chunkSize);
    console.log(`Sending ${to.length} emails (${i + 1}..${i + to.length})...`);
    if (isDryRun) {
      console.log('[DRY RUN] Would POST to API with', to.length, 'recipients');
      continue;
    }
    const res = await fetch(PROD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, to, html })
    });
    const text = await res.text();
    console.log('API', res.status, text.slice(0, 400));
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
  }

  console.log('Done.');
}

main().catch((e) => {
  console.error('Batch send failed:', e?.message || e);
  process.exit(1);
});


